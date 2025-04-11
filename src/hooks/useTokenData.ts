// etn-ecosystem-stats/src/hooks/useTokenData.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { TOKEN_ADDRESS, STONFI_ADDRESS, SBT_COLLECTIONS } from '../constants';
import { TokenData, TokenRates, Transaction, SBTItem } from '../types';

const FETCH_COOLDOWN = 3000; // 3 seconds

export const useTokenData = () => {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [rates, setRates] = useState<TokenRates>({ USD: 0, TON: 0, ETB: 0 });
  const [previousRates, setPreviousRates] = useState<TokenRates>({ USD: 0, TON: 0, ETB: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sbtItems, setSbtItems] = useState<SBTItem[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [priceChartData, setPriceChartData] = useState<{ labels: string[]; prices: number[] } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const now = Date.now();
      if (now - lastFetchTime < FETCH_COOLDOWN) return;

      try {
        setLastFetchTime(now);

        const [tokenResponse, ratesResponse, transactionsResponse, eventsResponse, ...sbtResponses] =
          await Promise.all([
            axios.get(`https://tonapi.io/v2/jettons/${TOKEN_ADDRESS}`),
            axios.get(`https://tonapi.io/v2/rates?tokens=${TOKEN_ADDRESS}&currencies=ton,usd,etb`),
            axios.get(`https://tonapi.io/v2/blockchain/accounts/${STONFI_ADDRESS}/transactions`),
            axios.get(`https://tonapi.io/v2/accounts/${STONFI_ADDRESS}/events?limit=25`),
            ...SBT_COLLECTIONS.map(collection =>
              axios.get(`https://tonapi.io/v2/nfts/collections/${collection.address}/items`)
            )
          ]);

        setTokenData(tokenResponse.data);

        const newRates = {
          USD: ratesResponse.data.rates[TOKEN_ADDRESS].prices.USD,
          TON: ratesResponse.data.rates[TOKEN_ADDRESS].prices.TON,
          ETB: ratesResponse.data.rates[TOKEN_ADDRESS].prices.ETB
        };

        setPreviousRates(rates);
        setRates(newRates);

        const combinedTransactions = [
          ...transactionsResponse.data.transactions,
          ...eventsResponse.data.events
        ]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 10);

        setTransactions(combinedTransactions);

        const initialSbtData = SBT_COLLECTIONS.reduce((acc, collection, index) => {
          const items = sbtResponses[index].data.nft_items.map((item: any) => ({
            ...item,
            type: collection.type
          }));
          return [...acc, ...items];
        }, []);

        const sbtItemsWithImage = await Promise.all(
          initialSbtData.map(async (item) => {
            try {
              const itemDetailsResponse = await axios.get(`https://tonapi.io/v2/nfts/items/${item.address}`);
              return {
                ...item,
                image: itemDetailsResponse.data.content.image,
              };
            } catch (error) {
              console.error(`Error fetching details for SBT ${item.address}:`, error);
              return { ...item, image: null };
            }
          })
        );

        setSbtItems(sbtItemsWithImage);
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    const fetchPriceChartData = async () => {
      try {
        const endDate = Math.floor(Date.now() / 1000);
        const startDate = endDate - (30 * 24 * 60 * 60); // 30 days ago
        const pointsCount = 200;
        const apiUrl = `https://tonapi.io/v2/rates/chart?token=${TOKEN_ADDRESS}&currency=usd&start_date=${startDate}&end_date=${endDate}&points_count=${pointsCount}`;
        const response = await axios.get(apiUrl);
        const prices = response.data.points;
        const labels = prices.map((point: [number, number]) => new Date(point[0] * 1000).toLocaleDateString());
        const priceValues = prices.map((point: [number, number]) => point[1]);
        setPriceChartData({ labels, prices: priceValues });
      } catch (error) {
        console.error('Error fetching price chart data:', error);
      }
    };

    fetchData();
    fetchPriceChartData();
    const interval = setInterval(fetchData, FETCH_COOLDOWN);
    const priceChartInterval = setInterval(fetchPriceChartData, 3600000); // Update price chart every hour

    return () => {
      clearInterval(interval);
      clearInterval(priceChartInterval);
    };
  }, [lastFetchTime, rates]);

  return { tokenData, rates, previousRates, transactions, sbtItems, priceChartData };
};