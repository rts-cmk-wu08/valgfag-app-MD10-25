import { useState, useEffect } from 'react';
import placeholder from "../images/placeholder.jpg"


const Weather = () => {
  const baseURL = "https://api.openweathermap.org/data/2.5/";
  const [myPos, setMyPos] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [search, setSearch] = useState("");
  const [weatherResults, setWeatherResults] = useState({});
  const [posWeather, setPosWeather] = useState({});
  const [isError, setIsError] = useState(false);
  const [myPosForecastResults, setmyPosForecastResults] = useState();
  const [weatherForecastResults, setweatherForecastResults] = useState();
  const [cityResults, setCityResults] = useState();
  const [cityToFetch, setCityToFetch] = useState(null);
  const [newUrlToFetch, setNewUrlToFetch] = useState(null);
  const [imageToShow, setImageToShow] = useState();

  const searchPressed = async () => {
    try {
        const response = await fetch(`${baseURL}weather?q=${search}&appid=${process.env.REACT_APP_OPENWEATHER}&units=metric`);
        if (!response.ok) {
          if(response.status !== 404) {
            setErrorMessage(response.statusText);
            setIsError(true)
          }
          else{
            setErrorMessage("We are sorry the city you searched for could not be found...")
            setIsError(true)
          }
            return;
        }
 
        const result = await response.json();
        setIsError(false)
        setWeatherResults(result);
    } catch (error) {
        console.log("An error occurred while processing the data:", error);
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
    if (myPos) {
      // Fetch current weather data
      fetch(`${baseURL}weather?lat=${myPos?.coords?.latitude}&lon=${myPos?.coords?.longitude}&appid=${process.env.REACT_APP_OPENWEATHER}&units=metric`)
        .then(res => res.json())
        .then(result => {
          setPosWeather(result);
        })
        .catch(error => {
          console.log("An error occurred while fetching current weather:", error);
        });
   
      // Fetch forecast data
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${myPos?.coords?.latitude}&lon=${myPos?.coords?.longitude}&appid=${process.env.REACT_APP_OPENWEATHER}&units=metric`)
        .then(response => response.json())
        .then(data => setmyPosForecastResults(data?.list))
        .catch(error => console.log("An error occurred while fetching forecast:", error));
    }
   }, [myPos]);


   useEffect(() => {
      if(Object.keys(weatherResults).length !== 0) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${weatherResults?.coord?.lat}&lon=${weatherResults?.coord?.lon}&appid=${process.env.REACT_APP_OPENWEATHER}&units=metric`)
        .then(response => response.json())
        .then(data => setweatherForecastResults(data?.list))
        .catch(error => console.log("An error occurred while fetching forecast:", error));
      }
   }, [weatherResults]);

   




  const extractRelevantForecasts = () => {
    if (myPosForecastResults) {
      const relevantForecasts = {};

      myPosForecastResults.forEach(forecast => {
        const forecastTime = new Date(forecast.dt_txt); //getting the date and time
        const hours = forecastTime.getHours(); //getting the hours from a date using getHours() method

        if (hours === 12 || hours === 15 || hours === 18) {
          const date = forecastTime.toDateString();
          if (!relevantForecasts[date]) {
            relevantForecasts[date] = [];
          }

          relevantForecasts[date].push({
            time: `${hours}:00`,
            temp: forecast.main.temp.toFixed(0),
          });
        }
      });

      return relevantForecasts;
    }
    return {};
  };
  const extractRelevantForecastsWeather = () => {
    if (weatherForecastResults) {
      const relevantForecasts = {};

      weatherForecastResults.forEach(forecast => {
        const forecastTime = new Date(forecast.dt_txt); //getting the date and time
        const hours = forecastTime.getHours(); //getting the hours from a date using getHours() method

        if (hours === 12 || hours === 15 || hours === 18) {
          const date = forecastTime.toDateString();
          if (!relevantForecasts[date]) {
            relevantForecasts[date] = [];
          }

          relevantForecasts[date].push({
            time: `${hours}:00`,
            temp: forecast.main.temp.toFixed(0),
          });
        }
      });

      return relevantForecasts;
    }
    return {};
  };

  const relevantForecastsByDate = extractRelevantForecasts();
  const relevantForecastsByDateWeather = extractRelevantForecastsWeather();

  useEffect(() => {
  fetch('https://api.teleport.org/api/urban_areas/')
  .then(response => response.json())
  .then(data => setCityResults(data._links['ua:item']))
  .catch(error => console.log(error));
  }, []);   

