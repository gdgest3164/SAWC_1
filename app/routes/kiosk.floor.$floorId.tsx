import { Link, useParams } from 'react-router';
import { useState } from 'react';
import { useKiosk } from '~/contexts/KioskContext';
import type { Room } from '~/types';

export default function FloorRoomsPage() {
  const { floorId } = useParams();
  const { getFloor, state } = useKiosk();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  if (!floorId) {
    throw new Response('Floor ID is required', { status: 400 });
  }

  const floor = getFloor(floorId);

  if (!floor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">층을 찾을 수 없습니다</h1>
          <Link to="/kiosk" className="text-purple-600 hover:text-purple-800">
            ← 메인으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // 현재 층이 속한 건물 찾기
  const building = state.buildings.find(b => 
    b.floors.some(f => f.id === floorId)
  );

  if (!building) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">건물 정보를 찾을 수 없습니다</h1>
          <Link to="/kiosk" className="text-purple-600 hover:text-purple-800">
            ← 메인으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* 상단 네비게이션 */}
      <div className="bg-white shadow-sm p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to={`/kiosk/building/${building.id}`}
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              ← {building.name}
            </Link>
            <span className="text-gray-400">|</span>
            <h1 className="text-2xl font-bold text-gray-900">
              {floor.floor_number}층 - {floor.name}
            </h1>
          </div>
          <Link
            to="/kiosk"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            처음으로
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* 층 설명 */}
        {floor.description && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">이 층 안내</h2>
            <p className="text-gray-600">{floor.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 방 목록 */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              공간 목록 ({floor.rooms.length}개)
            </h2>
            
            {floor.rooms.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-3xl text-gray-400">📍</span>
                </div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">
                  등록된 공간이 없습니다
                </h3>
                <p className="text-gray-500">
                  이 층에는 아직 등록된 공간 정보가 없습니다.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {floor.rooms.map((room) => (
                  <div
                    key={room.id}
                    className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 border-4 ${
                      selectedRoom?.id === room.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-transparent hover:border-purple-300'
                    }`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    {/* 방 이미지 */}
                    <div className="w-full h-40 mb-4 bg-gray-200 rounded-xl overflow-hidden">
                      {room.image_url ? (
                        <img
                          src={room.image_url}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl text-gray-400">🏢</span>
                        </div>
                      )}
                    </div>

                    {/* 방 정보 */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {room.name}
                    </h3>
                    
                    {room.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {room.description}
                      </p>
                    )}

                    {/* 선택된 방 표시 */}
                    {selectedRoom?.id === room.id && (
                      <div className="absolute -top-2 -right-2">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xl">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 선택된 방 상세 정보 */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {selectedRoom ? (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {selectedRoom.name}
                  </h3>

                  {/* 큰 이미지 */}
                  <div className="w-full h-64 mb-6 bg-gray-200 rounded-xl overflow-hidden">
                    {selectedRoom.image_url ? (
                      <img
                        src={selectedRoom.image_url}
                        alt={selectedRoom.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl text-gray-400">🏢</span>
                      </div>
                    )}
                  </div>

                  {/* 상세 설명 */}
                  {selectedRoom.description && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-2">상세 안내</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedRoom.description}
                      </p>
                    </div>
                  )}

                  {/* 위치 정보 */}
                  {(selectedRoom.position_x !== null && selectedRoom.position_y !== null) && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-2">위치</h4>
                      <p className="text-gray-600">
                        좌표: ({selectedRoom.position_x}, {selectedRoom.position_y})
                      </p>
                    </div>
                  )}

                  {/* 액션 버튼들 */}
                  <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all">
                      📍 길찾기
                    </button>
                    <button className="w-full bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all">
                      📞 문의하기
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-gray-400">👆</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-600 mb-2">
                    공간을 선택해주세요
                  </h3>
                  <p className="text-gray-500 text-sm">
                    왼쪽에서 보고 싶은 공간을 터치하세요
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 하단 네비게이션 */}
        <div className="mt-12 flex justify-center space-x-4">
          <Link
            to={`/kiosk/building/${building.id}`}
            className="bg-white text-purple-600 border-2 border-purple-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-purple-50 transition-colors"
          >
            다른 층 보기
          </Link>
          <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all">
            이 층 평면도 보기
          </button>
        </div>
      </div>
    </div>
  );
}