import * as FileSystem from 'expo-file-system';

// Copies a bundled PDF asset from the project root into a user-accessible location.
// Returns the final saved URI (SAF URI on Android if permission granted, otherwise app doc URI).
export const saveBundledPdf = async (relativePathFromRoot: string, suggestedFileName?: string): Promise<string> => {
  const assetUri = FileSystem.bundleDirectory ? `${FileSystem.bundleDirectory}${relativePathFromRoot}` : `asset:///${relativePathFromRoot}`;
  // Fallback to app document directory copy first
  const fileName = suggestedFileName || relativePathFromRoot.split('/').pop() || 'file.pdf';
  const tmpDest = `${FileSystem.documentDirectory}${fileName}`;
  try {
    await FileSystem.copyAsync({ from: assetUri, to: tmpDest });
    return tmpDest;
  } catch (err) {
    console.warn('Copy to app docs failed, trying read/write base64:', err);
    // As a fallback, try to read as base64 and write
    try {
      const base64 = await FileSystem.readAsStringAsync(assetUri, { encoding: FileSystem.EncodingType.Base64 });
      await FileSystem.writeAsStringAsync(tmpDest, base64, { encoding: FileSystem.EncodingType.Base64 });
      return tmpDest;
    } catch (err2) {
      console.error('Failed to access bundled asset:', err2);
      throw err2;
    }
  }
};

// Simple storage helpers with localStorage fallback and in-memory backup
import { notifyCartChanged } from './cartEvents';

type ViewedProduct = { id: string; name: string };

const RECENT_SEARCHES_KEY = 'recentSearches';
const RECENTLY_VIEWED_KEY = 'recentlyViewedProducts';
const PRODUCT_REVIEWS_PREFIX = 'productReviews:'; // per-product key
const FAVORITES_KEY = 'favoriteProducts';
const CART_ITEMS_KEY = 'cartItems';
const COMPARE_LIST_KEY = 'compareProducts';
const SAVED_CARTS_KEY = 'savedCarts';

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

// --- Favorites (Wish List) ---
export type FavoriteProduct = {
  id: string;
  name: string;
  image?: string;
  price?: string;
  status?: string;
};

export const getFavoriteProducts = (): FavoriteProduct[] => {
  return readJSON<FavoriteProduct[]>(FAVORITES_KEY, []);
};

export const isProductFavorite = (productId: string): boolean => {
  if (!productId) return false;
  return getFavoriteProducts().some((p) => p.id === productId);
};

export const addFavoriteProduct = (product: FavoriteProduct) => {
  if (!product?.id) return;
  const current = getFavoriteProducts();
  if (current.some((p) => p.id === product.id)) return;
  const next = [product, ...current].slice(0, 200);
  writeJSON(FAVORITES_KEY, next);
};

export const removeFavoriteProduct = (productId: string) => {
  const current = getFavoriteProducts();
  const next = current.filter((p) => p.id !== productId);
  writeJSON(FAVORITES_KEY, next);
};

export const toggleFavoriteProduct = (product: FavoriteProduct): boolean => {
  if (!product?.id) return false;
  const current = getFavoriteProducts();
  const exists = current.some((p) => p.id === product.id);
  if (exists) {
    writeJSON(FAVORITES_KEY, current.filter((p) => p.id !== product.id));
    return false;
  }
  writeJSON(FAVORITES_KEY, [product, ...current]);
  return true;
};

// --- Cart (Bag) ---
export type CartItem = {
  productId: string;
  quantity: number;
  productType?: 'tyre' | 'promotional';
};

export const getCartItems = (): CartItem[] => {
  return readJSON<CartItem[]>(CART_ITEMS_KEY, []);
};

// Lightweight type resolver – treat ids starting with 'PM' as promotional
const resolveProductType = (productId: string): 'tyre' | 'promotional' => {
  return productId?.toUpperCase().startsWith('PM') ? 'promotional' : 'tyre';
};