useEffect(() => {
 let cityToFetchValue;

 if (search === "") {
   cityToFetchValue = posWeather?.name;
 } else {
   cityToFetchValue = weatherResults?.name;
 }

 const filteredCities = cityResults?.filter(
   city =>
     city.name === cityToFetchValue || city.name.toLowerCase() === cityToFetchValue
 );

 if (filteredCities?.length === 0) {
  setCityToFetch(null)
  setImageToShow(placeholder)
   console.log("No city found");
 }

 if (filteredCities && filteredCities?.length !== 0) {
   setCityToFetch(filteredCities[0].href);
 }
}, [search, posWeather, weatherResults, cityResults]);

useEffect(() => {
  if(cityToFetch !== null) {
    fetch(`${cityToFetch} `)
  .then(response => response.json())
  .then(data => setNewUrlToFetch(data?._links["ua:images"].href))
  .catch(error => console.log(error));
  } else{
    setNewUrlToFetch(null)
  }

  if(newUrlToFetch !== null) {
    fetch(`${newUrlToFetch} `)
    .then(response => response.json())
    .then(data => setImageToShow(data?.photos[0].image.web))
    .catch(error => console.log(error));
  } else {
    setImageToShow(placeholder)
  }
  

}, [cityToFetch, newUrlToFetch, search, imageToShow]);


    return ( 
        <section className='max-w-full h-full'>
            <div className='w-full h-full relative flex justify-center'>
              <img src={imageToShow} alt="Placeholder" className='w-full max-h-[691px] object-cover'/>
              <div className='absolute flex flex-col w-96 mt-10 items-center gap-6 max-w-full'>
              <input 
                  type="text" 
                  placeholder='Enter city/town'
                  onChange={(e) => setSearch(e.target.value)}
                  className='rounded-xl h-8 pl-4 w-56'
              />
              <button className='bg-white/80 rounded-xl w-36' onClick={searchPressed}>Search</button>
              </div>

            <div className='flex w-full absolute bottom-0 justify-between px-4 pb-2 bg-white/80 overflow-x-auto'>
            {isError ? <p>{errorMessage}</p> : <>
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
                    className='min-w-[100px] mt-5 rounded-full min-h-[100px]'
                    src={`https://openweathermap.org/img/wn/${posWeather.weather[0]?.icon}@2x.png`}
                    alt="icon"
                  />
                ) : (
                  weatherResults?.weather && (
                    <img
                      className='min-w-[100px] mt-5 rounded-full min-h-[100px]'
                      src={`https://openweathermap.org/img/wn/${weatherResults.weather[0]?.icon}@2x.png`}
                      alt="icon"
                    />
                  )
                )
              }
                <p className='font-bold text-lg text-center'>{search === "" ? posWeather?.weather && posWeather.weather[0]?.main : weatherResults?.weather && weatherResults.weather[0]?.main}</p>
              </div>

              
            <div className="flex gap-12 mt-5">
                {search === "" ? Object.entries(relevantForecastsByDate).map(([date, forecasts]) => (
                  <div key={date} className="flex flex-col justify-between">
                    <p className="text-xl font-bold text-center">{date}</p>
                    <div className="flex flex-col">
                      {forecasts.map((forecast, index) => (
                        <div key={index} className="flex gap-9 px-4">
                          <p className="">{forecast.time}</p>
                          <p className="">{forecast.temp}°</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )) : 
                Object.entries(relevantForecastsByDateWeather).map(([date, forecasts]) => (
                  <div key={date} className="flex flex-col justify-between">
                    <p className="text-xl font-bold text-center">{date}</p>
                    <div className="flex flex-col">
                      {forecasts.map((forecast, index) => (
                        <div key={index} className="flex gap-9 px-4">
                          <p className="">{forecast.time}</p>
                          <p className="">{forecast.temp}°</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div> </>}

            </div>
            </div>

              

        </section>
     );
}
 
export default Weather;