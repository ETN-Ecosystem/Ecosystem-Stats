// src/components/SBTTable.tsx
import React, { useState } from 'react';
import { SBTItem } from '../types';

interface SBTTableProps {
  items: SBTItem[];
}

const SBTTable: React.FC<SBTTableProps> = ({ items }) => {
  const [showFullList, setShowFullList] = useState(false);
  const initialDisplayCount = 5; // Example: Show the first 5 owners initially
  const totals = items.reduce((acc: Record<string, number>, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  const displayedItems = showFullList ? items : items.slice(0, initialDisplayCount);

  return (
    <div className="w-full">
      <table className="min-w-full">
        <thead className="bg-[#F2C94C]/20">
          <tr>
            <th className="px-3 py-3 text-left text-[#F2C94C] text-sm md:text-base">Owner</th>
            <th className="px-3 py-3 text-left text-[#F2C94C] text-sm md:text-base">Type</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F2C94C]/20">
          {displayedItems.map((item, index) => {
            const owner = item.owner?.address || 'No owner';
            const shortAddress = `${owner.slice(0, 4)}...${owner.slice(-4)}`;

            return (
              <tr key={index} className="hover:bg-[#F2C94C]/5">
                <td className="px-3 py-4 text-sm md:text-base">
                  <a
                    href={`https://tonviewer.com/${owner}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F2C94C] hover:underline"
                    title={owner}
                  >
                    {shortAddress}
                  </a>
                </td>
                <td className="px-3 py-4 text-sm md:text-base">{item.type}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} className="px-3 py-4 text-left text-sm md:text-base">
              <p>Total Minted ETN OG Pass: {totals['ETN OG Pass'] || 0}</p>
              <p>Total Minted ፩ Ahad Badge: {totals['፩ Ahad Badge'] || 0}</p>
              {items.length > initialDisplayCount && !showFullList && (
                <button onClick={() => setShowFullList(true)} className="text-[#F2C94C] hover:underline">
                  Show More
                </button>
              )}
              {showFullList && (
                <button onClick={() => setShowFullList(false)} className="text-[#F2C94C] hover:underline">
                  Show Less
                </button>
              )}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default SBTTable;