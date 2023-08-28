import { useState, useEffect } from 'react';



const Weather = () => {
  const baseURL = "https://api.openweathermap.org/data/2.5/";
  const [myPos, setMyPos] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [search, setSearch] = useState("");
  const [weatherResults, setWeatherResults] = useState({});
  const [posWeather, setPosWeather] = useState({});

  const searchPressed = async () => {
    try {
        const response = await fetch(`${baseURL}weather?q=${search}&appid=${process.env.REACT_APP_OPENWEATHER}&units=metric`);
        if (!response.ok) {
          if(response.status !== 404) {
            setErrorMessage(response.statusText);
          }
          else{
            setErrorMessage("We are sorry the city you searched for could not be found...")
          }
            return;
        }
 
        const result = await response.json();
        setWeatherResults(result);
    } catch (error) {
        console.error("An error occurred while processing the data:", error);
    }
 };

  useEffect(() => {
    if('geolocation' in navigator) {
       navigator.geolocation.getCurrentPosition((position) => {
          setMyPos(position)
        })
    }
  }, []);

  useEffect(() => {
    if(myPos) {
      fetch(`${baseURL}weather?lat=${myPos?.coords?.latitude}&lon=${myPos?.coords?.longitude}&appid=${process.env.REACT_APP_OPENWEATHER}&units=metric`)
      .then(res => res.json())
      .then(result => {
        setPosWeather(result)
      })
    }
  }, [myPos]);

   



    return ( 
        <section>
            <h1>Check the weather</h1>
            <input 
                type="text" 
                placeholder='Enter city/town'
                onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={searchPressed}>Search</button>
            <p>{search === "" ? posWeather?.name : weatherResults?.name}</p>
            <p>{search === "" ? posWeather?.main?.temp.toFixed(0) : weatherResults?.main?.temp.toFixed(0)}</p>
            <p>{search === "" ? posWeather?.weather && posWeather.weather[0]?.main : weatherResults?.weather && weatherResults.weather[0]?.main}</p>
            <p>{search === "" ? posWeather?.weather && "("+posWeather.weather[0]?.description+")" : weatherResults?.weather && "("+weatherResults.weather[0]?.description+")"}</p>
            <p>{errorMessage}</p>
        </section>
     );
}
 
export default Weather;