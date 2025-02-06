import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Importer auth

function Logout() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Rediriger vers la page de connexion
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    }
  };

  return (
    <button onClick={handleLogout}>Se déconnecter</button>
  );
}

export default Logout;
