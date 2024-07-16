const userFormEl = document.querySelector('#city-form');
const nameInputEl = document.querySelector('#cityName');
const oneDayCityWeatherContainerEl = document.querySelector('#one-day-weather-container');
const fiveDayCityWeatherContainerEl = document.querySelector('#five-day-weather-container');
const cityContainerEl = document.querySelector('#cities-container');
const oneDayWeatherCity = document.querySelector('#one-day-weather');
const fieDayWeatherCity = document.querySelector('#five-day-weather');
const cityArray = JSON.parse(localStorage.getItem('cityName')) || [];

const formSubmitHandler = function (event) {
  event.preventDefault();
  const cityName = nameInputEl.value.trim();

  if (cityName) {

    displayCities(cityArray, cityName);
    displayFiveDayWeathers(cityArray, cityName);
    // nameInputEl.value = '';
  } else {
    alert('Please enter a cityName');
  }

  const newCityName = cityName;
  cityArray.push(newCityName);
  localStorage.setItem('cityName', JSON.stringify(cityArray));
  // nameInputEl.value = '';

};

const buttonClickHandler = function (event) {
  // const language = event.target.getAttribute('button');

  // if (button) {
  //   getFeaturedRepos(button);

  //   cityContainerEl.textContent = '';
  // }
};

const getFeaturedRepos = function (language) {
  const apiUrl = `https://api.github.com/search/repositories?q=${language}+is:featured&sort=help-wanted-issues`;

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayRepos(data.items, language);
      });
    } else {
      alert(`Error:${response.statusText}`);
    }
  });
};

const displayCities = function (cityArray, cityName) {
  // if (cityArray.length === 0) {
  //   oneDayCityWeatherContainerEl.textContent = 'No repositories found.';
  //   return;
  // }
  const cityNameEl = document.createElement('button');
  cityNameEl.classList = 'list-item flex-row justify-center';
  const cityTitleEl = document.createElement('span');
  cityTitleEl.textContent = cityName;
  cityNameEl.addEventListener('click', function(event){
  displayOneDayWeather(cityArray, cityName);
  displayFiveDayWeathers(cityArray, cityName);
  let currentCity = event.target.innerHTML;
  displayOneDayWeather(cityArray, currentCity);
  displayFiveDayWeathers(cityArray, currentCity);
  }) 

  cityNameEl.appendChild(cityTitleEl);

  // console.log(cityNameEl);
  cityContainerEl.appendChild(cityNameEl);
  displayOneDayWeather(cityArray, cityName);
  displayFiveDayWeathers(cityArray, cityName);
};

