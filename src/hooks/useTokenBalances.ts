import { useState, useEffect } from 'react';
import axios from 'axios';
import { ECOSYSTEM_WALLETS, TOKEN_ADDRESS } from '../constants';

interface WalletBalance {
  purpose: string;
  address: string;
  balance: string;
}

const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 3000;
const REQUEST_DELAY = 3000;
const MAX_RETRY_DELAY = 30000;
const FETCH_INTERVAL = 30000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const calculateRetryDelay = (attempt: number, baseDelay: number) => {
  const delay = Math.min(
    baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
    MAX_RETRY_DELAY
  );
  return delay;
};

const fetchWithRetry = async (url: string, retries = MAX_RETRIES, baseDelay = INITIAL_RETRY_DELAY) => {
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url);
      return response;
    } catch (error: any) {
      lastError = error;
      
      if (attempt === retries) {
        if (error?.response?.status === 404) {
          return { data: { balance: '0' } };
        }
        throw error;
      }

      if (error?.response?.status === 429 || error?.code === 'ECONNABORTED' || error?.code === 'ERR_NETWORK') {
        const delay = calculateRetryDelay(attempt, baseDelay);
        await sleep(delay);
        continue;
      }

      throw error;
    }
  }
};

const fetchBalancesSequentially = async () => {
  const balances = [];
  for (const wallet of ECOSYSTEM_WALLETS) {
    try {
      await sleep(REQUEST_DELAY);
      const response = await fetchWithRetry(
        `https://tonapi.io/v2/accounts/${wallet.address}/jettons/${TOKEN_ADDRESS}?currencies=&supported_extensions=custom_payload`
      );
      balances.push({
        ...wallet,
        balance: response?.data?.balance || '0'
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
    const interval = setInterval(fetchBalances, FETCH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return { balances };
};