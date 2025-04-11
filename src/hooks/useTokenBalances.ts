import { useState, useEffect } from 'react';
import axios from 'axios';
import { ECOSYSTEM_WALLETS } from '../constants';

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
        const waitTime = (baseDelay * Math.pow(2, i)) + jitter;
        await delay(waitTime);
        continue;
      }
      if (error?.response?.status === 404) {
        return { data: { balances: [] } };
      }
      throw error;
    }
  }
};

const fetchBalancesSequentially = async () => {
  const balances = [];
  for (const wallet of ECOSYSTEM_WALLETS) {
    try {
      await delay(2000); // Increased delay between requests
      const response = await fetchWithRetry(`https://tonapi.io/v2/accounts/${wallet.address}/jettons`);
      balances.push({
        ...wallet,
        balance: response?.data?.balances?.[0]?.balance || '0'
      });
    } catch (error) {
      console.error(`Error fetching balance for ${wallet.address}:`, error);
      balances.push({
        ...wallet,
        balance: '0'
      });
    }
  }
  return balances;
};

export const useTokenBalances = () => {
  const [balances, setBalances] = useState<WalletBalance[]>([]);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const updatedBalances = await fetchBalancesSequentially();
        setBalances(updatedBalances);
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 60000);

    return () => clearInterval(interval);
  }, []);

  return { balances };
};