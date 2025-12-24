import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.34.0/+esm';

export let currentUser = null;

export function reloadCurrentUser() {
  return supabase.auth.getUser().then(({ data }) => {
    if (data?.user) {
      setCurrentUser(data.user);
      return data.user;
    }
    setCurrentUser(null);
    return null;
  });
}

export function setCurrentUser(user) {
  currentUser = user;
}

export const supabase = createClient(
    'https://joqxqsutiiosetxphxmn.supabase.co',      // URL Supabase
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvcXhxc3V0aWlvc2V0eHBoeG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNzk0MjQsImV4cCI6MjA2MzY1NTQyNH0.XBgFYmVp20uhoz3JZ8DoPhyOkpLGOX95t70_KjANRQc'               // Clé publique (non secrète)
  );

//Se connecte de manière anonyme
export async function signInAnonymously() {
  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return data.user
  }

//Créer un compte
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password});
  if (error) throw error;
  return data.user;
}

//Se connecter avec ses identifiants
export async function signInWithEmail(email, password){
  const { data, error } = await supabase.auth.signInWithPassword({ email, password});
  if (error) throw error;
  return data.user;
}


