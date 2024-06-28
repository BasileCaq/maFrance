//Initialization function
document.addEventListener("DOMContentLoaded", function() {
    console.log("L'application est initialisée.");
    LoadFile()
});

/*const LoadFile = () => {
    //var requestURL = "https://github.com/BasileCaq/maFrance/tree/master/Assets/Json/Geo.json";
    var requestURL = "https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json"
    var request = new XMLHttpRequest();
    console.log("eee")
    request.open("GET", requestURL);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        var cities = request.response;
        populateHeader(cities);
      };
}*/

const LoadFile = () => {
    fetch("Assets/Json/Geo.json")        
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('List-cities').innerHTML = `
            <p>type: ${data.type}</p>
            <p>geometry: ${data.geometry}</p>
            <p>properties: ${data.properties}</p>
        `;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

    
function populateHeader(jsonObj) {
    console.log(jsonObj)
}