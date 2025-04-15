import React, { useEffect, useState } from 'react'

import { Player } from '../utils/player'
import { rankEnum, tierEnum } from '../utils/rank'

interface PlayerInputFormProps {
  onAddPlayer: (name: string, tier: tierEnum, rank: rankEnum) => void
  editingPlayer?: Player | null // 編集中のプレイヤー
}

const PlayerInputForm: React.FC<PlayerInputFormProps> = ({
  onAddPlayer,
  editingPlayer,
}) => {
  const [name, setName] = useState('')
  const [tier, setTier] = useState<tierEnum>(tierEnum.gold)
  const [rank, setRank] = useState<rankEnum>(rankEnum.two)

  useEffect(() => {
    if (editingPlayer) {
      // 編集中のプレイヤー情報をフォームに反映
      setName(editingPlayer.name)
      setTier(editingPlayer.tier)
      setRank(editingPlayer.rank)
    } else {
      // 編集モード解除時にフォームをリセット
      setName('')
      setTier(tierEnum.gold)
      setRank(rankEnum.two)
    }
  }, [editingPlayer])

  const handleAddPlayer = () => {
    if (name.trim()) {
      onAddPlayer(name, tier, rank)
      setName('')
      setTier(tierEnum.gold) // デフォルト値にリセット
      setRank(rankEnum.two) // デフォルト値にリセット
    } else {
      alert('Riot ID、ティア、ランクを入力してください')
    }
  }

  const isRankDisabled = [
    tierEnum.master,
    tierEnum.grandmaster,
    tierEnum.challenger,
  ].includes(tier)

  return (
    <div className="mb-4 flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Riot ID"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full bg-gray-100 cursor-default"
          disabled={!!editingPlayer}
        />
      </div>
      <div className="flex items-center space-x-2">
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value as tierEnum)}
          className="p-2 border border-gray-300 rounded w-full"
        >
          {Object.values(tierEnum).map((tierValue) => (
            <option key={tierValue} value={tierValue}>
              {tierValue}
            </option>
          ))}
        </select>
        <select
          value={rank}
          onChange={(e) => setRank(e.target.value as rankEnum)}
          className={`p-2 border rounded w-full ${
            isRankDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'border-gray-300'
          }`}
          disabled={isRankDisabled}
        >
          {Object.values(rankEnum).map((rankValue) => (
            <option key={rankValue} value={rankValue}>
              {rankValue}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleAddPlayer}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition whitespace-nowrap"
      >
        {editingPlayer ? '更新' : '追加'}
      </button>
    </div>
  )
}

export default PlayerInputForm
