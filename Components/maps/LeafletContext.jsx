'use client'; // Required for Next.js 13/14/15 App Router

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
  });
}

// Line 15: Should now work if the environment is correct
export const LeafletContext = createContext(null);
export const LeafletProvider = LeafletContext.Provider;

export function useLeafletContext() {
  const context = useContext(LeafletContext);
  if (!context) {
    throw new Error("useLeafletContext must be used within a LeafletProvider");
  }
  return context;
}
