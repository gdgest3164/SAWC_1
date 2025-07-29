import { type LoaderFunctionArgs, type ActionFunctionArgs } from 'react-router';
import { Form, useLoaderData, useActionData } from 'react-router';
import { useState } from 'react';
import { getBuildings, getFloors, getRooms, createBuilding, createFloor, createRoom, deleteRoom, updateRoom, initDatabase } from '~/lib/db';
import { uploadImage, generateImageFilename, validateImageFile } from '~/lib/storage';
import { seedDatabase } from '~/lib/seed';
import type { Building, Floor, Room } from '~/types';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    await initDatabase();
    const buildings = await getBuildings();
    
    const buildingsWithFloorsAndRooms = await Promise.all(
      buildings.map(async (building) => {
        const floors = await getFloors(building.id);
        const floorsWithRooms = await Promise.all(
          floors.map(async (floor) => {
            const rooms = await getRooms(floor.id);
            return { ...floor, rooms };
          })
        );
        return { ...building, floors: floorsWithRooms };
      })
    );

    return Response.json({ buildings: buildingsWithFloorsAndRooms });
  } catch (error) {
    console.error('Error loading admin data:', error);
    return Response.json({ buildings: [], error: 'Failed to load data' });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get('action') as string;

  try {
    switch (action) {
      case 'createBuilding': {
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const building = await createBuilding(name, description);
        return Response.json({ success: true, building });
      }

      case 'createFloor': {
        const buildingId = formData.get('buildingId') as string;
        const floorNumber = parseInt(formData.get('floorNumber') as string);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const floor = await createFloor(buildingId, floorNumber, name, description);
        return Response.json({ success: true, floor });
      }

      case 'createRoom': {
        const floorId = formData.get('floorId') as string;
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const positionX = formData.get('positionX') ? parseInt(formData.get('positionX') as string) : undefined;
        const positionY = formData.get('positionY') ? parseInt(formData.get('positionY') as string) : undefined;
        
        let imageUrl: string | undefined;
        const imageFile = formData.get('image') as File;
        
        if (imageFile && imageFile.size > 0) {
          validateImageFile(imageFile);
          const filename = generateImageFilename(imageFile.name, `temp-${Date.now()}`);
          imageUrl = await uploadImage(imageFile, filename);
        }

        const room = await createRoom(floorId, name, description, imageUrl, positionX, positionY);
        return Response.json({ success: true, room });
      }

      case 'updateRoom': {
        const roomId = formData.get('roomId') as string;
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        
        const updates: Partial<Room> = {};
        if (name) updates.name = name;
        if (description) updates.description = description;
        
        const imageFile = formData.get('image') as File;
        if (imageFile && imageFile.size > 0) {
          validateImageFile(imageFile);
          const filename = generateImageFilename(imageFile.name, roomId);
          updates.image_url = await uploadImage(imageFile, filename);
        }

        const room = await updateRoom(roomId, updates);
        return Response.json({ success: true, room });
      }

      case 'deleteRoom': {
        const roomId = formData.get('roomId') as string;
        await deleteRoom(roomId);
        return Response.json({ success: true });
      }

      case 'seedDatabase': {
        const result = await seedDatabase();
        return Response.json({ success: true, message: '샘플 데이터가 성공적으로 생성되었습니다.' });
      }

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin action error:', error);
    return Response.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export default function AdminPage() {
  const { buildings } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedFloor, setSelectedFloor] = useState<string>('');
  const [showCreateBuilding, setShowCreateBuilding] = useState(false);
  const [showCreateFloor, setShowCreateFloor] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">키오스크 관리자</h1>
          <Form method="post" className="inline">
            <input type="hidden" name="action" value="seedDatabase" />
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
              onClick={(e) => {
                if (!confirm('샘플 데이터를 생성하시겠습니까? 기존 데이터가 있다면 중복될 수 있습니다.')) {
                  e.preventDefault();
                }
              }}
            >
              📊 샘플 데이터 생성
            </button>
          </Form>
        </div>

        {actionData?.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {actionData.error}
          </div>
        )}

        {actionData?.success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            작업이 성공적으로 완료되었습니다.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 건물 관리 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">건물 관리</h2>
              <button
                onClick={() => setShowCreateBuilding(!showCreateBuilding)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                건물 추가
              </button>
            </div>

            {showCreateBuilding && (
              <Form method="post" className="mb-4 p-4 bg-gray-50 rounded">
                <input type="hidden" name="action" value="createBuilding" />
                <div className="space-y-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="건물명"
                    required
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    name="description"
                    placeholder="설명"
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    생성
                  </button>
                </div>
              </Form>
            )}

            <div className="space-y-2">
              {buildings.map((building) => (
                <div
                  key={building.id}
                  className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                    selectedBuilding === building.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    setSelectedBuilding(building.id);
                    setSelectedFloor('');
                  }}
                >
                  <h3 className="font-medium">{building.name}</h3>
                  {building.description && (
                    <p className="text-sm text-gray-600">{building.description}</p>
                  )}
                  <p className="text-xs text-gray-500">{building.floors?.length || 0}개 층</p>
                </div>
              ))}
            </div>
          </div>

          {/* 층 관리 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">층 관리</h2>
              {selectedBuilding && (
                <button
                  onClick={() => setShowCreateFloor(!showCreateFloor)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  층 추가
                </button>
              )}
            </div>

            {showCreateFloor && selectedBuilding && (
              <Form method="post" className="mb-4 p-4 bg-gray-50 rounded">
                <input type="hidden" name="action" value="createFloor" />
                <input type="hidden" name="buildingId" value={selectedBuilding} />
                <div className="space-y-3">
                  <input
                    type="number"
                    name="floorNumber"
                    placeholder="층 번호"
                    required
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="층 이름"
                    required
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    name="description"
                    placeholder="설명"
                    className="w-full p-2 border rounded"
                    rows={2}
                  />
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    생성
                  </button>
                </div>
              </Form>
            )}

            {selectedBuilding && (
              <div className="space-y-2">
                {buildings
                  .find((b) => b.id === selectedBuilding)
                  ?.floors?.map((floor) => (
                    <div
                      key={floor.id}
                      className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                        selectedFloor === floor.id ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedFloor(floor.id)}
                    >
                      <h3 className="font-medium">{floor.floor_number}층 - {floor.name}</h3>
                      {floor.description && (
                        <p className="text-sm text-gray-600">{floor.description}</p>
                      )}
                      <p className="text-xs text-gray-500">{floor.rooms?.length || 0}개 방</p>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* 방 관리 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">방 관리</h2>
              {selectedFloor && (
                <button
                  onClick={() => setShowCreateRoom(!showCreateRoom)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  방 추가
                </button>
              )}
            </div>

            {showCreateRoom && selectedFloor && (
              <Form method="post" encType="multipart/form-data" className="mb-4 p-4 bg-gray-50 rounded">
                <input type="hidden" name="action" value="createRoom" />
                <input type="hidden" name="floorId" value={selectedFloor} />
                <div className="space-y-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="방 이름"
                    required
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    name="description"
                    placeholder="설명"
                    className="w-full p-2 border rounded"
                    rows={2}
                  />
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="w-full p-2 border rounded"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="positionX"
                      placeholder="X 좌표"
                      className="p-2 border rounded"
                    />
                    <input
                      type="number"
                      name="positionY"
                      placeholder="Y 좌표"
                      className="p-2 border rounded"
                    />
                  </div>
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    생성
                  </button>
                </div>
              </Form>
            )}

            {selectedFloor && (
              <div className="space-y-2">
                {buildings
                  .find((b) => b.id === selectedBuilding)
                  ?.floors?.find((f) => f.id === selectedFloor)
                  ?.rooms?.map((room) => (
                    <div key={room.id} className="p-3 border rounded hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium">{room.name}</h3>
                          {room.description && (
                            <p className="text-sm text-gray-600">{room.description}</p>
                          )}
                          {room.image_url && (
                            <img
                              src={room.image_url}
                              alt={room.name}
                              className="mt-2 w-16 h-16 object-cover rounded"
                            />
                          )}
                        </div>
                        <Form method="post" className="ml-2">
                          <input type="hidden" name="action" value="deleteRoom" />
                          <input type="hidden" name="roomId" value={room.id} />
                          <button
                            type="submit"
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                            onClick={(e) => {
                              if (!confirm('정말 삭제하시겠습니까?')) {
                                e.preventDefault();
                              }
                            }}
                          >
                            삭제
                          </button>
                        </Form>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}