document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);
  var typeFavorite = '';
  
  loadNav();
  
  function loadNav() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status != 200) return;
          document.querySelectorAll(".topnav, .sidenav").forEach(function (elm) {
            elm.innerHTML = xhttp.responseText;
          });
          document.querySelectorAll(".sidenav a, .topnav a").forEach(function (elm) {
            elm.addEventListener("click", function (event) {
              var sidenav = document.querySelector(".sidenav");
              M.Sidenav.getInstance(sidenav).close();
              page = event.target.getAttribute("href").substr(1);
              loadPage(setupPage(page));
            });
          });
      }
    };
    xhttp.open("GET", "nav.html", true);
    xhttp.send();
  }
  
  var page = window.location.hash.substr(1);
  loadPage(setupPage(page));
  function setupPage(page) {
    if (page == "" || page == "#") {
      page = "home";
    } else if (page === "match-fav") {
      page = "favorite";
      typeFavorite = "competitions";
    } else {
      typeFavorite = "";
    }
    return page;
  }
  
  function loadPage(page) {
    console.log("loadPage: page: " + page);
    console.log("loadPage: typeFavorite: " + typeFavorite);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      var content = document.querySelector("#body-content");
      if (this.readyState == 4) {
        if (page === "home") {
          getAllStandings();
        } else if (page === "matches") {
          getAllMatch();
        } else if (page === "favorite") {
          setupDataFavHtml(typeFavorite);
        }
        if (this.status === 200) {
          content.innerHTML = xhttp.responseText;
        } else if (this.status === 404) {
          content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
        } else {
          content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
        }
      }
    };
    xhttp.open("GET", "pages/" + page + ".html", true);
    xhttp.send();
  }
});