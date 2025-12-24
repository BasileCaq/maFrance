import {signUp, currentUser } from './auth.js'

document.getElementById('submit').addEventListener('click', async () => {
  try {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    if (!email || !password) {
      alert("Veuillez entrer un email et un mot de passe.");
      return;
    }
    if (!email.includes('@')) {
      alert("Veuillez entrer une adresse email valide.");
      return;
    }
    if (password.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (!password.match(/[0-9]/) || !password.match(/[a-zA-Z]/)) {
      alert("Le mot de passe doit contenir au moins une lettre et un chiffre.");
      return;
    }
    currentUser = await signUp(email, password);
    updateProfileMenu()
    await chargerCommunesVisitees()
  } catch (err) {
    console.error("Erreur :", err.message)
  }
})  