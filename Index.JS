var cities

//Initialization function
document.addEventListener("DOMContentLoaded", function() {
    console.log("L'application est initialisée.");
    //loadFile()
    //filterButton()
});

const filterButton = () => {
   filterInput = document.getElementById("Filter-List-cities")
   filterInput.addEventListener('input',function(){
        const filterValue = filterInput.value.toLowerCase();
        //const filteredCities = cities.filter((city) => city["properties"]["libgeo"].toLowerCase().includes(filterValue));
        removeCities();
        //diplayCities(filteredCities);
   })
}

const removeCities = () => {
    var list = document.getElementById("List-cities")
    while(list.firstChild){
        list.removeChild(list.firstChild);
        }
}


const loadFile = () => {
    fetch("Assets/Json/Geo.json")        
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        //cities = data["features"];
        diplayCities(cities)
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

    
}

const diplayCities = (jsonData) => {
    for (var i = 1; i < jsonData.length; i++){
        var city = document.createElement("ul")
        city.textContent = jsonData[i]["properties"]["libgeo"]
        document.getElementById("List-cities").appendChild(city)
    }
}