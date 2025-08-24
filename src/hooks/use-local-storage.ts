"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // By memoizing the initial value, we prevent it from being recreated on every render,
  // which was the root cause of the infinite loop.
  const memorizedInitialValue = useMemo(() => initialValue, []);
  
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return memorizedInitialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : memorizedInitialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return memorizedInitialValue;
    }
  }, [memorizedInitialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      window.localStorage.setItem(key, JSON.stringify(newValue));
      setStoredValue(newValue);
      window.dispatchEvent(new Event("local-storage"));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage", handleStorageChange);
    };
  }, [readValue]);


  return [storedValue, setValue];
}
