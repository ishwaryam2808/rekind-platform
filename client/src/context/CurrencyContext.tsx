import React, { createContext, useContext, useState } from 'react';

export type Currency = 'INR' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  currencySymbol: string;
  formatPrice: (amount: number | undefined | null, itemCurrency?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('rekind_currency');
    return saved === 'USD' ? 'USD' : 'INR'; // Defaults to INR (Indian Currency) as requested
  });

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('rekind_currency', c);
  };

  const currencySymbol = currency === 'INR' ? '₹' : '$';

  const formatPrice = (amount: number | undefined | null, itemCurrency?: string): string => {
    const safeAmount = Number(amount) || 0;
    const cur = itemCurrency === 'USD' || itemCurrency === '$'
      ? 'USD'
      : (itemCurrency === 'INR' || itemCurrency === '₹' ? 'INR' : currency);
    const symbol = cur === 'INR' ? '₹' : '$';
    return `${symbol}${safeAmount.toLocaleString('en-IN')}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencySymbol, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
