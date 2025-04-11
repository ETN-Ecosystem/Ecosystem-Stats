import React from 'react';
import { TokenRates } from '../types';

interface RatesDisplayProps {
  rates: TokenRates;
  previousRates: TokenRates;
}

const RatesDisplay: React.FC<RatesDisplayProps> = ({ rates, previousRates }) => {
  const getPriceChangeClass = (current: number, previous: number) => {
    const change = current - previous;
    if (change > 0) return 'animate-priceUp';
    if (change < 0) return 'animate-priceDown';
    return '';
  };

  const rateCards = [
    {
      title: 'USD Price',
      current: rates.USD,
      previous: previousRates.USD,
      symbol: '$',
      decimals: 6
    },
    {
      title: 'TON Price',
      current: rates.TON,
      previous: previousRates.TON,
      symbol: '',
      suffix: 'TON',
      decimals: 6
    },
    {
      title: 'ETB Price',
      current: rates.ETB,
      previous: previousRates.ETB,
      symbol: '',
      suffix: 'ETB',
      decimals: 2
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-[1000px] mx-auto">
      {rateCards.map((card, index) => (
        <div 
          key={index}
          className="bg-gradient-to-br from-[#F2C94C] to-[#d4ae38] p-4 rounded-lg text-center text-[#133A2A]"
        >
          <h3 className="font-semibold">{card.title}</h3>
          <p className={getPriceChangeClass(card.current, card.previous)}>
            {card.symbol}{card.current.toFixed(card.decimals)} {card.suffix}
          </p>
          <p className="text-sm mt-1 opacity-90">
            1 ETN = {card.symbol}{card.current.toFixed(card.decimals)} {card.suffix}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RatesDisplay;