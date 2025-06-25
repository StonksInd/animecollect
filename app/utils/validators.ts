export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Supprimer les balises HTML de base
    .replace(/javascript:/gi, '') // Supprimer les protocoles javascript
    .replace(/on\w+=/gi, '') // Supprimer les gestionnaires d'événements
    .trim()
    .substring(0, 1000); // Limiter la longueur
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};