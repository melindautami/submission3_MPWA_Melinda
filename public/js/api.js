const api_key = '6df294d90c604aafb199b9c283287214';
const league_id = 2021;
const base_url = "https://api.football-data.org/v2/";
const competitions = `${base_url}competitions/${league_id}/standings`;
const upcomingMatch = `${base_url}competitions/${league_id}/matches?status=SCHEDULED`;
const detailMatch = `${base_url}matches/`

//fetch API
const fetchApi = url => {
  return fetch(url, {
      headers: {
          'X-Auth-Token': api_key
      }
  });
}

function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error(error) {
  console.log("Error : " + error);
}

//get Standings
function getAllStandings() {
  if ("caches" in window) {
    caches.match(competitions).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          console.log("Standings Data: " + data);
          showStanding(data);
        })
      }
    })
  }

  fetchApi(competitions)
  .then(status)
  .then(json)
  .then(function(data) {
    console.log(data)
    showStanding(data)
  })
  .catch(error)
}

//show Standings
function showStanding(data) {
  let standings = "";
  let standingElement =  document.getElementById("homeStandings");

    data.standings[0].table.forEach(function (standing) {
      standings += `
        <tr>
          <td>${standing.position}</td> 
          <td><img src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="30px" alt="badge"/></td>
          <td>${standing.team.name}</td>
          <td>${standing.won}</td>
          <td>${standing.draw}</td>
          <td>${standing.lost}</td>
          <td>${standing.points}</td>
          <td>${standing.goalsFor}</td>
          <td>${standing.goalsAgainst}</td>
          <td>${standing.goalDifference}</td>
        </tr>
      `;
    });
    standingElement.innerHTML = `
      <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">
        <table class="striped responsive-table">
          <thead>
            <tr>
              <th>Position</th>
              <th></th>
              <th>Team Name</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>P</th>
              <th>GF</th>
              <th>GA</th>
              <th>GD</th>
            </tr>
          </thead>
          <tbody id="standings">
            ${standings}
          </tbody>
        </table>
                
      </div>
    `;
}

//get Match
function getAllMatch() {
  if ("caches" in window) {
    caches.match(upcomingMatch).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          console.log("Competition Data: " + data);
          showMatch(data);
        })
      }
    })
  }

  fetchApi(upcomingMatch)
  .then(status)
  .then(json)
  .then(function(data) {
    console.log(data)
    showStanding(data)
  })
  .catch(error)
}

//Show Match
function showMatch(data) {
  let showDataMatch = '';
  let match = data.matches;
  let maxData = match.length;

  if (match.length > 10) {
    maxData = 10;
  }

  for (let i = 0; i < maxData; i++) {
    showDataMatch += `
      <div class="col s12 m16">
        <div class="card">
        <div class="card-content">
        <div center-align>
          <div class="center-align">Kick Off: ${match[i].utcDate}</div>
          <div class="row" style="margin:20px">
            <div class="col s5 right-align">
              <span class="blue-text text-darken-2">  ${match[i].homeTeam.name}</span>
            </div>
            <div class="col s2"> VS </div>
            <div class="col s5 left-align">
              <span class="blue-text text-darken-2">  ${match[i].awayTeam.name}</span>
            </div>
          </div>
          <div class="center-align">
            <a class="cyan darken-4 waves-effect waves-light btn" href="./matchDetail.html?id=${match[i].id}">Detail Match</a>
          </div>
        </div>
        </div>
        </div>
      </div>
    `
  }
  document.getElementById("Matches").innerHTML = showDataMatch;
}

//Get Detail Match
function DetailMatch() {
  return new Promise(function (resolve) {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");
    if ('caches' in window) {
      caches.match(detailMatch + idParam).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            showDetailMatch(data);
            resolve(data)
          });
        }
      });
    }
    fetchApi(detailMatch + idParam)
      .then(status)
      .then(JSON)
      .then(function (data) {
        console.log(data);
        showDetailMatch(data);
        resolve(data);
      })
      .catch(Error);
  });
}

//Show Detail
function showDetailMatch(data) {
  document.getElementById("kickOff").innerHTML = `Kick Off: ${data.match.utcDate}`;
  document.getElementById("homeTeamName").innerHTML = data.match.homeTeam.name;
  document.getElementById("awayTeamName").innerHTML = data.match.awayTeam.name;
  document.getElementById("venue").innerHTML = `Venue : ${data.match.venue}`;
}

//Get Favorite
function getFavoriteMatch() {
  let urlParams = new URLSearchParams(window.location.search);
  let idParam = Number(urlParams.get("id"));

  DetailMatch(idParam).then(function (match) {
    showDetailMatch(match);
  });
}

//Show Favirote
function showFavoriteMatch(data) {

  let dataFavoriteMatch = ''
  data.forEach(function (match) {
    dataFavoriteMatch += `
      <div class="col s12 m12">
        <div class="card">
        <div class="card-content">
        <div center-align>
          <div class="center-align">Kick Off: ${match.match.utcDate}</div>
          <div class="row" style="margin:20px">
            <div class="col s5 right-align">
              <span class="blue-text text-darken-2">  ${match.match.homeTeam.name}</span>
            </div>
            <div class="col s2 "> VS </div>
            <div class="col s5 left-align">
              <span class="blue-text text-darken-2">  ${match.match.awayTeam.name}</span>
            </div>
            </div> 
            <div class="center-align">
              <a class="cyan darken-4 waves-effect waves-light btn" href="./matchDetail.html?id=${match.id}">Detail Match</a>
            </div> 
        </div>
        </div>
        </div>
      </div>
    `
  });

  document.getElementById("favorite").innerHTML = dataFavoriteMatch;
}
