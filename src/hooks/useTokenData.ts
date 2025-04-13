import { useState, useEffect } from 'react';
import axios from 'axios';
import { TOKEN_ADDRESS, STONFI_ADDRESS, SBT_COLLECTIONS } from '../constants';
import { TokenData, TokenRates, Transaction, SBTItem } from '../types';

const FETCH_COOLDOWN = 30000; // 30 seconds
const PRICE_CHART_INTERVAL = 7200000; // 2 hours
const CACHE_KEY = 'priceChartData';
const CACHE_EXPIRY = 7200000; // 2 hours in milliseconds
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 3000;
const REQUEST_DELAY = 3000;
const MAX_RETRY_DELAY = 30000;

const getPriceChartFromCache = () => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_EXPIRY) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
  return data;
};

const setPriceChartCache = (data: { labels: string[]; prices: number[] }) => {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      data,
      timestamp: Date.now(),
    })
  );
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const calculateRetryDelay = (attempt: number, baseDelay: number) => {
  const delay = Math.min(
    baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
    MAX_RETRY_DELAY
  );
  return delay;
};

const retryWithBackoff = async (fn: () => Promise<any>, retries = MAX_RETRIES, baseDelay = INITIAL_RETRY_DELAY) => {
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      if (attempt === retries) {
        if (error?.response?.status === 404) {
          return null;
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

const sequentialFetch = async <T>(requests: (() => Promise<T>)[]): Promise<T[]> => {
  const results: T[] = [];
  for (const request of requests) {
    try {
      await sleep(REQUEST_DELAY);
      const result = await retryWithBackoff(request);
      if (result !== null) {
        results.push(result);
      }
    } catch (error) {
      console.error('Error in sequential fetch:', error);
      // Continue with other requests even if one fails
    }
  }
  return results;
};

export const useTokenData = () => {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [rates, setRates] = useState<TokenRates>({ USD: 0, TON: 0, ETB: 0 });
  const [previousRates, setPreviousRates] = useState<TokenRates>({ USD: 0, TON: 0, ETB: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sbtItems, setSbtItems] = useState<SBTItem[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [priceChartData, setPriceChartData] = useState<{ labels: string[]; prices: number[] } | null>(() => getPriceChartFromCache());

  useEffect(() => {
    const fetchPriceChartData = async () => {
      try {
        const endDate = Math.floor(Date.now() / 1000);
        const startDate = endDate - (30 * 24 * 60 * 60); // 30 days ago
        const apiUrl = `https://tonapi.io/v2/rates/chart?token=${TOKEN_ADDRESS}&currency=usd&start_date=${startDate}&end_date=${endDate}&points_count=200`;
        
        const response = await retryWithBackoff(() => axios.get(apiUrl));
        if (!response) return;

        const points = response.data.points || [];
        const labels = points.map((point: [number, number]) => {
          const date = new Date(point[0] * 1000);
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });
        });
        const prices = points.map((point: [number, number]) => point[1]);
        
        const newChartData = { labels, prices };
        setPriceChartData(newChartData);
        setPriceChartCache(newChartData);
      } catch (error) {
        console.error('Error fetching price chart data:', error);
        const cachedData = getPriceChartFromCache();
        if (cachedData && !priceChartData) {
          setPriceChartData(cachedData);
        }
      }
    };

    const fetchData = async () => {
      const now = Date.now();
      if (now - lastFetchTime < FETCH_COOLDOWN) return;

      try {
        setLastFetchTime(now);

        const [tokenResponse, ratesResponse, transactionsResponse, eventsResponse] = await sequentialFetch([
          () => axios.get(`https://tonapi.io/v2/jettons/${TOKEN_ADDRESS}`),
          () => axios.get(`https://tonapi.io/v2/rates?tokens=${TOKEN_ADDRESS}&currencies=ton,usd,etb`),
          () => axios.get(`https://tonapi.io/v2/blockchain/accounts/${STONFI_ADDRESS}/transactions`),
          () => axios.get(`https://tonapi.io/v2/accounts/${STONFI_ADDRESS}/events?limit=25`)
        ]);

        if (tokenResponse?.data) {
          setTokenData(tokenResponse.data);
        }

        if (ratesResponse?.data?.rates?.[TOKEN_ADDRESS]?.prices) {
          const newRates = {
            USD: ratesResponse.data.rates[TOKEN_ADDRESS].prices.USD || 0,
            TON: ratesResponse.data.rates[TOKEN_ADDRESS].prices.TON || 0,
            ETB: ratesResponse.data.rates[TOKEN_ADDRESS].prices.ETB || 0
          };
          setPreviousRates(rates);
          setRates(newRates);
        }

        if (transactionsResponse?.data && eventsResponse?.data) {
          const combinedTransactions = [
            ...(transactionsResponse.data.transactions || []),
            ...(eventsResponse.data.events || [])
          ]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10);
          setTransactions(combinedTransactions);
        }

        const sbtResponses = await sequentialFetch(
          SBT_COLLECTIONS.map(collection => 
            () => axios.get(`https://tonapi.io/v2/nfts/collections/${collection.address}/items`)
          )
        );

        const initialSbtData = sbtResponses.reduce((acc, response, index) => {
          if (!response?.data?.nft_items) return acc;
          const items = response.data.nft_items.map((item: any) => ({
            ...item,
            type: SBT_COLLECTIONS[index].type
          }));
          return [...acc, ...items];
        }, []);

        const sbtItemsWithImage = await sequentialFetch(
          initialSbtData.map(item => async () => {
            if (!item?.address) return null;
            try {
              const itemDetailsResponse = await axios.get(`https://tonapi.io/v2/nfts/items/${item.address}`);
              return {
                ...item,
                image: itemDetailsResponse?.data?.content?.image || null,
              };
            } catch (error) {
              console.error(`Error fetching details for SBT ${item.address}:`, error);
              return { ...item, image: null };
            }
          })
        );

        setSbtItems(sbtItemsWithImage.filter(Boolean));

        const cachedData = getPriceChartFromCache();
        if (!cachedData) {
          await fetchPriceChartData();
        }
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, FETCH_COOLDOWN);
    const priceChartInterval = setInterval(fetchPriceChartData, PRICE_CHART_INTERVAL);

    return () => {
      clearInterval(interval);
      clearInterval(priceChartInterval);
    };
  }, [lastFetchTime, rates, priceChartData]);

  return { tokenData, rates, previousRates, transactions, sbtItems, priceChartData };
};