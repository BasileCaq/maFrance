import { supabase, signInWithEmail, signUp } from './Auth.js'

let communeMap = new Map();
let currentUser = null;
const communeList = document.getElementById('mycommune-list');
const mycommuneSearch = document.getElementById('mycommune-search');
const allcommuneSearch = document.getElementById('allcommune-search');

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

document.getElementById('new-commune-research-button').addEventListener('click', async () => {
  document.getElementById('allcommune-list-panel').classList.add('open');
})

document.getElementById('all-commune-close-button').addEventListener('click', async () => {
  document.getElementById('allcommune-list-panel').classList.remove('open');
})

mycommuneSearch.addEventListener('input', async () => {
  const resultats = await chercherVisitesParNom(mycommuneSearch.value.trim());
  afficherListeVisites(resultats);
});

allcommuneSearch.addEventListener('input', async () => {
  const resultats = await chercherCommunesParNom(allcommuneSearch.value.trim());
  afficherListeCommunes(resultats);
});

// Fond de carte léger (CartoDB)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; Carto',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Chargement du fichier GeoJSON
fetch('Assets/GeoJson/communes.geojson')
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

fetch('Assets/GeoJson/departements.geojson')
  .then(response => response.json())
  .then(data => {

    L.geoJSON(data, {
      style: feature => ({color: '#000', fillColor: '#fff', Opacity: 1, weight: 2})
    }).addTo(map);
  });



async function chargerCommunesVisitees(){
  const departementMap = new Map();

  const resultats = await chercherVisitesParNom(mycommuneSearch.value.trim());
  afficherListeVisites(resultats);
  colorerCarte(resultats);
}


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
  const container = document.getElementById('mycommune-list');
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
      <ul class="mycommune-list">
        ${communes.map(c => `<li class="commune-item">${c.commune_nom}</li>`).join('')}
      </ul>
    `;

    // Ajouter toggle pour afficher/masquer la liste
    const toggleBtn = item.querySelector('.toggle-btn');
    const list = item.querySelector('.mycommune-list');
    toggleBtn.addEventListener('click', () => {
      list.style.display = list.style.display === 'none' ? 'block' : 'none';
      toggleBtn.textContent = list.style.display === 'none' ? '▼' : '▲';
    });

    container.appendChild(item);
  });
}

function afficherListeCommunes(communes) {
  const container = document.getElementById('allcommune-list');
  container.innerHTML = '';

  // Grouper les visites par département
  const groupes = new Map();

  communes.forEach(( commune ) => {
    const depNom = commune.departement.nom;
    const depNumero = commune.departement.code;
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
      <ul class="allcommune-list">
        ${communes.map(c => `<li class="commune-item">${c.nom}</li>`).join('')}
      </ul>
    `;

    // Ajouter toggle pour afficher/masquer la liste
    const toggleBtn = item.querySelector('.toggle-btn');
    const list = item.querySelector('.allcommune-list');
    toggleBtn.addEventListener('click', () => {
      list.style.display = list.style.display === 'none' ? 'block' : 'none';
      toggleBtn.textContent = list.style.display === 'none' ? '▼' : '▲';
    });

    container.appendChild(item);
  });
}

function newListDepartement(nom, numéro, nb_commune){
      const item_dep = document.createElement('div');
      item_dep.textContent = nom;
      communeList.appendChild(item_dep);
      return  item_dep;
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

async function chercherCommunesParNom(nomRecherche) {
const { data, error } = await supabase
  .from('commune')
  .select('nom,code_insee,departement(code,nom)')
  .ilike('nom', `%${nomRecherche}%`);

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
    .select (
      'nom,code_insee,n_departement,visite(etat_visite,date_visite,description)'
    )
    .eq('code_insee', codeInsee)
    .single();

  if (error) {
    console.error("Ville n'existe pas dans la base de donnée :", error.message);
    return;
  }

  console.log(commune)
  const checkbox = document.getElementById('info-commune_visited');
  const selectStatus = document.getElementById('visit-status');
  const dateInput = document.getElementById('input-date');  
   
  document.getElementById('info-nom').textContent = commune.nom;
  document.getElementById('info-code-postale').textContent = "(" + commune.n_departement + ")";
  dateInput.value = commune.visite?.[0]?.date_visite;   

  const etatVisite = commune.visite?.[0]?.etat_visite || '';
  selectStatus.value = commune.visite?.[0]?.etat_visite ? etatVisite : 'Non visité';        
  //checkbox.classList.add(etatVisite);

  if (selectStatus.value === 'Non visité') {
    checkbox.checked = false;
  } else {
    checkbox.checked = true;
  }

  checkbox.onchange = async () => {

    if(!currentUser){
      console.error("Aucun utilisateur connecté")
      return;
    }

    commune.visite.etat_visite = checkbox.checked;
    const Layer = communeMap.get(codeInsee);
    Layer.setStyle({
      fillColor: commune.visite.etat_visite ? 'green' : '#ccc'
    });

    // Enregistrement Supabase
    if (commune.visite.etat_visite) {
      const date_visite = document.getElementById('input-date').value;
      const date = date_visite ? new Date(date_visite).toISOString() : null;
      const etat = selectStatus.value == 'Non visité' ? 'Visité' : selectStatus.value;
      // Marquer comme visitée → insertion ou update
      await supabase
        .from('visite')
        .upsert([
          {
            user_id: currentUser.id,
            commune_codeinsee: commune.code_insee,
            etat_visite: etat,
            date_visite: date
          }
        ], { onConflict: ['user_id', 'commune_codeinsee'] });
        console.log("Ajout visite : ",commune.code_insee)
    } else {
      console.log("suppression visite",commune.code_insee )
      // Décocher → suppression
      await supabase
        .from('visite')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('commune_codeinsee', commune.code_insee);
    }
    afficherInfoCommune(codeInsee)
  };

  selectStatus.onchange = async () => {
    await supabase
        .from('visite')
        .update({etat_visite: selectStatus.value})
        .eq('user_id', currentUser.id)
        .eq('commune_codeinsee', commune.code_insee)
        afficherInfoCommune(codeInsee)
  };

  dateInput.onchange = async () => {
    await supabase
        .from('visite')
        .update({date_visite: dateInput.value})
        .eq('user_id', currentUser.id)
        .eq('commune_codeinsee', commune.code_insee)
        afficherInfoCommune(codeInsee)
  };
  document.getElementById('info-commune').classList.add('visible');
}

document.getElementById('info-commune_close').addEventListener('click', () => {
  document.getElementById('info-commune').classList.remove('visible');
});