export const addToCart = (productId: string, quantity: number = 1): { ok: true } | { ok: false; reason: 'type-mismatch' } => {
  if (!productId) return { ok: true };
  const qty = Math.max(1, Math.floor(quantity || 1));
  const current = getCartItems();
  const newType = resolveProductType(productId);
  // If cart has items of different type, block
  if (current.length > 0) {
    const existingType = resolveProductType(current[0].productId);
    if (existingType !== newType) {
      return { ok: false, reason: 'type-mismatch' };
    }
  }
  const existingIndex = current.findIndex((c) => c.productId === productId);
  if (existingIndex >= 0) {
    const updated = [...current];
    updated[existingIndex] = {
      productId,
      quantity: Math.min(9999, (updated[existingIndex].quantity || 0) + qty),
    };
    writeJSON(CART_ITEMS_KEY, updated);
  } else {
    writeJSON(CART_ITEMS_KEY, [{ productId, quantity: qty, productType: newType }, ...current]);
  }
  notifyCartChanged();
  return { ok: true };
};

export const purgeCart = () => {
  const current = getCartItems();
  const next = current.filter((c) => (c?.productId && (c.quantity || 0) > 0));
  if (next.length !== current.length) {
    writeJSON(CART_ITEMS_KEY, next);
    notifyCartChanged();
  }
  return next;
};

export const updateCartItem = (productId: string, quantity: number) => {
  if (!productId) return;
  const qty = Math.max(0, Math.floor(quantity || 0));
  const current = getCartItems();
  const index = current.findIndex((c) => c.productId === productId);
  if (index < 0) {
    if (qty > 0) {
      writeJSON(CART_ITEMS_KEY, [{ productId, quantity: qty }, ...current]);
      notifyCartChanged();
    }
    return;
  }
  if (qty === 0) {
    const next = current.filter((c) => c.productId !== productId);
    writeJSON(CART_ITEMS_KEY, next);
    notifyCartChanged();
  } else {
    const updated = [...current];
    updated[index] = { productId, quantity: Math.min(99999, qty) };
    writeJSON(CART_ITEMS_KEY, updated);
    notifyCartChanged();
  }
};

export const removeFromCart = (productId: string) => {
  const current = getCartItems();
  writeJSON(CART_ITEMS_KEY, current.filter((c) => c.productId !== productId));
  notifyCartChanged();
};

export const clearCart = () => {
  writeJSON(CART_ITEMS_KEY, []);
  notifyCartChanged();
};

// --- Compare List ---
export type CompareProduct = {
  id: string;
  name: string;
  image?: string;
  price?: string;
  status?: string;
};

export const getCompareProducts = (): CompareProduct[] => {
  return readJSON<CompareProduct[]>(COMPARE_LIST_KEY, []);
};

export const addCompareProduct = (product: CompareProduct) => {
  if (!product?.id) return;
  const current = getCompareProducts();
  // Deduplicate by id and cap at 4 items (typical compare UX)
  const without = current.filter((p) => p.id !== product.id);
  const next = [product, ...without].slice(0, 4);
  writeJSON(COMPARE_LIST_KEY, next);
};

export const removeCompareProduct = (productId: string) => {
  const current = getCompareProducts();
  writeJSON(COMPARE_LIST_KEY, current.filter((p) => p.id !== productId));
};

export const clearCompareProducts = () => {
  writeJSON(COMPARE_LIST_KEY, []);
};


// --- Saved Carts ---
export type SavedCartStored = {
  id: string;
  name: string;
  description?: string;
  date: string; // ISO or formatted
  items: CartItem[];
};

export const getSavedCarts = (): SavedCartStored[] => {
  return readJSON<SavedCartStored[]>(SAVED_CARTS_KEY, []);
};

export const addSavedCart = (cart: SavedCartStored): SavedCartStored[] => {
  const current = getSavedCarts();
  const next = [cart, ...current].slice(0, 50);
  writeJSON(SAVED_CARTS_KEY, next);
  return next;
};

export const updateSavedCart = (cart: SavedCartStored): SavedCartStored[] => {
  const current = getSavedCarts();
  const next = [cart, ...current.filter((c) => c.id !== cart.id)];
  writeJSON(SAVED_CARTS_KEY, next);
  return next;
};

export const removeSavedCart = (id: string): SavedCartStored[] => {
  const current = getSavedCarts();
  const next = current.filter((c) => c.id !== id);
  writeJSON(SAVED_CARTS_KEY, next);
  return next;
};

export const getSavedCartById = (id: string): SavedCartStored | undefined => {
  return getSavedCarts().find((c) => c.id === id);
};

