export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
};

export const unescapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  };
  return text.replace(/&(?:amp|lt|gt|quot|#39);/g, (encoded) => map[encoded]);
};

/**
 * Sanitize user input by escaping HTML entities
 * Use this for driver notes, delivery instructions, etc.
 */
export const sanitizeUserInput = (input: string): string => {
  if (!input) return '';
  return escapeHtml(input.trim());
};
