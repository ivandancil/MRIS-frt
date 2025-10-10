import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for the SearchContextProps
interface SearchContextProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

// Define the type for the SearchProvider props
interface SearchProviderProps {
  children: ReactNode; 
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextProps => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
