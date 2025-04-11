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
        const waitTime = baseDelay * Math.pow(2, i) + jitter;
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

const ETN_JETTON_ADDRESS = 'EQAz_XrD0hA4cqlprWkpS7TIAhCG4CknAfob1VQm-2mBf5Vl';
const CACHE_KEY = 'etn_balances_cache';
const CACHE_EXPIRY_HOURS = 24;

const isCacheValid = (timestamp: number) => {
  const now = Date.now();
  return now - timestamp < CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
};

const fetchBalancesSequentially = async () => {
  const balances = [];
  for (const wallet of ECOSYSTEM_WALLETS) {
    try {
      await delay(2000); // Delay between requests
      const response = await fetchWithRetry(`https://tonapi.io/v2/accounts/${wallet.address}/jettons`);
      const etnJetton = response?.data?.balances?.find(
        (token: any) => token.jetton?.address === ETN_JETTON_ADDRESS
      );
      balances.push({
        ...wallet,
        balance: etnJetton?.balance || '0'
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
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (isCacheValid(parsed.timestamp)) {
          setBalances(parsed.data);
          return;
        }
      }

      try {
        const updatedBalances = await fetchBalancesSequentially();
        setBalances(updatedBalances);
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), data: updatedBalances })
        );
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    };

    fetchBalances();
  }, []);

  return { balances };
};
