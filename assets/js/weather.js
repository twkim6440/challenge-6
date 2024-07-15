const userFormEl = document.querySelector('#city-form');
// const languageButtonsEl = document.querySelector('#language-buttons');
const nameInputEl = document.querySelector('#cityName');
const oneDayCityWeatherContainerEl = document.querySelector('#one-day-weather-container');
const fiveDayCityWeatherContainerEl = document.querySelector('#five-day-weather-container');
const cityContainerEl = document.querySelector('#cities-container');
const oneDayWeatherCity = document.querySelector('#one-day-weather');

const cityArray = JSON.parse(localStorage.getItem('cityName')) || [];

const formSubmitHandler = function (event) {
  event.preventDefault();
  const cityName = nameInputEl.value.trim();

  if (cityName) {

       displayCities(cityArray, cityName);
  // displayWeathers(cityArray, cityName);
    // getCityWeather(cityName);

    // cityContainerEl.textContent = '';
    nameInputEl.value = '';
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

// const getCityWeather = function (cityName) {
//   // alert('chk #1  *** City Name:   ' + cityName);
//   // const apiKey = 'ecf8cbf60d320509daea3c498aa4334b';
//   // let tmpCityName = cityName;
//   // const apiDataUrl = `https://api.openweathermap.org/data/2.5/weather?q=${tmpCityName}&appid=${apiKey}`;
//   // // const cityLatLonUrl = `http://api.openweathermap.org/geo/1.0/direct?q=Seoul&limit=5&appid=765e5437056c425c7ec2a06e41de5624`;

//   // fetch(apiDataUrl)
//   //   .then(function (response) {
//   //     if (response.ok) {
//   //       alert('fech: ');
//   //       response.json().then(function (cityArray) {
//   //         // displayCities(cityArray, cityName);
//   //         displayWeathers(cityArray, cityName);
//   //         // getGeoCoordinate(cityArray, cityName);
//   //       });
//   //     } else {
//   //       alert(`Error:${response.statusText}`);
//   //     }
//   //   })
//   //   .catch(function (error) {
//   //     alert('Unable to connect to Open Weather Map');
//   //   });
//   }

  // const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=ecf8cbf60d320509daea3c498aa4334b`;
  // const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=ecf8cbf60d320509daea3c498aa4334b`;
  // const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=cityName&appid=ecf8cbf60d320509daea3c498aa4334b`;
  // const apiUrl = `https://api.github.com/users/${user}/repos`;
  // https://api.openweathermap.org/data/2.5/weather?q={cityName}&appid={API key}
  // alert('chk #2   City Name:   ' + cityName);
  // fetch(apiUrl)
  //   .then(function (response) {
  //     if (response.ok) {
  //       response.json().then(function (cityArray) {
  //         displayWeathers(cityArray, cityName);
  //       });
  //     } else {
  //       alert(`Error:${response.statusText}`);
  //     }
  //   })
  //   .catch(function (error) {
  //     alert('Unable to connect to Open Weather Map');
  //   });
// };

// const getCityWeather = function (user) {
//   const apiUrl = `https://api.github.com/users/${user}/repos`;

//   fetch(apiUrl)
//     .then(function (response) {
//       if (response.ok) {
//         response.json().then(function (data) {
//           displayRepos(data, user);
//         });
//       } else {
//         alert(`Error:${response.statusText}`);
//       }
//     })
//     .catch(function (error) {
//       alert('Unable to connect to GitHub');
//     });
// };

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

  displayWeathers(cityArray, cityName);

};

const displayWeathers = function (cityArray, cityName) {
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
          const container = document.getElementById('one-day-weather-container');
          container.innerHTML = "";
          const tmpIcon = document.getElementById('icon-container');
          tmpIcon.innerHTML = "";
          
          // Due to time limit, only two types of icons are implemented (Clear & Cloud)
          const iconToBeDisplayed = document.querySelector('#icon-container');
          const icon = document.createElement('i');
          icon.style.fontSize = '110px';

          let tmpWeather = fetchedData.weather[0].main;
          alert('tmpWeather = ' + tmpWeather);
          if (tmpWeather == "Clear") {         // Clear, Clouds, Drizzle, Mist, etc. 
          icon.classList.add('fas', 'fa-sun');
          icon.style.color = 'orange';
          } else {
            icon.classList.add('fas', 'fa-cloud');
            icon.style.color = 'gray';
          };
          document.getElementById('icon-container').appendChild(icon);


          const cityNameDataElement = document.createElement('p');
          cityNameDataElement.style.fontSize = '40px';
          cityNameDataElement.style.fontWeight  = 'bold';

          const temperatureDataElement = document.createElement('p');
          const windDataElement = document.createElement('p');
          const humidityDataElement = document.createElement('p');

          let today  = new Date();
          let day = today.getDate();
          let month = today.getMonth()+1;
          let year = today.getFullYear();

          cityNameDataElement.textContent = fetchedData.name+" ("+`${month}/${day}/${year}`+")";

          

          temperatureDataElement.textContent = "Temp: "+fetchedData.main.temp+" FH";
          windDataElement.textContent = "Wind: "+fetchedData.wind.speed+" MPH";
          humidityDataElement.textContent = "Humidity: "+fetchedData.main.humidity+" %";

          container.appendChild(cityNameDataElement);
          container.appendChild(temperatureDataElement);
          container.appendChild(windDataElement);
          container.appendChild(humidityDataElement);

        });
      } else {
        alert(`Error:${response.statusText}`);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to Open Weather Map');
    }

  );


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
};

userFormEl.addEventListener('submit', formSubmitHandler);
// languageButtonsEl.addEventListener('click', buttonClickHandler);
