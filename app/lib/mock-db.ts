import type { Building, Floor, Room, Connection } from '~/types';

// 메모리 기반 Mock 데이터베이스
let buildings: Building[] = [];
let floors: Floor[] = [];
let rooms: Room[] = [];
let connections: Connection[] = [];

// UUID 생성 헬퍼
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function useMockDatabase() {
  return process.env.NODE_ENV === 'development' && !process.env.POSTGRES_URL?.includes('postgres://');
}

export async function mockInitDatabase() {
  console.log('Using mock database for development');
  return Promise.resolve();
}

export async function mockGetBuildings(): Promise<Building[]> {
  return Promise.resolve(buildings);
}

export async function mockGetFloors(buildingId: string): Promise<Floor[]> {
  return Promise.resolve(floors.filter(f => f.building_id === buildingId));
}

export async function mockGetRooms(floorId: string): Promise<Room[]> {
  return Promise.resolve(rooms.filter(r => r.floor_id === floorId));
}

export async function mockGetConnections(): Promise<Connection[]> {
  return Promise.resolve(connections);
}

export async function mockCreateBuilding(name: string, description?: string): Promise<Building> {
  const building: Building = {
    id: generateId(),
    name,
    description: description || null,
    created_at: new Date(),
    updated_at: new Date(),
  };
  buildings.push(building);
  return Promise.resolve(building);
}

export async function mockCreateFloor(buildingId: string, floorNumber: number, name: string, description?: string): Promise<Floor> {
  const floor: Floor = {
    id: generateId(),
    building_id: buildingId,
    floor_number: floorNumber,
    name,
    description: description || null,
    created_at: new Date(),
    updated_at: new Date(),
  };
  floors.push(floor);
  return Promise.resolve(floor);
}

export async function mockCreateRoom(floorId: string, name: string, description?: string, imageUrl?: string, positionX?: number, positionY?: number): Promise<Room> {
  const room: Room = {
    id: generateId(),
    floor_id: floorId,
    name,
    description: description || null,
    image_url: imageUrl || null,
    position_x: positionX || null,
    position_y: positionY || null,
    created_at: new Date(),
    updated_at: new Date(),
  };
  rooms.push(room);
  return Promise.resolve(room);
}

export async function mockUpdateRoom(roomId: string, updates: Partial<Room>): Promise<Room> {
  const roomIndex = rooms.findIndex(r => r.id === roomId);
  if (roomIndex === -1) {
    throw new Error('Room not found');
  }
  
  rooms[roomIndex] = {
    ...rooms[roomIndex],
    ...updates,
    updated_at: new Date(),
  };
  
  return Promise.resolve(rooms[roomIndex]);
}

export async function mockDeleteRoom(roomId: string): Promise<void> {
  const roomIndex = rooms.findIndex(r => r.id === roomId);
  if (roomIndex !== -1) {
    rooms.splice(roomIndex, 1);
  }
  return Promise.resolve();
}

export async function mockDeleteFloor(floorId: string): Promise<void> {
  const floorIndex = floors.findIndex(f => f.id === floorId);
  if (floorIndex !== -1) {
    floors.splice(floorIndex, 1);
  }
  // 해당 층의 모든 방도 삭제
  rooms = rooms.filter(r => r.floor_id !== floorId);
  return Promise.resolve();
}

export async function mockSeedDatabase() {
  // 기존 데이터 초기화
  buildings = [];
  floors = [];
  rooms = [];
  connections = [];

  // 건물 생성
  const donghaeng = await mockCreateBuilding('동행관', '복지관의 메인 건물로 다양한 교육 및 상담 프로그램이 운영됩니다.');
  const sotong = await mockCreateBuilding('소통관', '갤러리와 전시 공간이 있는 문화 건물입니다.');
  
  // 동행관 층 생성
  const donghaeng1f = await mockCreateFloor(donghaeng.id, 1, '1층', '로비, 카페동행, 안내데스크가 있습니다.');
  const donghaeng2f = await mockCreateFloor(donghaeng.id, 2, '2층', '교육실과 회의실이 있습니다.');
  const donghaeng3f = await mockCreateFloor(donghaeng.id, 3, '3층', '상담실과 치료실이 있습니다.');
  const donghaeng4f = await mockCreateFloor(donghaeng.id, 4, '4층', '직업훈련실이 있습니다.');
  
  // 소통관 층 생성
  const sotong1f = await mockCreateFloor(sotong.id, 1, '1층', '입구와 안내 공간입니다.');
  const sotong2f = await mockCreateFloor(sotong.id, 2, '2층', '갤러리동행과 전시 공간입니다.');
  
  // 동행관 1층 방 생성
  await mockCreateRoom(donghaeng1f.id, '로비', '복지관 메인 로비 공간입니다.');
  await mockCreateRoom(donghaeng1f.id, '카페동행', '따뜻한 음료와 간단한 식사를 제공하는 카페입니다.');
  await mockCreateRoom(donghaeng1f.id, '안내데스크', '방문자 접수 및 안내를 담당하는 데스크입니다.');
  
  // 동행관 2층 방 생성
  await mockCreateRoom(donghaeng2f.id, '교육실 A', '수화교육 및 언어치료 프로그램이 진행됩니다.');
  await mockCreateRoom(donghaeng2f.id, '교육실 B', '컴퓨터 교육 및 디지털 활용 교육이 진행됩니다.');
  await mockCreateRoom(donghaeng2f.id, '회의실', '직원 회의 및 소규모 모임 공간입니다.');
  
  // 동행관 3층 방 생성
  await mockCreateRoom(donghaeng3f.id, '개별상담실 1', '1:1 개별 상담이 진행되는 공간입니다.');
  await mockCreateRoom(donghaeng3f.id, '개별상담실 2', '가족상담 및 집단상담이 진행되는 공간입니다.');
  await mockCreateRoom(donghaeng3f.id, '치료실', '언어치료 및 재활치료가 진행되는 공간입니다.');
  
  // 동행관 4층 방 생성
  await mockCreateRoom(donghaeng4f.id, '제과제빵실', '제과제빵 기술을 배우는 직업훈련실입니다.');
  await mockCreateRoom(donghaeng4f.id, '공예실', '다양한 공예 활동이 진행되는 공간입니다.');
  await mockCreateRoom(donghaeng4f.id, '컴퓨터실', 'IT 관련 직업훈련이 진행되는 공간입니다.');
  
  // 소통관 1층 방 생성
  await mockCreateRoom(sotong1f.id, '입구홀', '소통관의 메인 입구 공간입니다.');
  await mockCreateRoom(sotong1f.id, '안내부스', '소통관 이용 안내를 제공하는 공간입니다.');
  
  // 소통관 2층 방 생성
  await mockCreateRoom(sotong2f.id, '갤러리동행', '농아인 작가들의 작품을 전시하는 갤러리입니다.');
  await mockCreateRoom(sotong2f.id, '전시실 A', '기획전시가 진행되는 공간입니다.');
  await mockCreateRoom(sotong2f.id, '전시실 B', '상설전시 및 체험전시 공간입니다.');
  
  console.log('Mock database seeded successfully');
  
  return {
    buildings: [donghaeng, sotong],
    message: 'Mock database seeded successfully'
  };
}