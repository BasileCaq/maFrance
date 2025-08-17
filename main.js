import { supabase, signInWithEmail, signUp } from './Auth.js'

let communeMap = new Map();
let currentUser = null;
const communeList = document.getElementById('commune-list');
const searchInput = document.getElementById('commune-search');
const map = L.map('map', { preferCanvas: true }).setView([46.5, 2.5], 6);   // Initialisation de la carte

document.getElementById('btn-connect').addEventListener('click', async () => {
  try {
    //const user = await signUp('basilecaquot@hotmail.fr','maFrance')
    currentUser = await signInWithEmail('basilecaquot@hotmail.fr','maFrance')
    document.getElementById('resultat').textContent = "Connecté avec : " + currentUser.email
    await chargerCommunesVisitees()
  } catch (err) {
    console.error("Erreur :", err.message)
  }
})

// Fond de carte léger (CartoDB)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; Carto',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Chargement du fichier GeoJSON
fetch('Assets/GeoJson/communes10.geojson')
  .then(response => response.json())
  .then(data => {

    L.geoJSON(data, {
      style: feature => ({color: '#333', fillColor: '#ccc', fillOpacity: 0.7, weight: 0.5}),
      onEachFeature: (feature, layer) => {
        const codeInsee = feature.properties.code;
        communeMap.set(codeInsee, layer);

        layer.on('click', () => {

          map.fitBounds(layer.getBounds(),{padding: [70,70]});
          afficherInfoCommune(codeInsee);
        });

      }
    }).addTo(map);
  });


async function chargerCommunesVisitees(){
  const departementMap = new Map();

  const resultats = await chercherVisitesParNom(searchInput.value.trim());
  afficherListeVisites(resultats);
  colorerCarte(resultats);
}
 
searchInput.addEventListener('input', async () => {
  const resultats = await chercherVisitesParNom(searchInput.value.trim());
  afficherListeVisites(resultats);
});

function colorerCarte(communes){
  // Iteration de toute les communes visitées
  communes.forEach((commune) => {
    console.log(commune.commune_codeinsee);
    const Layer = communeMap.get(commune.commune_codeinsee);    
    if (Layer) {
      Layer.setStyle({ fillColor: 'green' });             //changement de la couleur sur la map
    }
  });
}

function afficherListeVisites(visites) {
  const container = document.getElementById('commune-list');
  container.innerHTML = '';

  // Grouper les visites par département
  const groupes = new Map();

  visites.forEach(( commune ) => {
    const depNom = commune.departement_nom;
    const depNumero = commune.departement_numero;
    const key = `${depNumero} - ${depNom}`;

    if (!groupes.has(key)) {
      groupes.set(key, []);
    }
    groupes.get(key).push(commune);
  });

  // Pour chaque département
  groupes.forEach((communes, depNomComplet) => {
    const [depNumero, depNom] = depNomComplet.split(' - ');
    const totalCommunes = 4;
    const item = document.createElement('div');
    item.className = 'departement-item';

    item.innerHTML = `
      <div class="departement-header">
        <span class="departement-nom">${depNom} (${depNumero})</span>
        <span class="departement-stats">${communes.length} / ${totalCommunes}</span>
        <button class="toggle-btn">▼</button>
      </div>
      <ul class="commune-list">
        ${communes.map(c => `<li class="commune-item">${c.commune_nom}</li>`).join('')}
      </ul>
    `;

    // Ajouter toggle pour afficher/masquer la liste
    const toggleBtn = item.querySelector('.toggle-btn');
    const list = item.querySelector('.commune-list');
    toggleBtn.addEventListener('click', () => {
      list.style.display = list.style.display === 'none' ? 'block' : 'none';
      toggleBtn.textContent = list.style.display === 'none' ? '▼' : '▲';
    });

    container.appendChild(item);
  });
}


/*
function afficherListeVisites(visites){
  const departementMap = new Map();
  communeList.innerHTML = '';
  visites.forEach((commune) => {
    console.log(commune);
    const item = document.createElement('li');
    item.textContent = commune.commune_nom;
    item.classList.add('commune-item');
    item.onclick = () => {
      const Layer = communeMap.get(commune.commune_codeinsee);
      map.fitBounds(Layer.getBounds(),{padding: [70,70]});
      afficherInfoCommune(commune.commune_codeinsee);
    };

    if (departementMap.has(commune.departement_nom)){       //département existe déjà
      const item_dep = departementMap.get(commune.departement_nom);
      item_dep.appendChild(item);
    }
    else{                                                    //département non existant
      const newDep = newListDepartement(commune.departement_nom, commune.departement_numero,1);
      departementMap.set(commune.departement_nom, newDep)
      newDep.appendChild(item);
    }
  });
}
*/
function newListDepartement(nom, numéro, nb_commune){
      const item_dep = document.createElement('div');
      item_dep.textContent = nom;
      communeList.appendChild(item_dep);
      return  item_dep;
}

function newListCommune(){

}

async function chercherVisitesParNom(nomRecherche) {
const { data, error } = await supabase
  .rpc('search_user_visites', {
    nom_commune: nomRecherche,
    uid: currentUser.id
  });

  if (error) {
    console.error("Erreur lors de la recherche :", error.message);
    return [];
  }

return data;
}

async function afficherInfoCommune(codeInsee) {
  
  console.log("Commune : ",codeInsee);

  const { data :commune, error } = await supabase
    .from('commune')
    .select(
      'nom,code_insee,visite(etat_visite)'
    )
    .eq('code_insee', codeInsee)
    .single();

  if (error) {
    console.error("Ville n'existe pas dans la base de donnée :", error.message);
    return;
  }

  //console.log(commune);
  console.log(commune.nom);  
  document.getElementById('info-nom').textContent = commune.nom;
  document.getElementById('info-code-postale').textContent = " (" + commune.n_departement + ")";
  const date_visite = document.getElementById('input-date').value;

  const checkbox = document.getElementById('info-commune_visited');
  checkbox.checked = commune.visite.etat_visite;
  checkbox.onchange = async () => {
    commune.visite.etat_visite = checkbox.checked;
    const Layer = communeMap.get(codeInsee);
    Layer.setStyle({
      fillColor: commune.visite.etat_visite ? 'green' : '#ccc'
    });

    if(!currentUser){
      console.error("Aucun utilisateur connecté")
      return;
    }

    // Enregistrement Supabase
    if (commune.visite.etat_visite) {
      console.log("ajout visite : ",commune.code_insee )
      // Marquer comme visitée → insertion ou update
      await supabase
        .from('visite')
        .upsert([
          {
            user_id: currentUser.id,
            commune_codeinsee: commune.code_insee,
            etat_visite: "Visité",
            date_visite: date_visite
          }
        ], { onConflict: ['user_id', 'commune_codeinsee'] });
    } else {
      console.log("suppression visite",commune.code_insee )
      // Décocher → suppression
      await supabase
        .from('visite')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('commune_codeinsee', commune.code_insee);
    }
  };
  document.getElementById('info-commune').classList.add('visible');
}

document.getElementById('info-commune_close').addEventListener('click', () => {
  document.getElementById('info-commune').classList.remove('visible');
});