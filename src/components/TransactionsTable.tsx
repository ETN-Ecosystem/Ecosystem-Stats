import React from 'react';
import { Transaction } from '../types';

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions }) => {
  return (
    <div className="w-full overflow-x-auto mb-20">
      <table className="min-w-full">
        <thead className="bg-[#F2C94C]/20">
          <tr>
            <th className="px-3 py-3 text-left text-[#F2C94C] text-sm md:text-base">Hash</th>
            <th className="px-3 py-3 text-left text-[#F2C94C] text-sm md:text-base">Type</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F2C94C]/20">
          {transactions.map((tx, index) => {
            const hash = tx.hash || tx.event_id || '';
            
            return (
              <tr key={index} className="hover:bg-[#F2C94C]/5">
                <td className="px-3 py-4 text-sm md:text-base">
                  <a
                    href={`https://tonviewer.com/transaction/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F2C94C] hover:underline"
                  >
                    {`${hash.slice(0, 4)}...${hash.slice(-4)}`}
                  </a>
                </td>
                <td className="px-3 py-4 text-sm md:text-base">
                  {tx.in_msg?.op_name || tx.event_type || 'Transfer'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;