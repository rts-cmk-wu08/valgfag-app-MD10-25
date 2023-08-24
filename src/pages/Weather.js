import { useState } from 'react';



const Weather = () => {
  const baseURL = "https://api.openweathermap.org/data/2.5/"; 
  const [search, setSearch] = useState("");
  const [weatherResults, setWeatherResults] = useState({});

  const searchPressed = () => {
    fetch(`${baseURL}weather?q=${search}&appid=${process.env.REACT_APP_OPENWEATHER}&units=metric`)
    .then(res => res.json())
    .then(result => {
      console.log(result)
      setWeatherResults(result)
    })
  }
    return ( 
        <section>
            <h1>Check the weather</h1>
            <input 
                type="text" 
                placeholder='Enter city/town'
                onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={searchPressed}>Search</button>
            <p>{weatherResults?.name}</p>
            <p>{weatherResults?.main?.temp.toFixed(0)}</p>
            <p>{weatherResults?.weather && weatherResults.weather[0]?.main}</p>
            <p>{weatherResults?.weather && "("+weatherResults.weather[0]?.description+")"}</p>
        </section>
     );
}
 
export default Weather;