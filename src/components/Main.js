import { Outlet } from "react-router-dom";


const Main = () => {
    return ( 
        <main className="flex-grow">
            <Outlet/>
        </main>
     );
}
 
export default Main;