/**
 * Robust slug generation utility for creating URL-safe slugs
 * Format: country-city-name (e.g., thailand-bangkok)
 */

export function generateCitySlug(countryName: string, cityName: string): string {
  // Helper to convert string to URL-safe slug
  const toSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      // Replace spaces and special characters with hyphens
      .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
      .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  const countrySlug = toSlug(countryName);
  const citySlug = toSlug(cityName);
  
  return `${countrySlug}-${citySlug}`;
}

/**
 * Generate a unique slug by adding suffix if needed
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length > 0;
}
