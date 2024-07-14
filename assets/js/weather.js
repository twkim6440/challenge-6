const userFormEl = document.querySelector('#city-form');
// const languageButtonsEl = document.querySelector('#language-buttons');
const nameInputEl = document.querySelector('#cityName');
const oneDayCityWeatherContainerEl = document.querySelector('#one-day-weather-container');
const fiveDayCityWeatherContainerEl = document.querySelector('#five-day-weather-container');
const cityContainerEl = document.querySelector('#cities-container');
const repoSearchTerm = document.querySelector('#one-day-weather');

const cityArray = JSON.parse(localStorage.getItem('cityName')) || [];

const formSubmitHandler = function (event) {
  event.preventDefault();
  const cityName = nameInputEl.value.trim();

  if (cityName) {
    getUserRepos(cityName);

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

const getUserRepos = function (user) {
  const apiUrl = `https://api.github.com/users/${user}/repos`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayRepos(data, user);
        });
      } else {
        alert(`Error:${response.statusText}`);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to GitHub');
    });
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

const displayRepos = function (repos, searchTerm) {
  if (repos.length === 0) {
    oneDayCityWeatherContainerEl.textContent = 'No repositories found.';
    return;
  }
  // alert('chk1...!');
  repoSearchTerm.textContent = searchTerm;

  const cityName = `${repos[0].owner.login}`;
  // alert('ch2: City Name = !' + cityName);

  const cityNameEl = document.createElement('a');
  // cityNameEl.setAttribute('href', `./single-repo.html?repo=${cityName}`);
  cityNameEl.classList = 'list-item flex-row justify-center';
  const cityTitleEl = document.createElement('span');
  cityTitleEl.textContent = cityName;
  cityNameEl.appendChild(cityTitleEl);
  cityContainerEl.appendChild(cityNameEl);

  // for (let repoObj of repos) {
  //   const repoName = `${repoObj.owner.login}/${repoObj.name}`;

  //   const repoEl = document.createElement('a');
  //   repoEl.classList = 'list-item flex-row justify-space-between align-center';
  //   repoEl.setAttribute('href', `./single-repo.html?repo=${repoName}`);

  //   const titleEl = document.createElement('span');
  //   titleEl.textContent = repoName;

  //   repoEl.appendChild(titleEl);

  //   const statusEl = document.createElement('span');
  //   statusEl.classList = 'flex-row align-center';

  //   if (repoObj.open_issues_count > 0) {
  //     statusEl.innerHTML =
  //       `<i class='fas fa-times status-icon icon-danger'></i>${repoObj.open_issues_count} issue(s)`;
  //   } else {
  //     statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
  //   }

  //   repoEl.appendChild(statusEl);

  //   oneDayCityWeatherContainerEl.appendChild(repoEl);
  // }
};

userFormEl.addEventListener('submit', formSubmitHandler);
// languageButtonsEl.addEventListener('click', buttonClickHandler);
