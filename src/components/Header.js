import { Link } from "react-router-dom";



const Header = () => {
    return ( 
        <header className="bg-black text-white">
            <nav>
                <Link to="/">Home</Link>
                <Link to="weather">The weather</Link>
            </nav>
        </header>
     );
}
 
export default Header;