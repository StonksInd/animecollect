import { sanitizeInput } from './validators';

export const secureFetch = async (url, options = {}) => {
  // Valider l'URL
  if (!isValidUrl(url)) {
    throw new Error('Invalid URL');
  }

  // Sanitizer les options
  const sanitizedOptions = {
    ...options,
    headers: options.headers ? sanitizeHeaders(options.headers) : {}
  };

  try {
    const response = await fetch(url, sanitizedOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const sanitizeHeaders = (headers) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(headers)) {
    sanitized[sanitizeInput(key)] = sanitizeInput(value);
  }
  return sanitized;
};