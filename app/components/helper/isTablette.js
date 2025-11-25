import { useState, useEffect } from 'react';

const useIsTablette = () => {
  // Définir une largeur maximale pour les appareils mobiles
  const tabWidth = 992;

  // State pour stocker si l'appareil est mobile ou non
  const [isTablette, setIsTablette] = useState(false);

  useEffect(() => {
    // Vérifier si on est côté client
    const isClient = typeof window === 'undefined';

    if (!isClient) {
      // Fonction pour mettre à jour le state en fonction de la largeur de la fenêtre
      const handleResize = () => {
        setIsTablette(window.innerWidth < tabWidth);
      };

      // Appeler handleResize pour définir le state initial
      handleResize();

      // Ajouter l'écouteur d'événement pour le redimensionnement de la fenêtre
      window.addEventListener('resize', handleResize);

      // Fonction de nettoyage pour retirer l'écouteur d'événement
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return isTablette;
};

export default useIsTablette;