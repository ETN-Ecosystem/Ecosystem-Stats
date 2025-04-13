import React from 'react';
import { TokenData } from '../types';
import VerifiedBadge from './VerifiedBadge';

interface TokenInfoProps {
  tokenData: TokenData;
}

const TokenInfo: React.FC<TokenInfoProps> = ({ tokenData }) => {
  const isNotMintable = tokenData.admin?.address === "0:0000000000000000000000000000000000000000000000000000000000000000";

  if (!tokenData?.metadata) {
    return <div className="bg-[#F2C94C]/10 p-6 rounded-lg text-center w-full">Loading...</div>;
  }

  return (
    <div className="bg-[#F2C94C]/10 p-4 rounded-lg text-center w-full ">
      <div className="flex items-center justify-center gap-4">
        {tokenData.metadata.image && (
          <img 
            src={tokenData.metadata.image} 
            alt={tokenData.metadata.name || 'Token'} 
            className="w-10 h-10 rounded-full"
          />
        )}
        <h2 className="text-2xl font-bold text-[#F2C94C]">{tokenData.metadata.name}</h2>
        {tokenData.verification === "whitelist" && <VerifiedBadge />}
      </div>
      <p className="mt-2">Symbol: {tokenData.metadata.symbol}</p>
      <p>Decimals: {tokenData.metadata.decimals}</p>
      <p>Status: {isNotMintable ? 'Not Mintable (Contract Revoked)' : 'Mintable'}</p>
      <div className="flex gap-4 justify-center mt-4">
        {tokenData.metadata.websites?.[0] && (
          <a href={tokenData.metadata.websites[0]} target="_blank" rel="noopener noreferrer" className="text-[#F2C94C] hover:underline">
            Website
          </a>
        )}
        {tokenData.metadata.social?.[0] && (
          <a href={tokenData.metadata.social[0]} target="_blank" rel="noopener noreferrer" className="text-[#F2C94C] hover:underline">
            Whitepaper
          </a>
        )}
        {tokenData.metadata.social?.[1] && (
          <a href={tokenData.metadata.social[1]} target="_blank" rel="noopener noreferrer" className="text-[#F2C94C] hover:underline">
            Telegram
          </a>
        )}
        {tokenData.metadata.social?.[2] && (
          <a href={tokenData.metadata.social[2]} target="_blank" rel="noopener noreferrer" className="text-[#F2C94C] hover:underline">
            Twitter
          </a>
        )}
      </div>
    </div>
  );
};

export default TokenInfo;