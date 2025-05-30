
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

export type Currency = 'USD' | 'EUR' | 'ETB';

interface CurrencyContextType {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  convertToSelectedCurrency: (usdPrice: number) => number;
  formatPrice: (amount: number, currency?: Currency) => string;
  currencies: Readonly<Currency[]>;
  currencySymbols: Readonly<Record<Currency, string>>;
}

const CONVERSION_RATES: Readonly<Record<Currency, number>> = {
  USD: 1,
  EUR: 0.92, // 1 USD = 0.92 EUR
  ETB: 57.00, // 1 USD = 57 ETB
};

const CURRENCY_SYMBOLS: Readonly<Record<Currency, string>> = {
  USD: '$',
  EUR: '€',
  ETB: 'Br',
};

const SUPPORTED_CURRENCIES: Readonly<Currency[]> = ['USD', 'EUR', 'ETB'];

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrencyState] = useState<Currency>('USD');

  const setSelectedCurrency = useCallback((currency: Currency) => {
    if (SUPPORTED_CURRENCIES.includes(currency)) {
      setSelectedCurrencyState(currency);
    }
  }, []);

  const convertToSelectedCurrency = useCallback((usdPrice: number): number => {
    const rate = CONVERSION_RATES[selectedCurrency];
    return usdPrice * rate;
  }, [selectedCurrency]);

  const formatPrice = useCallback((amount: number, currencyOverride?: Currency): string => {
    const currencyToUse = currencyOverride || selectedCurrency;
    const symbol = CURRENCY_SYMBOLS[currencyToUse];
    let formattedAmount;

    // Basic formatting, could be enhanced with Intl.NumberFormat
    if (currencyToUse === 'ETB') {
        formattedAmount = amount.toFixed(2); // Birr often shown with two decimal places
        return `${symbol} ${formattedAmount}`;
    } else {
        formattedAmount = amount.toFixed(2);
        return `${symbol}${formattedAmount}`;
    }
  }, [selectedCurrency]);

  const value = useMemo(() => ({
    selectedCurrency,
    setSelectedCurrency,
    convertToSelectedCurrency,
    formatPrice,
    currencies: SUPPORTED_CURRENCIES,
    currencySymbols: CURRENCY_SYMBOLS,
  }), [selectedCurrency, setSelectedCurrency, convertToSelectedCurrency, formatPrice]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
