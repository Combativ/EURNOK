export interface ExchangeRateData {
  rate: number; // 1 EUR = x NOK
  lastUpdated: number; // Timestamp
  sourceUrl?: string;
  sourceTitle?: string;
}

export enum Currency {
  NOK = 'NOK',
  EUR = 'EUR'
}