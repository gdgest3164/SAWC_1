import { Link, useParams } from 'react-router';
import { useState } from 'react';
import { useKiosk } from '~/contexts/KioskContext';

export default function BuildingFloorsPage() {
  const { buildingId } = useParams();
  const { getBuilding } = useKiosk();
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);

  if (!buildingId) {
    throw new Response('Building ID is required', { status: 400 });
  }

  const building = getBuilding(buildingId);

  if (!building) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">건물을 찾을 수 없습니다</h1>
          <Link to="/kiosk" className="text-blue-600 hover:text-blue-800">
            ← 메인으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const sortedFloors = [...building.floors].sort((a, b) => b.floor_number - a.floor_number);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <Link
            to="/kiosk"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 text-lg font-medium"
          >
            ← 건물 선택으로 돌아가기
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {building.name}
          </h1>
          <p className="text-xl text-gray-600">
            층을 선택해주세요
          </p>
        </div>

        {/* 층별 네비게이션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          {sortedFloors.map((floor) => (
            <div
              key={floor.id}
              className={`bg-white rounded-2xl shadow-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 border-4 ${
                selectedFloor === floor.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-transparent hover:border-indigo-300'
              }`}
              onClick={() => setSelectedFloor(floor.id)}
            >
              <div className="text-center">
                {/* 층 번호 */}
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {floor.floor_number}F
                  </span>
                </div>
                
                {/* 층 이름 */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {floor.name}
                </h3>
                
                {/* 층 설명 */}
                {floor.description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {floor.description}
                  </p>
                )}

                {/* 방 개수 */}
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="text-gray-700 font-medium">
                    📍 {floor.rooms.length}개의 공간
                  </p>
                </div>

                {/* 방 미리보기 */}
                {floor.rooms.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs text-gray-500 space-y-1">
                      {floor.rooms.slice(0, 3).map((room) => (
                        <div key={room.id} className="truncate">
                          • {room.name}
                        </div>
                      ))}
                      {floor.rooms.length > 3 && (
                        <div className="text-indigo-600 font-medium">
                          외 {floor.rooms.length - 3}개 더...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 선택된 층 표시 */}
              {selectedFloor === floor.id && (
                <div className="absolute -top-2 -right-2">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">✓</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 층이 없는 경우 */}
        {sortedFloors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-4xl text-gray-400">🏢</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              등록된 층이 없습니다
            </h3>
            <p className="text-gray-500">
              관리자에게 문의하여 층 정보를 등록해주세요.
            </p>
          </div>
        )}

        {/* 진행 버튼 */}
        {selectedFloor && (
          <div className="text-center">
            <Link
              to={`/kiosk/floor/${selectedFloor}`}
              className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-2xl font-bold px-12 py-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl"
            >
              이 층 둘러보기 →
            </Link>
          </div>
        )}

        {/* 건물 전체 평면도 버튼 */}
        <div className="text-center mt-8">
          <button className="bg-white text-indigo-600 border-2 border-indigo-600 text-lg font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-indigo-50 transition-colors">
            📍 건물 전체 평면도 보기
          </button>
        </div>
      </div>
    </div>
  );
}