import React, { useState } from 'react'

import { getTeamData, setTeamData } from '../composable/api'
import { TeamDivider } from '../utils/teamDivider'

interface ServerIdFormProps {
  teamDivider: TeamDivider
  onPlayersUpdate: () => void
}

const ServerIdForm: React.FC<ServerIdFormProps> = ({
  teamDivider,
  onPlayersUpdate,
}) => {
  const [serverId, setServerId] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleFetchTeamData = async () => {
    if (!serverId.trim()) return

    setIsLoading(true)
    try {
      const teamData = await getTeamData(serverId)
      if (teamData) {
        teamDivider.setPlayersFromPlayersJson(teamData)
        onPlayersUpdate()
      } else {
        alert('チームデータが見つかりませんでした。')
      }
    } catch (error) {
      console.error('Error fetching team data:', error)
      alert('チームデータの取得に失敗しました。')
    } finally {
      setTimeout(() => setIsLoading(false), 2000) // API処理時間 + 2秒
    }
  }

  const handleSaveTeamData = async () => {
    if (!serverId.trim()) return

    setIsLoading(true)
    try {
      const playersInfo = teamDivider.playersInfo
      await setTeamData(serverId, playersInfo)
      alert('チームデータを保存しました。')
    } catch (error) {
      console.error('Error saving team data:', error)
      alert('チームデータの保存に失敗しました。')
    } finally {
      setTimeout(() => setIsLoading(false), 2000) // API処理時間 + 2秒
    }
  }

  return (
    <div className="flex items-center space-x-4 mb-4">
      {/* サーバーID入力 */}
      <input
        type="text"
        placeholder="サーバーIDを入力"
        value={serverId}
        onChange={(e) => setServerId(e.target.value)}
        className="p-2 border rounded w-96"
      />

      {/* 呼び出しボタン */}
      <button
        onClick={handleFetchTeamData}
        disabled={!serverId.trim() || isLoading}
        className={`px-4 py-2 rounded ${
          !serverId.trim() || isLoading
            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600 transition'
        }`}
      >
        {isLoading ? '読み込み中...' : '呼び出し'}
      </button>

      {/* 保存ボタン */}
      <button
        onClick={handleSaveTeamData}
        disabled={!serverId.trim() || isLoading}
        className={`px-4 py-2 rounded ${
          !serverId.trim() || isLoading
            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
            : 'bg-green-500 text-white hover:bg-green-600 transition'
        }`}
      >
        {isLoading ? '保存中...' : '保存'}
      </button>
    </div>
  )
}

export default ServerIdForm
