import {useState,useEffect} from 'react'

const PRICE_LOOKUP_KEY="pk_test_51SPOXnL7pGfYS2IvVdcc1mFxaMwaCpEawNbw3E5wQ2DnqAmaRSTDItSY4mrM2RAAfCkm1bg7tbMjoLIOyfCxYHwQ00k3DzIcHJ"

const UnsubscribedManagement=({accessToken})=>{
    return (<div>
                <h2>You are not subscribed</h2>
                <p>This means you cannot</p>
                <ul>
                    <li>(Coming soon...) Find Species Close To You</li>
                    <li>(Coming soon...) Find where to see a particular species</li>
                    <li>(Coming soon...) Identify species in a photo</li>
                </ul>
                <form action="https://api.theaspenproject.cloud/api/account/create-checkout-session" method="POST">
                    <input type="hidden" name="lookup_key" value={PRICE_LOOKUP_KEY} />
                    <input type="hidden" name="accessToken" value={accessToken} />
                    <button id="checkout-and-portal-button" type="submit">Buy Subscription (£1.99/Month)</button>
                </form>
           </div>)
}

const SubscribedManagement=({accessToken})=>{
    return (<div>
                <h2>You are subscribed</h2>
                <p>This means you have access to</p>
                <ul>
                    <li>(Coming soon...) Find Species Close To You</li>
                    <li>(Coming soon...) Find where to see a particular species</li>
                    <li>(Coming soon...) Species identification</li>
                </ul>
                <form action="https://api.theaspenproject.cloud/api/account/create-portal-session" method="POST">
                    <input type="hidden" name="lookup_key" value={PRICE_LOOKUP_KEY} />
                    <input type="hidden" name="accessToken" value={accessToken} />
                    <button id="checkout-and-portal-button" type="submit">Manage billing information</button>
                </form>
           </div>)
}

const SubscriptionManagement=({subscribed})=>{
    const [accessToken,setAccessToken]=useState(null)
    const [sessionID,setSessionID]=useState(null)
    const [message,setMessage]=useState(null);

    useEffect(()=>{
        // Check to see if this is a redirect back from Checkout
        const access_token=localStorage.getItem("accessToken")
        setAccessToken(access_token)
        const query = new URLSearchParams(window.location.search);
        if(query.get('success')) {
            setSessionID(query.get('session_id'));
        }
        if (query.get('canceled')) {
            setMessage("Order canceled")
        }
    },[sessionID])

    return (
            <div>
                {(subscribed||sessionID)?<SubscribedManagement accessToken={accessToken} />:<UnsubscribedManagement accessToken={accessToken} />} 
                {message&&<p>Something may have gone wrong- {message}</p>}
            </div>
    )
}

export default SubscriptionManagement
