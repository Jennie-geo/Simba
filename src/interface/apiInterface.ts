export interface GetRateReturnType {
  base_currency: string;
  quote_currency: string;
  quote: number;
  date: string;
  error?: any;
}

export interface GetRateReturn {
  base_code: string;
  target_code: string;
  quote: number;
  date: string;
  error?: any;
}
