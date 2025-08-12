// Simple storage helpers with localStorage fallback and in-memory backup

type ViewedProduct = { id: string; name: string };

const RECENT_SEARCHES_KEY = 'recentSearches';
const RECENTLY_VIEWED_KEY = 'recentlyViewedProducts';
const PRODUCT_REVIEWS_PREFIX = 'productReviews:'; // per-product key

const memoryStore: Record<string, any> = {
  [RECENT_SEARCHES_KEY]: [] as string[],
  [RECENTLY_VIEWED_KEY]: [] as ViewedProduct[],
};

const hasLocalStorage = (): boolean => {
  try {
    return typeof globalThis !== 'undefined' && !!(globalThis as any).localStorage;
  } catch {
    return false;
  }
};

const readJSON = <T,>(key: string, fallback: T): T => {
  if (hasLocalStorage()) {
    try {
      const raw = (globalThis as any).localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }
  return (memoryStore[key] as T) ?? fallback;
};

const writeJSON = (key: string, value: any) => {
  if (hasLocalStorage()) {
    try {
      (globalThis as any).localStorage.setItem(key, JSON.stringify(value));
      return;
    } catch {
      // fall back to memory
    }
  }
  memoryStore[key] = value;
};

export const getPopularSearches = (): string[] => {
  return ['205/55R16', 'Winter Tyres', 'All Season', '225/45R17', 'Off-Road'];
};

export const getRecentSearches = (): string[] => {
  return readJSON<string[]>(RECENT_SEARCHES_KEY, []);
};

export const addRecentSearch = (term: string) => {
  const trimmed = term.trim();
  if (!trimmed) return;
  const current = getRecentSearches();
  const next = [trimmed, ...current.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(0, 10);
  writeJSON(RECENT_SEARCHES_KEY, next);
};

export const clearRecentSearches = () => {
  writeJSON(RECENT_SEARCHES_KEY, []);
};

export const getRecentlyViewedProducts = (): ViewedProduct[] => {
  return readJSON<ViewedProduct[]>(RECENTLY_VIEWED_KEY, []);
};

export const addRecentlyViewedProduct = (product: ViewedProduct) => {
  if (!product?.id) return;
  const current = getRecentlyViewedProducts();
  const deduped = current.filter((p) => p.id !== product.id);
  const next = [product, ...deduped].slice(0, 10);
  writeJSON(RECENTLY_VIEWED_KEY, next);
};

// --- Product Reviews ---
export type ProductReview = {
  id: string;
  productId: string;
  rating: number; // 1-5
  name?: string;
  headline?: string;
  description: string;
  createdAt: string; // ISO
};

const getReviewsKey = (productId: string): string => `${PRODUCT_REVIEWS_PREFIX}${productId}`;

export const getProductReviews = (productId: string): ProductReview[] => {
  if (!productId) return [];
  return readJSON<ProductReview[]>(getReviewsKey(productId), []);
};

export const addProductReview = (productId: string, review: Omit<ProductReview, 'id' | 'productId' | 'createdAt'>): ProductReview => {
  if (!productId) throw new Error('productId is required');
  if (!review || typeof review.rating !== 'number' || review.rating < 1 || review.rating > 5) {
    throw new Error('rating must be 1-5');
  }
  if (!review.description || !review.description.trim()) {
    throw new Error('description is required');
  }

  const existing = getProductReviews(productId);
  const newReview: ProductReview = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    productId,
    rating: Math.max(1, Math.min(5, Math.round(review.rating))),
    name: review.name?.trim() || undefined,
    headline: review.headline?.trim() || undefined,
    description: review.description.trim(),
    createdAt: new Date().toISOString(),
  };
  const next = [newReview, ...existing].slice(0, 200); // cap to avoid unbounded growth
  writeJSON(getReviewsKey(productId), next);
  return newReview;
};


