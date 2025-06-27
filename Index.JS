let allCommunes = []; // toutes les communes
const communeList = document.getElementById('commune-list');
const searchInput = document.getElementById('commune-search');

// Initialisation de la carte
const map = L.map('map').setView([46.5, 2.5], 6);


// Fond de carte léger (CartoDB)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; Carto',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

//Afficher les communes filtrés
function afficherCommunes(filtrés) {
    communeList.innerHTML = '';
    filtrés.forEach(({nom,layer}) => {
        const item = document.createElement('div');
        item.textContent = nom;
        item.classList.add('commune-item');
        item.onclick = () => {
            map.fitBounds(layer.getBounds());
            layer.setStyle({ fillColor: 'red' });
        };
        communeList.appendChild(item);
    });
}

// Chargement du fichier GeoJSON
fetch('Assets/GeoJson/communes.geojson')
  .then(response => response.json())
  .then(data => {
    const communeList = document.getElementById('commune-list');

    L.geoJSON(data, {
      style: feature => ({
        color: '#333',
        fillColor: '#ccc',
        fillOpacity: 0.7,
        weight: 0.5
      }),
      onEachFeature: (feature, layer) => {
        const nom = feature.properties.nom || feature.properties.name || 'Commune inconnue';

        allCommunes.push({nom,layer})
      }
    }).addTo(map);

    // Affiche tout au début
    afficherCommunes(allCommunes);
  });

// Filtrage en live quand l'utilisateur tape
searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    const filtrées = allCommunes.filter(c => c.nom.toLowerCase().includes(q));
    afficherCommunes(filtrées);
  });