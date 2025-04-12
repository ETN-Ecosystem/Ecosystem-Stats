import { useState, useEffect } from 'react';
import axios from 'axios';
import { ECOSYSTEM_WALLETS, TOKEN_ADDRESS } from '../constants';

interface WalletBalance {
  purpose: string;
  address: string;
  balance: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, retries = 3, baseDelay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url);
      return response;
    } catch (error: any) {
      if (error?.response?.status === 429 && i < retries - 1) {
        const jitter = Math.random() * 1000;
        const waitTime = baseDelay * Math.pow(2, i) + jitter;
        await delay(waitTime);
        continue;
      }
      if (error?.response?.status === 404) {
        return { data: { balance: '0' } };
      }
      throw error;
    }
  }
};

const fetchBalances = async () => {
  const balances: WalletBalance[] = [];

  for (const wallet of ECOSYSTEM_WALLETS) {
    try {
      await delay(1000); // throttle API calls
      const url = `https://tonapi.io/v2/accounts/${wallet.address}/jettons/${TOKEN_ADDRESS}?currencies=&supported_extensions=custom_payload`;
      const response = await fetchWithRetry(url);
      const rawBalance = response?.data?.balance || '0';
      const readableBalance = (parseFloat(rawBalance) / 1e9).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      });
      balances.push({
        purpose: wallet.purpose,
        address: wallet.address,
        balance: readableBalance,
      });
    } catch (error) {
      console.error(`Error fetching ${wallet.address}:`, error);
      balances.push({
        purpose: wallet.purpose,
        address: wallet.address,
        balance: '0',
      });
    }
  }

  return balances;
};

export const useTokenBalances = () => {
  const [balances, setBalances] = useState<WalletBalance[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchBalances();
      setBalances(data);
    };
    load();
  }, []);

  return { balances };
};
