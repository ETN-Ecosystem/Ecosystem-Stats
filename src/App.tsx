import React from 'react';
import TokenInfo from './components/TokenInfo';
import TokenStats from './components/TokenStats';
import RatesDisplay from './components/RatesDisplay';
import EcosystemTable from './components/EcosystemTable';
import TransactionsTable from './components/TransactionsTable';
import { useTokenData } from './hooks/useTokenData';
import { useTokenBalances } from './hooks/useTokenBalances';
import CirculatingSupply from './components/CirculatingSupply';
import PlatformStatus from './components/PlatformStatus';
import Heartbeat from './components/Heartbeat';

function App() {
  const { tokenData, rates, previousRates, transactions } = useTokenData();
  const { balances } = useTokenBalances();

  if (!tokenData) return null;

  const totalEcosystemBalance = balances.reduce((sum, wallet) => sum + Number(wallet.balance), 0).toString();

  return (
    <div className="min-h-screen bg-[#000] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex items-center justify-center gap-5 mb-8 flex-wrap">
          <img
            src="https://etn.ethio-tech.com/brand-assets/logos/coin_simple_white.png"
            alt="ETN Logo"
            className="w-12 h-12"
          />
          <h1 className="text-3xl font-bold text-[#F2C94C]">ETN Ecosystem Status</h1>
        </header>

        <div className="space-y-8">
          <TokenInfo tokenData={tokenData} />

          <RatesDisplay rates={rates} previousRates={previousRates} />

          <TokenStats
            tokenData={tokenData}
            price={rates.USD}
            etbPrice={rates.ETB}
          />
          <CirculatingSupply tokenData={tokenData} ecosystemBalance={totalEcosystemBalance} />

               <section>
            <h2 className="text-2xl font-bold text-[#F2C94C] mb-4">ETN Price Chart</h2>
            <iframe
             height="400px"
              width="100%"
              id="geckoterminal-embed"
              title="GeckoTerminal Embed"
              src="https://www.geckoterminal.com/ton/pools/EQBt7drPhWyQRIVnSkDzThhiVcq1lwPT371DYX-gGHzN9bwh?embed=1&info=0&swaps=0&grayscale=0&light_chart=0&chart_type=price&resolution=15m"
              frameBorder="0"
              allow="clipboard-write"
              allowFullScreen
              ></iframe>
              </section>



          <section>
            <h2 className="text-2xl font-bold text-[#F2C94C] mb-4">ETN Ecosystem Wallets</h2>
            <EcosystemTable balances={balances} />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#F2C94C] mb-4">Platform Development Status</h2>
            <PlatformStatus />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#F2C94C] mb-4">STON.fi DEX Transactions</h2>
            <TransactionsTable transactions={transactions} />
          </section>
        </div>

        <footer className="text-center py-6 mt-8 bg-[#F2C94C]/10">
          <div className="flex items-center justify-center gap-2">
            <span>ETN Ecosystem 2025 built on</span>
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
