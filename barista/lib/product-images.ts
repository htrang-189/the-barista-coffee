/**
 * Product Image URL mapping and generation utility
 * Provides authentic coffee drink images for each product
 * Uses Unsplash's high-quality coffee photography
 */

// Mapping of product IDs to authentic coffee drink images
// Using stable, reliably available coffee images
const PRODUCT_IMAGE_MAP: Record<string, string> = {
  // Espresso Bar drinks
  'prod-americano': 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=300&h=300&fit=crop', // Americano
  'prod-cappuccino': 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=300&h=300&fit=crop', // Cappuccino
  'prod-latte': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop', // Latte
  
  // Vietnamese Coffee
  'prod-ca-phe-den': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop', // Black coffee
  'prod-ca-phe-sua': 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=300&h=300&fit=crop', // Ca phe sua
  
  // Iced Drinks
  'prod-iced-americano': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop', // Iced americano
  'prod-iced-latte': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop', // Iced latte
};

/**
 * Gets a unique coffee drink image URL for a product
 * Uses authentic Unsplash coffee photography
 * 
 * @param productId - The product ID to generate image for
 * @returns A unique coffee drink image URL
 */
export function getProductImageUrl(productId: string): string {
  // If product has a mapped image, use it
  if (PRODUCT_IMAGE_MAP[productId]) {
    return PRODUCT_IMAGE_MAP[productId];
  }

  // Fallback: Use a generic coffee drink image from Unsplash
  return 'https://images.unsplash.com/photo-1447933601383-0c6688de566e?w=300&h=300&fit=crop';
}

/**
 * Generates a coffee drink placeholder image
 * 
 * @param _seed - A unique seed (for consistency)
 * @param width - Image width (default 300)
 * @param height - Image height (default 300)
 * @returns A coffee drink image URL from Unsplash
 */
export function getPicsumPlaceholder(seed: string = 'coffee', width = 300, height = 300): string {
  return `https://images.unsplash.com/photo-1447933601383-0c6688de566e?w=${width}&h=${height}&fit=crop`;
}

/**
 * Gets a coffee-themed image URL
 * Returns a generic coffee image
 * 
 * @returns A coffee-themed image URL
 */
export function getCoffeeImageUrl(): string {
  return 'https://picsum.photos/seed/coffee-default/300/300';
}
