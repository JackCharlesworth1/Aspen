import {checkTokenBelongsToUser,getUsernameFromToken} from '../database_scripts/user_database.js'
import {getUserDataByName,associateUserWithStripeCustomerID} from '../database_scripts/user_data_database.js'
import {getDBConnection} from '../database_scripts/species_database.js'
import Stripe from 'stripe'
import axios from 'axios'

const ACCOUNT_PAGE_REDIRECT="https://api.theaspenproject.cloud/api/account/api/"
const STRIPE_WEBHOOK_SECRET=process.env.STRIPE_WEBHOOK_SECRET

const db_connection=await getDBConnection();
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)

const getAccountInfoHandler=async (req,res)=>{
    if(!checkTokenBelongsToUser(req.header('Authorization'),req.params.username)){
        res=writeUserReturnResponse(res,{"Error":"The username associated with the JWT token does not match that which you are trying to access - "+req.params.username+" compared to "+getUsernameFromToken(req.header('Authorization'))})
    }else{
        const result=await getUserDataByName(db_connection,req.params.username) 
        const subscribed=(result.stripe_customer_id!==null)
        delete result.stripe_customer_id
        result.subscribed=subscribed;
        res=writeUserReturnResponse(res,result)
    }
    res.end()
}

const createCheckoutSessionHandler=async (req,res)=>{
    if(!req.body.accessToken){
        res=writeUserReturnResponse(res,{"Error":"The request to create a checkout session failed because of a lack of authentication credentials (no JWT in body)"})
    }
   const authenticated_username=getUsernameFromToken(req.body.accessToken)
  const prices = await stripe.prices.list({
    lookup_keys: [req.body.lookup_key],
    expand: ['data.product'],
  });
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    line_items: [
      {
        price: prices.data[0].id,
        // For usage-based billing, don't pass quantity
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${ACCOUNT_PAGE_REDIRECT}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${ACCOUNT_PAGE_REDIRECT}?canceled=true`,
    metadata: {
        username: authenticated_username, 
    }
  });

  res.redirect(303, session.url);
}

const createPortalSessionHandler=async(req,res)=>{
    if(!req.body.accessToken){
        res=writeUserReturnResponse(res,{"Error":"The request to create a checkout session failed because of a lack of authentication credentials (no JWT in body)"})
    }
    const authenticated_username=getUsernameFromToken(req.body.accessToken)
      // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
    // Typically this is stored alongside the authenticated user in your database.
    const { session_id } = req.body;
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    await stripe.customers.update(checkoutSession.customer, {
    metadata: {
        username: authenticated_username
    }
    });


  // This is the url to which the customer will be redirected when they're done
  // managing their billing with the portal.
  const returnUrl = ACCOUNT_PAGE_REDIRECT;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });

  res.redirect(303, portalSession.url);
}

const stripeWebhookHandler=async(req,res)=>{
   let event = req.body;
    // Replace this endpoint secret with your endpoint's unique secret
    // If you are testing with the CLI, find the secret by running 'stripe listen'
    // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
    // at https://dashboard.stripe.com/webhooks
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (STRIPE_WEBHOOK_SECRET) {
      // Get the signature sent by Stripe
      const signature = req.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
      }
    }
    let subscription;
    let status;
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.deleted':
        subscription = event.data.object;
        status = subscription.status;
        const customer = await stripe.customers.retrieve(subscription.customer);
        const subscription_username = customer.metadata.username;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription deleted.
        // handleSubscriptionDeleted(subscriptionDeleted);
        const cancel_subscription_result=await associateUserWithStripeCustomerID(db_connection,subscription_username,null)

        break;
      case 'checkout.session.completed':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription created.
        // handleSubscriptionCreated(subscription);
        const session = event.data.object;
        const checkout_username = session.metadata.username; // your internal user
        const customerID = session.customer;

        const checkout_result=await associateUserWithStripeCustomerID(db_connection,checkout_username,customerID)

        break;
    case 'invoice.payment_succeeded':
      {
        const invoice = event.data.object;
        const customer_id = invoice.customer;
        const invoice_pdf_url = invoice.invoice_pdf; // Stripe-hosted PDF URL

        // Optional: retrieve username from metadata stored on the customer
        const customer = await stripe.customers.retrieve(customer_id);
        const invoice_username = customer.metadata.username;

        // Download and save PDF locally or to cloud storage
        const pdfResponse = await axios.get(invoice_pdf_url, { responseType: 'arraybuffer' });
        const __dirname=import.meta.dirname
        const filepath=path.join(__dirname,'..','..','static','invoices',`${invoice.id}.pdf`)
        fs.writeFileSync(filepath, pdfResponse.data);

        console.log(`Saved invoice ${invoice.id} PDF for user ${invoice_username}`);
      }
      break;

      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
    // Return a 200 res to acknowledge receipt of the event
    res.send();
}

function writeUserReturnResponse(response,result){
    if(result instanceof Error){
        response.status(500).json({"Error":result});
    }else if(!result){
        response.status(404).json({"Error":"User database has no response"})
    }else{
        response.status(200).json(result);
    }
    return response;
}


export {getAccountInfoHandler,createCheckoutSessionHandler,createPortalSessionHandler,stripeWebhookHandler}
