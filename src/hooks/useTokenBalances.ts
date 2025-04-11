import { useState, useEffect } from 'react';
import axios from 'axios';
import { ECOSYSTEM_WALLETS } from '../constants';

interface WalletBalance {
  purpose: string;
  address: string;
  balance: string;
}

export const useTokenBalances = () => {
  const [balances, setBalances] = useState<WalletBalance[]>([]);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const balancePromises = ECOSYSTEM_WALLETS.map(wallet =>
          axios.get(`https://tonapi.io/v2/accounts/${wallet.address}/jettons`)
        );

        const responses = await Promise.all(balancePromises);
        
        const updatedBalances = ECOSYSTEM_WALLETS.map((wallet, index) => ({
          ...wallet,
          balance: responses[index].data.balances[0]?.balance || '0'
        }));

        setBalances(updatedBalances);
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { balances };
};