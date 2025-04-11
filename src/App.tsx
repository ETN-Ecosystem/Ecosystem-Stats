import React from 'react';
import TokenInfo from './components/TokenInfo';
import TokenStats from './components/TokenStats';
import RatesDisplay from './components/RatesDisplay';
import EcosystemTable from './components/EcosystemTable';
import TransactionsTable from './components/TransactionsTable';
import { useTokenData } from './hooks/useTokenData';
import PriceChart from './components/PriceChart';
import SBTCollections from './components/SBTCollections';
import { useTokenBalances } from './hooks/useTokenBalances';

function App() {
  const { tokenData, rates, previousRates, transactions, sbtItems } = useTokenData();
  const { balances } = useTokenBalances();

  if (!tokenData) return null;

  return (
    <div className="min-h-screen bg-[#133A2A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex items-center justify-center gap-5 mb-8 flex-wrap">
          <img
            src="https://etn.ethio-tech.com/brand-assets/logos/coin_simple_white.png"
            alt="ETN Logo"
            className="w-12 h-12"
          />
          <h1 className="text-3xl font-bold text-[#F2C94C]">ETN Ecosystem Token Status</h1>
        </header>

        <div className="space-y-8">
          <TokenInfo tokenData={tokenData} />

          <RatesDisplay rates={rates} previousRates={previousRates} />

          <TokenStats
            tokenData={tokenData}
            price={rates.USD}
            etbPrice={rates.ETB}
          />

          <section>
            <h2 className="text-2xl font-bold text-[#F2C94C] mb-4">ETN Price Chart</h2>
            <PriceChart />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#F2C94C] mb-4">ETN Ecosystem Wallets</h2>
            <EcosystemTable balances={balances} />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#F2C94C] mb-4">STON.fi DEX Transactions</h2>
            <TransactionsTable transactions={transactions} />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#F2C94C] mb-4">ETN SBT Collection</h2>
            <SBTCollections />
          </section>
        </div>

        <footer className="text-center py-6 mt-8 bg-[#F2C94C]/10">
          <div className="flex items-center justify-center gap-2">
            <span>ETN Ecosystem 2024 built on</span>
            <img
              src="https://ton.org/icons/custom/ton_text_logo_dark.svg"
              alt="TON Logo"
              className="h-5"
            />
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;