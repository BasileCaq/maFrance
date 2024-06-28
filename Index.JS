const LoadFile = () => {
    var requestURL = "https://github.com/BasileCaq/maFrance/Assets/json/Geo.json";
    var request = new XMLHttpRequest();
    request.open("GET", requestURL);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        var superHeroes = request.response;
        populateHeader(superHeroes);
      };
}
    
function populateHeader(jsonObj) {
    console.log(jsonObj)
}