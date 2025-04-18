import React, { useState } from 'react'

import { TeamBalancer } from '../utils/teamBalancer'

interface DividedTeamTableProps {
  teamBalancer: TeamBalancer
  onTeamsUpdate: () => void
}

const DividedTeamTable: React.FC<DividedTeamTableProps> = ({
  teamBalancer,
  onTeamsUpdate,
}) => {
  const balancedTeamsByMissMatch = teamBalancer.balancedTeamsByMissMatch
  const [activeTab, setActiveTab] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleTabChange = (tabIndex: number) => {
    setActiveTab(tabIndex)
  }

  const handleDivideTeams = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      teamBalancer.divideTeams()
      onTeamsUpdate()
    } catch (error) {
      alert(
        'チーム分けに失敗しました。プレイヤーが10人揃っているか確認してください。'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyToClipboard = () => {
    const activeBalancedTeam = balancedTeamsByMissMatch[activeTab]
    const lanes = ['TOP', 'JG', 'MID', 'ADC', 'SUP']
    const blueTeam = lanes
      .map(
        (lane, index) =>
          `${lane}: ${activeBalancedTeam.players[index].name || 'N/A'}`
      )
      .join('\n')
    const redTeam = lanes
      .map(
        (lane, index) =>
          `${lane}: ${activeBalancedTeam.players[index + 5].name || 'N/A'}`
      )
      .join('\n')

    const result = `Blue Team\n${blueTeam}\n\nRed Team\n${redTeam}`
    navigator.clipboard.writeText(result)
    alert('チーム結果をクリップボードにコピーしました！')
  }

  const activeBalancedTeam = balancedTeamsByMissMatch[activeTab]
  const isDivideButtonDisabled = teamBalancer.isDividable() === false

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-4 flex justify-center space-x-4">
        <button
          onClick={handleDivideTeams}
          disabled={isLoading || isDivideButtonDisabled}
          className={`px-4 py-2 rounded ${
            isLoading || isDivideButtonDisabled
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600 transition'
          }`}
        >
          {isLoading ? '分けています...' : 'チームを分ける'}
        </button>
        <button
          onClick={handleCopyToClipboard}
          disabled={activeBalancedTeam.players.length === 0}
          className={`px-4 py-2 rounded ${
            activeBalancedTeam.players.length === 0
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 transition'
          }`}
        >
          結果をコピー
        </button>
      </div>

      <div className="flex">
        <div className="flex flex-col space-y-2 mr-4">
          {Object.keys(balancedTeamsByMissMatch).map((key) => (
            <button
              key={key}
              onClick={() => handleTabChange(Number(key))}
              disabled={
                balancedTeamsByMissMatch[Number(key)].players.length === 0
              }
              className={`px-4 py-2 rounded ${
                Number(key) === activeTab
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              } ${
                balancedTeamsByMissMatch[Number(key)].players.length === 0
                  ? 'cursor-not-allowed opacity-50'
                  : ''
              }`}
            >
              {key}人ミスマッチ
            </button>
          ))}
        </div>

        <div className="flex-1 border border-gray-300 rounded-lg p-4">
          {activeBalancedTeam.players.length === 10 && (
            <div>
              <p>Rating Difference {activeBalancedTeam.evaluationScore}</p>
              <div className="flex">
                <div className="w-1/3">
                  <div className="mb-4 font-bold">Lane</div>
                  {['TOP', 'JG', 'MID', 'ADC', 'SUP'].map((lane) => (
                    <div key={lane} className="mb-2 font-medium">
                      {lane}
                    </div>
                  ))}
                </div>
                <div className="w-1/3">
                  <div className="mb-4 text-xl font-bold text-blue-500">
                    Blue Team
                  </div>
                  {['TOP', 'JG', 'MID', 'ADC', 'SUP'].map((lane, index) => (
                    <div key={lane} className="mb-2">
                      {activeBalancedTeam.players[index].name || 'N/A'} (
                      {activeBalancedTeam.players[index].rating})
                    </div>
                  ))}
                </div>
                <div className="w-1/3">
                  <div className="mb-4 text-xl font-bold text-red-500">
                    Red Team
                  </div>
                  {['TOP', 'JG', 'MID', 'ADC', 'SUP'].map((lane, index) => (
                    <div key={lane} className="mb-2">
                      {activeBalancedTeam.players[index + 5].name || 'N/A'} (
                      {activeBalancedTeam.players[index + 5].rating})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DividedTeamTable
