import { createContext, useContext } from 'react';

export const LeafletContext = createContext(null);

export function useLeaflet() {
  return useContext(LeafletContext);
}
