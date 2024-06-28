document.addEventListener("DOMContentLoaded", function() {
    initialisation();
});

function initialisation() {
    console.log("L'application est initialisée.");
    LoadFile()
}

const LoadFile = () => {
    var requestURL = "https://github.com/BasileCaq/maFrance/Assets/Json/Geo.json";
    var request = new XMLHttpRequest();
    console.log("eee")
    request.open("GET", requestURL);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        var cities = request.response;
        populateHeader(cities);
      };
}
    
function populateHeader(jsonObj) {
    console.log(jsonObj)
}