const userFormEl = document.querySelector('#city-form');
// const languageButtonsEl = document.querySelector('#language-buttons');
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

};

const buttonClickHandler = function (event) {
  const language = event.target.getAttribute('data-language');

  if (language) {
    getFeaturedRepos(language);

    repoContainerEl.textContent = '';
  }
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
  if (cityArray.length === 0) {
    oneDayCityWeatherContainerEl.textContent = 'No repositories found.';
    return;
  }
  const cityNameEl = document.createElement('a');
  cityNameEl.classList = 'list-item flex-row justify-center';
  const cityTitleEl = document.createElement('span');
  cityTitleEl.textContent = cityName;
  cityNameEl.appendChild(cityTitleEl);
  // cityNameEl.style.color = black;
  cityContainerEl.appendChild(cityNameEl);

  displayOneDayWeather(cityArray, cityName);
  displayFiveDayWeathers(cityArray, cityName);

};

const displayOneDayWeather = function (cityArray, cityName) {
  if (cityArray.length === 0) {
    oneDayWeatherCity.textContent = 'No repositories found.';
    return;
  }

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
          
          // Due to time limit, only two types of icons are implemented (Clear & Cloud)

          // document.getElementById('icon-container').appendChild(icon);

          // DISPLAY City Name
          const cityNameDataElement = document.createElement('p');
          // cityNameDataElement.style.fontSize = '25px';
          // cityNameDataElement.style.fontWeight  = 'bold';
          cityNameDataElement.textContent = cityName;
          // oneDayContainer.appendChild(cityNameDataElement);
          
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

const displayFiveDayWeathers = function (cityArray, cityName) {
  if (cityArray.length === 0) {
    fieDayWeatherCity.textContent = 'No repositories found.';
    return;
  }
  const apiKey = 'ecf8cbf60d320509daea3c498aa4334b';
  let tmpCityName = cityName;
  const apiForecastDataUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${tmpCityName}&appid=${apiKey}&units=imperial`;
  // const cityLatLonUrl = `http://api.openweathermap.org/geo/1.0/direct?q=Seoul&limit=5&appid=765e5437056c425c7ec2a06e41de5624`;

  fetch(apiForecastDataUrl)
    .then(function (response) {
      if (response.ok) {
        response.json()
        .then(function (fetchedData) {

          const fiveDayContainer = document.getElementById('sub-five-day-weather-container');
          fiveDayContainer.innerHTML = "";

          // const tmpIcon = document.getElementById('sub-one-day-icon-container');
          // tmpIcon.innerHTML = "";
          
          // Due to time limit, only two types of icons are implemented (Clear & Cloud)

          for (let i=0; i<5; i++) {

            const box = document.createElement('div');
            box.classList.add('box');
            box.textContent = "I'm Here...  # "+i;
            fiveDayContainer.appendChild(box);

            // Display sub-One-Day Date:
            const smallOneDayWeatherContainer = document.getElementById('one-day-weather-container');
            // smallOneDayWeatherContainer.innerHTML = "";

            const tmpDate = document.createElement('p');
            tmpDate.style.fontSize = '20px';
            tmpDate.style.fontWeight  = 'bold';

            let today  = new Date();
            let day = today.getDate();
            let month = today.getMonth()+1;
            let year = today.getFullYear();
            let tmpDay = day+i+1;
            // alert('Day = '+tmpDay);
            // let tmpDate = {''};
            tmpDate.textContent = `${month}/${tmpDay}/${year}`;
            // smallOneDayWeatherContainer.appendChild(tmpDate);
            box.appendChild(tmpDate);


            // Display sub-One-Day Weather Icon for each Date:
            const subOneDayIconContainer = document.getElementById('sub-one-day-icon-container');

            const icon = document.createElement('i');


            let tmpWeather = fetchedData.list[i].weather[0].main;

            // alert('tmpWeather for '+(i+1)+' Day  = ' + tmpWeather);

            if (tmpWeather == "Clear") {         // Clear, Clouds, Drizzle, Mist, etc. 
            icon.classList.add('fas', 'fa-sun');
            icon.style.color = 'orange';
            } else {
              icon.classList.add('fas', 'fa-cloud');
              icon.style.color = 'gray';
            };
            // document.getElementById('sub-one-day-icon-container').appendChild(icon);
            icon.style.fontSize = '40px';
            box.appendChild(icon);


            // document.getElementById('sub-five-day-weather-container').appendChild(tmpDate);

            // alert('CHK '+i+' : ');

              // const temperatureDataElement = document.createElement('p');
              // temperatureDataElement.style.fontSize = '10px';

              // temperatureDataElement.textContent = "Temp: "+fetchedData.list[i].main.temp+" FH";

              // subOneDayWeatherContainer.appendChild(temperatureDataElement);




              // // document.getElementById('sub-five-day-weather-container').appendChild(subOneDayIcon);

              // // Display sub-One-Day Weather: Temp, Wind and Humidity
              // const subOneDayWeatherContainer = document.getElementById('sub-one-day-weather-container');

              // const temperatureDataElement = document.createElement('p');
              // temperatureDataElement.style.fontSize = '10px';

              // const windDataElement = document.createElement('p');
              // windDataElement.style.fontSize = '10px';

              // const humidityDataElement = document.createElement('p');
              // humidityDataElement.style.fontSize = '10px';

              // temperatureDataElement.textContent = "Temp: "+fetchedData.list[i].main.temp+" FH";
              // windDataElement.textContent = "Wind: "+fetchedData.list[i].wind.speed+" MPH";
              // humidityDataElement.textContent = "Humidity: "+fetchedData.list[i].main.humidity+" %";

              // subOneDayWeatherContainer.appendChild(temperatureDataElement);
              // subOneDayWeatherContainer.appendChild(windDataElement);
              // subOneDayWeatherContainer.appendChild(humidityDataElement);
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
  // alert('chk1...!');
  // repoSearchTerm.textContent = searchTerm;

  // const cityName = `${cityArray[0].cityName}`;
  // const cityName = "Seoul";
  // const cityName = `${cityArray[0].owner.login}`;
  // alert('ch2: City Name =     ' + cityName);

  // const cityNameEl = document.createElement('a');
  // // cityNameEl.setAttribute('href', `./single-repo.html?repo=${cityName}`);
  // cityNameEl.classList = 'list-item flex-row justify-center';
  // const cityTitleEl = document.createElement('span');
  // cityTitleEl.textContent = cityName;
  // cityNameEl.appendChild(cityTitleEl);
  // cityContainerEl.appendChild(cityNameEl);
  // alert('ch3: City Name =     ' + cityName);
  // for (let repoObj of repos) {
  //   const repoName = `${repoObj.owner.login}/${repoObj.name}`;

    // const repoEl = document.createElement('a');
    // repoEl.classList = 'list-item flex-row justify-space-between align-center';
    // repoEl.setAttribute('href', `./single-repo.html?repo=${repoName}`);



    // const titleEl = document.createElement('span');
    // titleEl.textContent = cityName;

    // repoEl.appendChild(titleEl);

    // const statusEl = document.createElement('span');
    // statusEl.classList = 'flex-row align-center';
    // repoEl.appendChild(statusEl);
    // oneDayWeatherCity.appendChild(repoEl);


  //   if (repoObj.open_issues_count > 0) {
  //     statusEl.innerHTML =
  //       `<i class='fas fa-times status-icon icon-danger'></i>${repoObj.open_issues_count} issue(s)`;
  //   } else {
  //     statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
  //   }

  // }

userFormEl.addEventListener('submit', formSubmitHandler);
// languageButtonsEl.addEventListener('click', buttonClickHandler);
