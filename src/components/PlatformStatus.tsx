import React from 'react';
import { 
  CircleDot, 
  Hammer, 
  PlayCircle, 
  Clock, 
  Search, 
  Play,
  type LucideIcon
} from 'lucide-react';

interface Platform {
  name: string;
  status: 'alpha' | 'developing' | 'running' | 'pending' | 'research' | 'started';
  icon: LucideIcon;
  color: string;
}

const platforms: Platform[] = [
  { name: 'ETN Ads', status: 'alpha', icon: CircleDot, color: 'text-purple-400' },
  { name: 'ETN Sell', status: 'developing', icon: Hammer, color: 'text-blue-400' },
  { name: 'ETN Learn', status: 'running', icon: PlayCircle, color: 'text-green-400' },
  { name: 'ETN Bio', status: 'pending', icon: Clock, color: 'text-yellow-400' },
  { name: 'ETN Council', status: 'pending', icon: Clock, color: 'text-yellow-400' },
  { name: 'ETN Home', status: 'pending', icon: Clock, color: 'text-yellow-400' },
  { name: 'ETN Join', status: 'pending', icon: Clock, color: 'text-yellow-400' },
  { name: 'ETN Equb', status: 'pending', icon: Clock, color: 'text-yellow-400' },
  { name: 'ETN Hosting', status: 'research', icon: Search, color: 'text-gray-400' },
  { name: 'ETN DNS', status: 'research', icon: Search, color: 'text-gray-400' },
  { name: 'ETN Pay', status: 'started', icon: Play, color: 'text-orange-400' }
];

const PlatformStatus: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {platforms.map((platform) => {
        const Icon = platform.icon;
        return (
          <div 
            key={platform.name}
            className="bg-[#F2C94C]/10 p-4 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Icon className={`h-5 w-5 ${platform.color}`} />
              <span>{platform.name}</span>
            </div>
            <span className={`capitalize ${platform.color}`}>
              {platform.status}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PlatformStatus;