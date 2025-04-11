// src/components/SBTCollections.tsx
import React from 'react';
import { useTokenData } from '../hooks/useTokenData';
import SBTTable from './SBTTable';

function SBTCollections() {
  const { sbtItems } = useTokenData();

  const etnOgPassItems = sbtItems.filter(item => item.type === 'ETN OG Pass');
  const ahadBadgeItems = sbtItems.filter(item => item.type === '፩ Ahad Badge');

  return (
    <div>
      <div>
        <h3>ETN OG Pass</h3>
        <SBTTable items={etnOgPassItems} />
      </div>
      <div>
        <h3>፩ Ahad Badge</h3>
        <SBTTable items={ahadBadgeItems} />
      </div>
    </div>
  );
}

export default SBTCollections;