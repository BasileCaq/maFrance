import { supabase, signInWithEmail, currentUser, setCurrentUser } from './auth.js'
//import { chargerCommunesVisitees } from './main.js';

const profileBtn = document.getElementById('profile-btn');
const profileMenu = document.getElementById('profile-menu');

profileBtn.addEventListener('click', () => {
  updateProfileMenu();
  if (profileMenu.style.display === '' || profileMenu.style.display === 'none') {
    profileMenu.style.display = 'block';
  } else {
    profileMenu.style.display = 'none';
  }
});

document.getElementById('profile-login').addEventListener('click', async () => {
  try {
    const email = document.getElementById('profile-email-input').value;
    const password = document.getElementById('profile-password-input').value;
    if (!email || !password) {
      alert("Veuillez entrer un email et un mot de passe.");
      return;
    }
    const user = await signInWithEmail(email, password);
    setCurrentUser(user);
    updateProfileMenu()
    //await chargerCommunesVisitees()
  } catch (err) {
    console.error("Erreur :", err.message)
  }
})

document.getElementById('profile-logout').addEventListener('click', async () => {
  try {
    await supabase.auth.signOut();
    setCurrentUser(null);
    updateProfileMenu();
    visiteMap.clear();
    document.getElementById('mycommune-list').innerHTML = '';
    document.getElementById('info-commune').classList.remove('visible');
  } catch (err) {
    console.error("Erreur lors de la déconnexion :", err.message);
  }
});


function updateProfileMenu() {
  const isConnected = !!currentUser;
  document.getElementById('profile-not-connected').style.display = isConnected ? 'none' : 'flex';
  document.getElementById('profile-connected').style.display = isConnected ? 'flex' : 'none';
  if (isConnected) {
    document.getElementById('profile-email').textContent = currentUser.email;
  }
}