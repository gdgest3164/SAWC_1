import { Link } from 'react-router';
import { useState } from 'react';
import { useKiosk } from '~/contexts/KioskContext';

export default function KioskMainPage() {
  const { state } = useKiosk();
  const { buildings, connections, isLoading } = state;
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const hasConnections = connections.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            시립서대문농아인복지관
          </h1>
          <p className="text-xl text-gray-600">
            층별 안내 시스템
          </p>
        </div>

        {/* 건물 선택 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {buildings.map((building) => (
            <div
              key={building.id}
              className={`relative bg-white rounded-3xl shadow-2xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 border-4 ${
                selectedBuilding === building.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-transparent hover:border-blue-300'
              }`}
              onClick={() => setSelectedBuilding(building.id)}
            >
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {building.name.charAt(0)}
                  </span>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {building.name}
                </h2>
                
                {building.description && (
                  <p className="text-lg text-gray-600 mb-6">
                    {building.description}
                  </p>
                )}

                {/* 층 개수 표시 */}
                <div className="bg-blue-100 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 font-medium">
                    🏢 {building.floors?.length || 0}개 층
                  </p>
                </div>

                {/* 연결 표시 */}
                {connections.some(conn => 
                  conn.building1_id === building.id || conn.building2_id === building.id
                ) && (
                  <div className="bg-green-100 rounded-lg p-4">
                    <p className="text-green-800 font-medium">
                      🔗 다른 건물과 연결됨
                    </p>
                  </div>
                )}
              </div>

              {/* 선택된 건물 표시 */}
              {selectedBuilding === building.id && (
                <div className="absolute -top-2 -right-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">✓</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 연결통로 표시 */}
        {hasConnections && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              건물 간 연결통로
            </h3>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-center space-x-8">
                {connections.map((connection, index) => (
                  <div key={connection.id} className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                        <span className="text-white font-bold">A</span>
                      </div>
                      <p className="font-medium text-sm">건물 A</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-1 bg-green-500 mb-1"></div>
                      <span className="text-xs text-green-600 font-medium">
                        {connection.name}
                      </span>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center mb-2">
                        <span className="text-white font-bold">B</span>
                      </div>
                      <p className="font-medium text-sm">건물 B</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 진행 버튼 */}
        {selectedBuilding && (
          <div className="text-center">
            <Link
              to={`/kiosk/building/${selectedBuilding}`}
              className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-2xl font-bold px-12 py-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl"
            >
              층별 안내 보기 →
            </Link>
          </div>
        )}

        {/* 관리자 링크 */}
        <div className="fixed bottom-4 right-4">
          <Link
            to="/admin"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900 transition-colors"
          >
            관리자
          </Link>
        </div>
      </div>
    </div>
  );
}