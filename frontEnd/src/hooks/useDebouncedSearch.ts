import { useEffect } from "react";

export const useDebouncedSearch = (searchTerm: string, delay: number, callback: (term: string) => void) => {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback(searchTerm);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay, callback]);
};