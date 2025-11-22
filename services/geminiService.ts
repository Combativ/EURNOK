import { ExchangeRateData } from "../types";

export const fetchExchangeRate = async (): Promise<ExchangeRateData | null> => {
  try {
    // Fetching from Frankfurter API which uses European Central Bank data.
    // It is free, reliable, and public.
    const response = await fetch('https://api.frankfurter.app/latest?from=EUR&to=NOK');
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    
    // The API returns structure like: { amount: 1.0, base: "EUR", date: "2024-xx-xx", rates: { NOK: 11.52 } }
    const rate = data.rates.NOK;

    if (!rate) {
        throw new Error('Invalid rate data received');
    }

    return {
      rate,
      lastUpdated: Date.now(),
      sourceUrl: 'https://www.frankfurter.app',
      sourceTitle: 'Frankfurter API (EZB Daten)'
    };

  } catch (error) {
    console.error("Failed to fetch exchange rate:", error);
    return null;
  }
};