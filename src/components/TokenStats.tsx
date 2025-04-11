import React from 'react';
import { TokenData } from '../types';

interface TokenStatsProps {
  tokenData: TokenData;
  price: number;
  etbPrice: number;
}

const TokenStats: React.FC<TokenStatsProps> = ({ tokenData, price, etbPrice }) => {
  const totalSupply = Number(tokenData.total_supply) / 1e9;
  const fdvEtb = etbPrice * totalSupply;

  const stats = [
    { title: 'Price', value: `$${price.toFixed(6)}` },
    { title: 'Total Supply', value: `${totalSupply.toLocaleString()} ETN` },
    { title: 'Holders', value: tokenData.holders_count.toLocaleString() },
    { 
      title: 'FDV (ETB)', 
      value: `${fdvEtb.toLocaleString(undefined, {maximumFractionDigits: 2})} ETB` 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-[1000px] mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-gradient-to-br from-[#F2C94C] to-[#d4ae38] p-4 rounded-lg text-center text-[#133A2A]"
        >
          <h3 className="font-semibold">{stat.title}</h3>
          <p className="text-lg mt-1">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default TokenStats;