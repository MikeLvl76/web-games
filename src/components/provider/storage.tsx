"use client";

import {
  StorageData,
  createDefaultData,
  getStorageData,
  setStorageData,
} from "@/lib/utils";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type StorageContextType = {
  content: StorageData;
  setContent: Dispatch<SetStateAction<StorageData>>;
};

const StorageContext = createContext<StorageContextType>({
  content: createDefaultData(),
  setContent: () => {},
});

export const useStorageContext = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error("useStorageContext must be used inside StorageProvider");
  }
  return context;
};

type Props = {
  children: ReactNode;
};

export function StorageProvider({ children }: Props) {
  const [content, setContent] = useState<StorageData>(createDefaultData());

  useEffect(() => {
    const data = getStorageData();

    if (!data) return;

    setContent(data);
  }, []);

  useEffect(() => {
    if (!content) return;

    setStorageData(content);
  }, [content]);

  return (
    <StorageContext.Provider value={{ content, setContent }}>
      {children}
    </StorageContext.Provider>
  );
}
