/**
 * Strip HTML tags from a string and return plain text
 * @param html HTML string
 * @returns Plain text without HTML tags
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  
  return textarea.value;
}

/**
 * Check if a string contains HTML tags
 * @param str String to check
 * @returns true if contains HTML tags
 */
export function hasHtmlTags(str: string): boolean {
  return /<[^>]*>/g.test(str);
}
