
import { useState, useEffect } from 'react';

const useIsMobile = () => {
  // Définir une largeur maximale pour les appareils mobiles
  const mobileWidth = 768;

  // State pour stocker si l'appareil est mobile ou non
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Vérifier si on est côté client
    const isClient = typeof window === 'undefined';

    if (!isClient) {
      // Fonction pour mettre à jour le state en fonction de la largeur de la fenêtre
      const handleResize = () => {
        setIsMobile(window.innerWidth < mobileWidth);
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

  return isMobile;
};

export default useIsMobile;