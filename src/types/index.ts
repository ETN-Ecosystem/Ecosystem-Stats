export interface TokenData {
  metadata: {
    name: string;
    symbol: string;
    decimals: number;
    image: string;
    websites: string[];
    social: string[];
  };
  verification: string;
  admin?: {
    address: string;
  };
  total_supply: string;
  holders_count: number;
}

export interface TokenRates {
  USD: number;
  TON: number;
  ETB: number;
}

export interface Transaction {
  hash?: string;
  event_id?: string;
  timestamp: number;
  in_msg?: {
    op_name: string;
    value?: string;
    token_name?: string;
  };
  event_type?: string;
  amount?: string;
}

export interface SBTItem {
  owner?: {
    address: string;
  };
  type: string;
}