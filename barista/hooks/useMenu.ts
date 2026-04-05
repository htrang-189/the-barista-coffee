'use client';

import { useEffect, useState } from 'react';
import { apiClient, Category, Product } from '@/lib/api';
import { cache } from '@/lib/cache';
import { saveToIndexedDB, getFromIndexedDB } from '@/lib/cache';

interface MenuData {
  categories: Category[];
  products: Product[];
}

interface CacheMetadata {
  data: MenuData;
  eTag?: string;
  timestamp: number;
  size: number;
}

interface UseMenuReturn {
  categories: Category[];
  products: Product[];
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  isCached: boolean;
}

const CACHE_KEY_CATEGORIES = 'MENU_CATEGORIES';
const CACHE_KEY_CATEGORIES_METADATA = 'MENU_CATEGORIES_META';
const CACHE_KEY_PRODUCTS = 'MENU_PRODUCTS';
const CACHE_KEY_PRODUCTS_METADATA = 'MENU_PRODUCTS_META';
const CACHE_KEY_MENU_METADATA = 'MENU_METADATA';
const DB_NAME = 'BaristaDB';
const DB_KEY_MENU = 'menu_cache';
const CACHE_DURATION_DAYS = 1; // 24 hours
const SIZE_THRESHOLD = 50 * 1024; // 50 KB threshold for localStorage vs IndexedDB

const estimateSize = (obj: any): number => {
  return new Blob([JSON.stringify(obj)]).size;
};

const getCacheStorage = async (menuData: MenuData): Promise<'localStorage' | 'indexeddb'> => {
  const size = estimateSize(menuData);
  return size > SIZE_THRESHOLD ? 'indexeddb' : 'localStorage';
};

export const useMenu = (): UseMenuReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsCached(false);

        // Check if we have a cached menu
        let cachedMenu: MenuData | null = null;
        const cacheStorage = await getCacheStorage({ categories: [], products: [] });

        if (cacheStorage === 'localStorage') {
          const cached = cache.get(CACHE_KEY_MENU_METADATA);
          if (cached) {
            cachedMenu = (cached as CacheMetadata).data;
          }
        } else {
          const cached = await getFromIndexedDB(DB_NAME, DB_KEY_MENU);
          if (cached) {
            cachedMenu = (cached as CacheMetadata).data;
          }
        }

        let fetchedCategories: Category[] | null = null;
        let fetchedProducts: Product[] | null = null;
        let fetchError = false;

        try {
          // Get current ETag from metadata if cached
          let currentETag = '';
          if (cacheStorage === 'localStorage') {
            const meta = cache.get(CACHE_KEY_CATEGORIES_METADATA) as CacheMetadata | null;
            currentETag = meta?.eTag || '';
          } else {
            const meta = (await getFromIndexedDB(DB_NAME, CACHE_KEY_CATEGORIES_METADATA)) as CacheMetadata | null;
            currentETag = meta?.eTag || '';
          }

          // Fetch categories with ETag check
          const categoryResponse = await apiClient.get('/api/categories', {
            headers: currentETag ? { 'If-None-Match': currentETag } : {},
          });

          // If not 304 Not Modified, process response
          if (categoryResponse && !Array.isArray(categoryResponse)) {
            // API returned wrapper object
            fetchedCategories = categoryResponse.data || categoryResponse;
          } else {
            fetchedCategories = categoryResponse;
          }

          if (fetchedCategories) {
            // Store with metadata
            const metadata: CacheMetadata = {
              data: { categories: fetchedCategories, products: [] },
              eTag: '', // Would be from response headers if provided
              timestamp: Date.now(),
              size: estimateSize(fetchedCategories),
            };

            if (cacheStorage === 'localStorage') {
              cache.set(CACHE_KEY_CATEGORIES_METADATA, metadata, CACHE_DURATION_DAYS);
            } else {
              await saveToIndexedDB(DB_NAME, CACHE_KEY_CATEGORIES_METADATA, metadata);
            }
            setCategories(fetchedCategories);
            setIsCached(false);
          }
        } catch (err: any) {
          // If 304 Not Modified or other error, use cache
          if (err?.status === 304 || (cachedMenu?.categories && !fetchedCategories)) {
            if (cachedMenu?.categories) {
              setCategories(cachedMenu.categories);
              setIsCached(true);
            }
          } else {
            console.error('Failed to fetch categories:', err);
            fetchError = true;
          }
        }

        try {
          // Get current ETag from metadata if cached
          let currentETag = '';
          if (cacheStorage === 'localStorage') {
            const meta = cache.get(CACHE_KEY_PRODUCTS_METADATA) as CacheMetadata | null;
            currentETag = meta?.eTag || '';
          } else {
            const meta = (await getFromIndexedDB(DB_NAME, CACHE_KEY_PRODUCTS_METADATA)) as CacheMetadata | null;
            currentETag = meta?.eTag || '';
          }

          // Fetch products with ETag check
          const productResponse = await apiClient.get('/api/products', {
            headers: currentETag ? { 'If-None-Match': currentETag } : {},
          });

          // If not 304 Not Modified, process response
          if (productResponse && !Array.isArray(productResponse)) {
            // API returned wrapper object
            fetchedProducts = productResponse.data || productResponse;
          } else {
            fetchedProducts = productResponse;
          }

          if (fetchedProducts) {
            // Store with metadata
            const metadata: CacheMetadata = {
              data: { categories: [], products: fetchedProducts },
              eTag: '', // Would be from response headers if provided
              timestamp: Date.now(),
              size: estimateSize(fetchedProducts),
            };

            if (cacheStorage === 'localStorage') {
              cache.set(CACHE_KEY_PRODUCTS_METADATA, metadata, CACHE_DURATION_DAYS);
            } else {
              await saveToIndexedDB(DB_NAME, CACHE_KEY_PRODUCTS_METADATA, metadata);
            }
            setProducts(fetchedProducts);
            setIsCached(false);
          }
        } catch (err: any) {
          // If 304 Not Modified or other error, use cache
          if (err?.status === 304 || (cachedMenu?.products && !fetchedProducts)) {
            if (cachedMenu?.products) {
              setProducts(cachedMenu.products);
              setIsCached(true);
            }
          } else {
            console.error('Failed to fetch products:', err);
            fetchError = true;
          }
        }

        // Handle offline/error scenarios
        if (fetchError) {
          if (cachedMenu?.categories && cachedMenu?.products) {
            // Serve cached data with offline banner
            setCategories(cachedMenu.categories);
            setProducts(cachedMenu.products);
            setIsOffline(true);
            setIsCached(true);
            // No error message when serving cached data
          } else {
            // First-time offline: no cache available
            setError('Unable to load menu. Please check your connection.');
            setIsOffline(true);
          }
        } else {
          setIsOffline(false);
        }

        setLoading(false);
      } catch (err) {
        console.error('Menu fetch error:', err);
        setError('Failed to load menu');
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return {
    categories,
    products,
    loading,
    error,
    isOffline,
    isCached,
  };
};
