import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "./App"
import Home from "./pages/Home";
import Weather from "./pages/Weather";

export const router = createBrowserRouter(
    createRoutesFromElements(
            <Route path="/" element={<App />} >
                <Route index element={<Home />} />
                <Route path="/weather" element={<Weather />} />
            </Route>
        )

)