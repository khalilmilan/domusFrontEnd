import React, { createContext, useState } from 'react';
// Créer le provider du contexte
export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(null);

  const updateProfile = (newProfileData) => {
    setProfileData(newProfileData); // Met à jour les données du profil
  };

  return (
    <ProfileContext.Provider value={{ profileData, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};