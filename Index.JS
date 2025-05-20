var cities

//Initialization function
document.addEventListener("DOMContentLoaded", function() {
    //console.log("L'application est initialisée.");
    //loadFile_SVG()
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
    var list = document.getElementById("citiesList")
    while(list.firstChild){
        list.removeChild(list.firstChild);
        }
}


const loadFile_JSON= () => {
    fetch("Assets/Json/Geo.json")        
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        //cities = data["features"];
        //diplayCities(cities)
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

    
}

const loadFile_SVG=() => {
    fetch("Assets/SVG/France_(Communes).svg")
    .then(response => response.text())
    .then(data => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(data, 'image/svg+xml');
        const citiesList = document.getElementById('citiesList');
        const citiesMap = document.getElementById('citiesMap')

        // Fonction récursive pour extraire les <path>
        function extractPaths(element) {
            const paths = element.querySelectorAll('path');
            paths.forEach(path => {
                const d = path.getAttribute('id');

                const li = document.createElement('li');
                li.textContent = ` ${d}`;
                li.id = d
                citiesList.appendChild(li);

                const link = document.createElement('a');
                path.addEventListener('mouseenter', function(e){
                    console.log('salut')
                })
                link.appendChild(path)
                citiesMap.append(path)
                

            });
            
            // Rechercher les enfants <g> récursivement
            const groups = element.querySelectorAll('g');
            groups.forEach(group => {
                extractPaths(group);
            });
        }

        // Commencer l'extraction à partir du document SVG
        extractPaths(svgDoc.documentElement);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}


const diplayCities = (jsonData) => {
    for (var i = 1; i < jsonData.length; i++){
        var city = document.createElement("ul")
        city.textContent = jsonData[i]["properties"]["libgeo"]
        document.getElementById("citiesList").appendChild(city)
   