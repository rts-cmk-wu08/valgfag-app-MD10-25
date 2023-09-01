import { Link } from "react-router-dom";



const Home = () => {
    return ( 
        <>
            <h1>Welcome to my app check out the different pages!!!</h1>
            <p>Maybe try the Weather app <Link className="font-bold" to="/weather">Click here!!!</Link></p>
        </>
     );
}
 
export default Home;