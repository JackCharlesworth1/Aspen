import {Link,useNavigate} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faReply} from '@fortawesome/free-solid-svg-icons';


const UsagePage=()=>{
    const navigate=useNavigate();

    const navigateToLanding=()=>{
        navigate("/landing")
    }

    return (<div style={{display:"flex",width:"100vw",marginBottom:"160px",flexDirection:"column"}}>
    <button style={{padding:"4px",border:"2px solid black",margin:"5px",backgroundColor:"white",width:"fit-content"}} title="Go back to landing page" onClick={navigateToLanding}>
        <FontAwesomeIcon icon={faReply} />
    </button>
    <div style={{marginLeft:"auto",marginRight:"auto",width:"65%"}}>
        <h1 style={{marginBottom:"40px"}}>Usage guide</h1>
        <h2>Getting Started</h2>
        <p>You can click here to get setup with an account, if it is your first time using you can either register, or sign in with google</p>
        <p>Once you get are logged on, you will be confronted with a variety of different organisms, from flora to fauna, click on one that looks intresting, or search for something you have in mind</p>
        <h3>Explanation of the main view</h3>
        <p>The first section of the user interface will show which organisms are connected to the one that is currently on display. You can click on these other organisms, or click on the lines that come between them to see how they are related to each other</p>
        <p>The second section of the user interface will give you information about the species, there is a picture, name, scientific name, and other coloquial names for the organism. If the organism has a specific sound associated with it, you can play it with the audio controls. There will be passages about varying aspects of the organism, you can minimise this by clicking on the heading.</p>
        <p>If you continue scrolling down, you will find a map plotting where the species has been spotted and reported, this doesn't mean the species isn't elsewhere, but it just hasn't be reported in sufficient quantities there yet</p>
        <p>The next section is an opportunity for you to mark when you have seen a species, it is a toggle button, so if you hit it by accident you can just click again. There is also a space for you to upload any pictures you have taken of sightings of an organism, you will be able to browse and view these at a later time</p>
        <p>The final section is only available for subscribed users (subscribing will be explained later on). This section allows you to input a start location, and get suggestions about nearby places where you could find that species, so if you want to see it in real life, you can get the directions to go to a spot that most likely has the organism to see it in person. This section is done one step at a time for simplicity, so keep scrolling after completing each step</p>
        <h3>Explanation of the account view</h3>
        <p>The account section can be accessed anytime by pressing the person icon, and it will take you to this screen</p>
        <p>From this screen you can log out, subscribe, see what you see the most, what you see least, get reccomendations and see a gallery of all of your sightings</p>
        <h2>Ways you can get started</h2>
        <p>You can just use this program by picking a random species and going down a rabbit hole, but there are different ways of using the product if you want.</p>
        <p>For example, you can pick a habitat i.e. wetlands, then set out to read about every species in the habitat, until you have a strong understanding of the ecosystem as a whole</p>
        <p>If you are subscribed, you can follow the reccomendations on your account page, you can get suggestions on similar things to what you have read, or you can what kind of organisms you don't tend to read about</p>
        <p>If you are subscribed, you can take photos of species you see around you, and read about all the wildlife that surrounds you</p>
        <p>That being said, you can use this information how you see fit, whether it be for intrest, research or whatever you want. You know you the best.</p>
        <Link style={{padding:"4px",border:"2px solid black",margin:"5px",backgroundColor:"white"}} to="/user/account-method">Get Started</Link>
    </div></div>)
}

export default UsagePage;
