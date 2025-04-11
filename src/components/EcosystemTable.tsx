import React from 'react';
import { useTokenBalances } from '../hooks/useTokenBalances';

const EcosystemTable: React.FC = () => {
  const { balances } = useTokenBalances();

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-[#F2C94C]/20">
          <tr>
            <th className="px-3 py-3 text-left text-[#F2C94C] text-sm md:text-base">Purpose</th>
            <th className="px-3 py-3 text-left text-[#F2C94C] text-sm md:text-base">Address</th>
            <th className="px-3 py-3 text-left text-[#F2C94C] text-sm md:text-base">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F2C94C]/20">
          {balances.map((wallet, index) => (
            <tr key={index} className="hover:bg-[#F2C94C]/5">
              <td className="px-3 py-4 text-sm md:text-base whitespace-nowrap">{wallet.purpose}</td>
              <td className="px-3 py-4 text-sm md:text-base">
                <a
                  href={`https://tonviewer.com/${wallet.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F2C94C] hover:underline"
                  title={wallet.address}
                >
                  {`${wallet.address.slice(0, 4)}...${wallet.address.slice(-4)}`}
                </a>
              </td>
              <td className="px-3 py-4 text-sm md:text-base">
                {(Number(BigInt(wallet.balance)) / 1e9).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} ETN
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EcosystemTable;
