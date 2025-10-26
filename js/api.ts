import type { FavoriteCoffee } from './types.js';

const BASE_URL = 'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/api';

export async function getFavoriteProducts(): Promise<FavoriteCoffee[]> {
  try {
    const res = await fetch(`${BASE_URL}/products/favorites`);
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch favorite products:', err);
    throw err;
  }
}
