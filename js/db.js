function dbPromise(idb) {
  var dbPromise = idb.open("footballInfo", 1, function (upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains("favoriteMatch")) {
      var indexFavoriteMatch = upgradeDb.createObjectStore("favoriteMatch", {
        keyPath: "id", 
      });
      indexFavoriteMatch.createIndex("homeTeam", "match.homeTeam.name", {
        unique: false
      });
      indexFavoriteMatch.createIndex("awayTeam", "match.awayTeam.name", {
        unique: false
      });
    }
  });

  return dbPromise;
}

function cekData(storeName, id) {
  return new Promise(function (resolve, reject) {
    dbPromise(idb)
    .then(function (db) {
      var tx = db.transaction(storeName, "readonly");
      var store = tx.objectStore(storeName);
      return store.get(id);
    })
    .then(function (data) {
      if (data != undefined) {
        resolve("data favorite")
      } else {
        reject("Not favorite data ")
      }
    });
  });
}

function createFavorite(dataType, data) {
  var storeName = "";
  var dataToCreate = {}
  storeName = "favoriteMatch"
  dataToCreate = {
    id: data.match.id,
    match: {
      utcDate: data.match.utcDate,
      venue: data.match.venue,
      homeTeam: {
        name: data.match.homeTeam.name
      },
      awayTeam: {
        name: data.match.awayTeam.name
      }
    }
  }

  console.log("data " + dataToCreate);
  dbPromise(idb).then(db => {
    const tx = db.transaction(storeName, 'readwrite');
    var store = tx.objectStore(storeName);
    store.put(dataToCreate);
    return tx.complete;
  })
  .then(function () {
    console.log('Match Saves as Favorite');
    document.getElementById("iconFav").innerHTML = "favorite";
    M.toast({
      html: 'Match Saves as Favorite'
    });
  })
  .catch(function () {
    M.toast({
      html: 'An Error Occurred'
    });
  });
}

function deleteFavorite(storeName, data) {
  dbPromise(idb).then(function (db) {
    var tx = db.transaction(storeName, 'readwrite');
    var store = tx.objectStore(storeName);
    store.delete(data);
    return tx.complete;
  })
  .then(function () {
    console.log('Match deleted');
    document.getElementById("iconFav").innerHTML = "favorite_border";
    M.toast({
      html: 'Match deleted from favorite!'
    });
  })
  .catch(function () {
    M.toast({
      html: 'an error occurred'
    });
  });
}

function getFavoriteMatch(dataType) {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = Number(urlParams.get("id"));
  if (dataType == "competitions") {
    getDataById("favoriteMatch", idParam).then(function (match) {
      showDetailMatch(match);
    });
  }
}

function getDataById(storeName, id) {
  return new Promise(function (resolve, reject) {
    dbPromise(idb)
    .then(function (db) {
      var tx = db.transaction(storeName, "readonly");
      var store = tx.objectStore(storeName);
      return store.get(id);
    })
    .then(function (data) {
      resolve(data);
    });
  });
}

function getAllData(storeName) {
  return new Promise(function (resolve, reject) {
    dbPromise(idb)
    .then(function (db) {
      var tx = db.transaction(storeName, "readonly");
      var store = tx.objectStore(storeName);
      return store.getAll();
    })
    .then(function (data) {
      resolve(data);
    });
  });
}

function setupDataFavHtml(dataType) {
  if (dataType == "competitions") {
    getAllData("favoriteMatch").then(function (data) {
      showFavoriteMatch(data);
    });
  }
}