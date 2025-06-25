export const formatDate = (dateString: string) => {
  if (!dateString) return 'Date inconnue';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
};

export const shortenText = (text: string, maxLength: number = 100) => {
  if (!text) return '';
  return text.length > maxLength 
    ? `${text.substring(0, maxLength)}...` 
    : text;
};

export const getBestTitle = (titles: Record<string, string>, canonicalTitle: string) => {
  return titles?.en || titles?.ja_jp || canonicalTitle || 'Titre inconnu';
};