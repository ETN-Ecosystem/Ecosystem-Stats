import React from 'react';
import { TokenData } from '../types';

interface CirculatingSupplyProps {
  tokenData: TokenData;
  ecosystemBalance: string;
}

const CirculatingSupply: React.FC<CirculatingSupplyProps> = ({ tokenData, ecosystemBalance }) => {
  const totalSupply = Number(tokenData.total_supply) / 1e9;
  const ecosystemTotal = Number(ecosystemBalance) / 1e9;
  const circulatingSupply = totalSupply - ecosystemTotal;
  const percentage = ((circulatingSupply / totalSupply) * 100).toFixed(2);

  return (
    <div className="bg-gradient-to-br from-[#F2C94C] to-[#d4ae38] p-4 rounded-lg text-center text-[#133A2A] w-full max-w-[1000px] mx-auto mb-8">
      <h3 className="font-semibold">Circulating Supply</h3>
      <p className="text-lg mt-1">
        {circulatingSupply.toLocaleString(undefined, {
          maximumFractionDigits: 0
        })} ETN ({percentage}%)
      </p>
    </div>
  );
};

export default CirculatingSupply;