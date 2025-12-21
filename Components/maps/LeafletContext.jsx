import { createContext, useContext } from 'react';
export const CONTEXT_VERSION = 1;
export function createLeafletContext(map) {
  return Object.freeze({
    __version: CONTEXT_VERSION,
    map
  });
}
export function extendContext(source, extra) {
  return Object.freeze({
    ...source,
    ...extra
  });re
}
<<<<<<< HEAD

export const LeafletContext = createContext(null);
=======
export const LeafletContext = createContext();
>>>>>>> 67d2381ddaac248dfbffffd79228a3814e186ae1
export const LeafletProvider = LeafletContext.Provider;

export function useLeafletContext() {
  const context = useContext(LeafletContext);
  // Optional: check if context exists
  if (!context) {
    throw new Error("useLeafletContext must be used within a LeafletProvider");
  }
  return context;
}
