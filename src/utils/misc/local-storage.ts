export type StorageData = {
  favoriteGames: string[];
};

export const createDefaultData: () => StorageData = () => ({
  favoriteGames: [],
});

export const getStorageData: () => StorageData | null = () => {
  const data = localStorage.getItem("user");
  return data ? (JSON.parse(data) as StorageData) : null;
};

export const setStorageData = (data: StorageData) =>
  localStorage.setItem("user", JSON.stringify(data));

export const clearStorageData = () => localStorage.clear();
