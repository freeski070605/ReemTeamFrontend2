import  { Users, Shield, Loader2 } from 'lucide-react';
import { TableStake } from '../types';

interface TableStakeCardProps {
  table: TableStake;
  onJoin: () => void;
  userBalance: number;
  isLoading?: boolean;
}

export default function TableStakeCard({ table, onJoin, userBalance, isLoading = false }: TableStakeCardProps) {
  const getStakeColorClass = (amount: number): string => {
    switch (amount) {
      case 1: return 'bg-green-700 border-green-500';
      case 5: return 'bg-blue-700 border-blue-500';
      case 10: return 'bg-yellow-700 border-yellow-500';
      case 20: return 'bg-red-700 border-red-500';
      case 50: return 'bg-purple-700 border-purple-500';
      default: return 'bg-gray-700 border-gray-500';
    }
  };
  
  const getProgressWidth = (): string => {
    const percentage = (table.currentPlayers / table.maxPlayers) * 100;
    return `${percentage}%`;
  };
  
  const isFull = table.currentPlayers >= table.maxPlayers;
  const canAfford = userBalance >= table.amount;
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className={`border-b-2 ${getStakeColorClass(table.amount)} p-4`}>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold font-display">${table.amount} Stake</h3>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1 text-gray-400" />
            <span className="text-sm">
              {table.currentPlayers}/{table.maxPlayers}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Table Capacity</span>
            <span className="text-gray-300">{table.currentPlayers}/{table.maxPlayers} players</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getStakeColorClass(table.amount)}`} 
              style={{ width: getProgressWidth() }}
            ></div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Potential Winnings</span>
            <span className="text-gray-300">${table.amount * 4}</span>
          </div>
          <div className="text-xs text-gray-500">
            Special payouts: 50 is double, 41 on first turn is triple, 11 and under is triple
          </div>
        </div>
        
        <button
          onClick={onJoin}
          disabled={isFull || !canAfford || isLoading}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center ${
            isFull || !canAfford || isLoading
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              {isFull ? 'Table Full' : !canAfford ? 'Insufficient Balance' : 'Join Table'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
 