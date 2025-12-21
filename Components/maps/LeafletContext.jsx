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

export const LeafletContext = createContext(null);
export const LeafletProvider = LeafletContext.Provider;

export function useLeafletContext() {
  const context = useContext(LeafletContext);
  // Optional: check if context exists
  if (!context) {
    throw new Error("useLeafletContext must be used within a LeafletProvider");
  }
  return context;
}
