import footwear3D from '../../assets/icons3d/footwear-3d.png';
import clothing3D from '../../assets/icons3d/clothing-3d.png';
import electronics3D from '../../assets/icons3d/electronics-3d.png';
import accessories3D from '../../assets/icons3d/accessories-3d.png';
import home3D from '../../assets/icons3d/home-3d.png';
import lifestyle3D from '../../assets/icons3d/lifestyle-3d.png';
import product3D from '../../assets/icons3d/product-3d.png';

export interface CategoryIconMeta {
  src: string;
  alt: string;
}

/**
 * Normalizes dynamic category strings from the backend API (GET /products/categories/)
 * and returns the corresponding monochrome 3D icon asset.
 * If no specific match is found, gracefully falls back to the minimalist product-3d icon.
 */
export function getCategoryIconMeta(categoryName: string): CategoryIconMeta {
  const norm = (categoryName || '').trim().toLowerCase();

  if (norm.includes('footwear') || norm.includes('shoe') || norm.includes('sneaker') || norm.includes('boot')) {
    return { src: footwear3D, alt: `${categoryName} 3D Icon` };
  }

  if (norm.includes('apparel') || norm.includes('cloth') || norm.includes('shirt') || norm.includes('t-shirt') || norm.includes('sweater') || norm.includes('wear') || norm.includes('fashion')) {
    return { src: clothing3D, alt: `${categoryName} 3D Icon` };
  }

  if (norm.includes('electronic') || norm.includes('audio') || norm.includes('gadget') || norm.includes('headphone') || norm.includes('device') || norm.includes('tech')) {
    return { src: electronics3D, alt: `${categoryName} 3D Icon` };
  }

  if (norm.includes('accessori') || norm.includes('bag') || norm.includes('watch') || norm.includes('sunglass') || norm.includes('wallet') || norm.includes('jewelry')) {
    return { src: accessories3D, alt: `${categoryName} 3D Icon` };
  }

  if (norm.includes('home') || norm.includes('living') || norm.includes('decor') || norm.includes('furniture') || norm.includes('kitchen') || norm.includes('light')) {
    return { src: home3D, alt: `${categoryName} 3D Icon` };
  }

  if (norm.includes('lifestyle') || norm.includes('essential') || norm.includes('sport') || norm.includes('fitness') || norm.includes('wellness') || norm.includes('beauty')) {
    return { src: lifestyle3D, alt: `${categoryName} 3D Icon` };
  }

  // Fallback for any other/unmapped category
  return { src: product3D, alt: `${categoryName} 3D Icon` };
}
