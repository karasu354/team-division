import React from 'react'

import { Player } from '../utils/player'

interface PlayerCardProps {
  player: Player | null // プレイヤーがない場合も対応
  onToggleRole?: (roleIndex: number) => void
  onRemove?: () => void
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onToggleRole,
  onRemove,
}) => {
  return (
    <div className="p-2 border-b border-gray-300 flex items-center justify-between h-20">
      {player ? (
        <>
          <div className="flex-1">
            <p className="font-bold whitespace-nowrap">{player.getName()}</p>
            <p className="text-sm text-gray-500">
              レート: {player.getRating()}
            </p>
          </div>
          <div className="flex space-x-2">
            {['TOP', 'JG', 'MID', 'ADC', 'SUP'].map((role, roleIndex) => (
              <label key={role} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={player.getDesiredRole()[roleIndex] === 1}
                  onChange={() => onToggleRole?.(roleIndex)}
                />
                <span className="text-xs">{role}</span>
              </label>
            ))}
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center text-red-500 rounded-full hover:bg-red-500 hover:text-white hover:border-transparent transition"
            onClick={onRemove}
          >
            x
          </button>
        </>
      ) : (
        <div className="flex-1 text-center text-gray-400">No Player</div>
      )}
    </div>
  )
}

export default PlayerCard
