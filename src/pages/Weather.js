import { useState, useEffect } from 'react';
import placeholder from "../images/download.jpg"


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

   
// forecast for next 5 days
  // api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}

  console.log(posWeather)


    return ( 
        <section>
            <div className='w-full relative flex justify-center'>
              <img src={placeholder} alt="Placeholder" className='w-full'/>
              <div className='absolute flex flex-col w-96 mt-10'>
              <input 
                  type="text" 
                  placeholder='Enter city/town'
                  onChange={(e) => setSearch(e.target.value)}
                  className='rounded-xl h-8 pl-4'
              />
              <button onClick={searchPressed}>Search</button>
              </div>

            <div className='flex w-full absolute bottom-0  bg-white/75'>
              <div className='flex flex-col justify-between'>
                {/* <p className='text-[76px] text-center'>{search === "" ? posWeather?.main?.temp.toFixed(0) : weatherResults?.main?.temp.toFixed(0)}&deg;</p> */}
                <p className='text-[76px] text-center'>
                  {search === "" ? (posWeather?.main?.temp !== undefined ? posWeather.main.temp.toFixed(0) + "°" : "") : (weatherResults?.main?.temp !== undefined ? weatherResults.main.temp.toFixed(0) + "°" : "")}
                </p>
                <p className='font-bold text-lg'>{search === "" ? posWeather?.name : weatherResults?.name}</p>
              </div>
              <div className='flex flex-col justify-between'>
              {
                search === "" && posWeather.weather ? (
                  <img
                    className='w-[90px] mt-5 rounded-full h-auto'
                    src={`https://openweathermap.org/img/wn/${posWeather.weather[0]?.icon}@2x.png`}
                    alt="icon"
                  />
                ) : (
                  weatherResults?.weather && (
                    <img
                      className='w-[90px] mt-5 rounded-full h-auto'
                      src={`https://openweathermap.org/img/wn/${weatherResults.weather[0]?.icon}@2x.png`}
                      alt="icon"
                    />
                  )
                )
              }
                <p className='font-bold text-lg text-center'>{search === "" ? posWeather?.weather && posWeather.weather[0]?.main : weatherResults?.weather && weatherResults.weather[0]?.main}</p>
              </div>
              <p>{errorMessage}</p>
            </div>

            </div>
              

        </section>
     );
}
 
export default Weather;