// 1 Day Weather Data for the entered city: City Name, Date, Weather Icon, Temp, Wind and Humidity.
const displayOneDayWeather = function (cityArray, cityName) {
  // if (cityArray.length === 0) {
  //   oneDayWeatherCity.textContent = 'No repositories found.';
  //   return;
  // }

  oneDayCityWeatherContainerEl.innerHTML = "";
  const apiKey = 'ecf8cbf60d320509daea3c498aa4334b';
  let tmpCityName = cityName;
  const apiDataUrl = `https://api.openweathermap.org/data/2.5/weather?q=${tmpCityName}&appid=${apiKey}&units=imperial`;
  // const cityLatLonUrl = `http://api.openweathermap.org/geo/1.0/direct?q=Seoul&limit=5&appid=765e5437056c425c7ec2a06e41de5624`;

  fetch(apiDataUrl)
    .then(function (response) {
      if (response.ok) {
        response.json()
        .then(function (fetchedData) {

          // alert('chk1...! Fetched Data.Name:   '+fetchedData.name);
          const oneDayContainer = document.getElementById('one-day-weather-container');
          oneDayContainer.innerHTML = "";
          const tmpIcon = document.getElementById('icon-container');
          tmpIcon.innerHTML = "";
          
          // DISPLAY City Name
          const cityNameDataElement = document.createElement('p');
          cityNameDataElement.textContent = cityName;
          
          // DISPLAY Date  
          let today  = new Date();
          let day = today.getDate();
          let month = today.getMonth()+1;
          let year = today.getFullYear();
          const dateElement = document.createElement('p');
          dateElement.style.fontSize = '30px';
          dateElement.style.fontWeight  = 'bold';
          dateElement.textContent = fetchedData.name+" ("+`${month}/${day}/${year}`+")";
          oneDayContainer.appendChild(dateElement);
          
          // DISPLAY Icon
          // Due to time limit, only two types of icons are implemented (Clear & Cloud)
          const iconToBeDisplayed = document.querySelector('#icon-container');
          const icon = document.createElement('i');
          icon.style.fontSize = '50px';

          let tmpWeather = fetchedData.weather[0].main;
          if (tmpWeather == "Clear") {         // Clear, Clouds, Drizzle, Mist, etc. 
          icon.classList.add('fas', 'fa-sun');
          icon.style.color = 'orange';
          } else {
            icon.classList.add('fas', 'fa-cloud');
            icon.style.color = 'gray';
          };
          oneDayContainer.appendChild(icon);

          // DISPLAY Weather Data: Temp, Wind and Humidity
          const temperatureDataElement = document.createElement('p');
          const windDataElement = document.createElement('p');
          const humidityDataElement = document.createElement('p');

          temperatureDataElement.textContent = "Temp: "+fetchedData.main.temp+" FH";
          windDataElement.textContent = "Wind: "+fetchedData.wind.speed+" MPH";
          humidityDataElement.textContent = "Humidity: "+fetchedData.main.humidity+" %";

          oneDayContainer.appendChild(temperatureDataElement);
          oneDayContainer.appendChild(windDataElement);
          oneDayContainer.appendChild(humidityDataElement);

        });
      } else {
        alert(`Error:${response.statusText}`);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to Open Weather Map');
    }

  );

};

// 5 Day Forecast for the entered city after today: Date, Weather Icon, Temp, Wind and Humidity.
const displayFiveDayWeathers = function (cityArray, cityName) {
  // if (cityArray.length === 0) {
  //   fiveDayWeatherCity.textContent = 'No repositories found.';
  //   return;
  // }
  // fiveDayCityWeatherContainerEl.innerHTML = "";
  const apiKey = 'ecf8cbf60d320509daea3c498aa4334b';
  let tmpCityName = cityName;
  const apiForecastDataUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${tmpCityName}&appid=${apiKey}&units=imperial`;

  fetch(apiForecastDataUrl)
    .then(function (response) {
      if (response.ok) {
        response.json()
        .then(function (fetchedData) {

          const fiveDayContainer = document.getElementById('sub-five-day-weather-container');
          fiveDayContainer.innerHTML = "";

          for (let i=0; i<5; i++) {

            const box = document.createElement('div');
            box.classList.add('box');
            fiveDayContainer.appendChild(box);

            // Display sub-One-Day Date:
            const smallOneDayWeatherContainer = document.getElementById('one-day-weather-container');
            const tmpDate = document.createElement('p');
            tmpDate.style.fontSize = '15px';
            tmpDate.style.fontWeight  = 'bold';
            tmpDate.style.paddingLeft  = '10px';
            let today  = new Date();
            let day = today.getDate();
            let month = today.getMonth()+1;
            let year = today.getFullYear();
            let tmpDay = day+i+1;
            tmpDate.textContent = "  "+`${month}/${tmpDay}/${year}`;
            box.appendChild(tmpDate);

            // Display sub-One-Day Weather Icon for each Date:
            // Due to time limit, only two types of icons are implemented (Clear & Others)
            const subOneDayIconContainer = document.getElementById('sub-one-day-icon-container');
            const icon = document.createElement('i');
            let tmpWeather = fetchedData.list[i].weather[0].main;

            if (tmpWeather == "Clear") {         // Clear / Clouds, Drizzle, Mist, etc. 
            icon.classList.add('fas', 'fa-sun');
            icon.style.color = 'orange';
            } else {
              icon.classList.add('fas', 'fa-cloud');
              icon.style.color = 'gray';
            };

            icon.style.paddingLeft  = '10px';
            icon.style.fontSize = '20px';
            box.appendChild(icon);

            // Display sub-One-Day Weather including Temp, Wind and Humidity:
              const temperatureDataElement = document.createElement('p');
              temperatureDataElement.style.fontSize = '12px';
              temperatureDataElement.style.paddingLeft  = '10px';
              temperatureDataElement.textContent = "Temp: "+fetchedData.list[i].main.temp+" FH";
              box.appendChild(temperatureDataElement);

              const windDataElement = document.createElement('p');
              windDataElement.style.fontSize = '12px';
              windDataElement.style.paddingLeft  = '10px';
              windDataElement.textContent = "Wind: "+fetchedData.list[i].wind.speed+" MPH";
              box.appendChild(windDataElement);
              
              const humidityDataElement = document.createElement('p');
              humidityDataElement.style.fontSize = '12px';
              humidityDataElement.style.paddingLeft  = '10px';
              humidityDataElement.textContent = "Humidity: "+fetchedData.list[i].main.humidity+" %";
              box.appendChild(humidityDataElement);
          }
        });
      } else {
        alert(`Error:${response.statusText}`);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to Open Weather Map');
    }

  )
};

userFormEl.addEventListener('submit', formSubmitHandler);
// languageButtonsEl.addEventListener('click', buttonClickHandler);
