import { initDatabase, createBuilding, createFloor, createRoom } from './db';
import { useMockDatabase, mockSeedDatabase } from './mock-db';

export async function seedDatabase() {
  try {
    if (useMockDatabase()) {
      return mockSeedDatabase();
    }
    
    await initDatabase();
    console.log('Database initialized');

    // 건물 생성
    const donghaeng = await createBuilding('동행관', '복지관의 메인 건물로 다양한 교육 및 상담 프로그램이 운영됩니다.');
    const sotong = await createBuilding('소통관', '갤러리와 전시 공간이 있는 문화 건물입니다.');
    
    console.log('Buildings created');

    // 동행관 층 생성
    const donghaeng1f = await createFloor(donghaeng.id, 1, '1층', '로비, 카페동행, 안내데스크가 있습니다.');
    const donghaeng2f = await createFloor(donghaeng.id, 2, '2층', '교육실과 회의실이 있습니다.');
    const donghaeng3f = await createFloor(donghaeng.id, 3, '3층', '상담실과 치료실이 있습니다.');
    const donghaeng4f = await createFloor(donghaeng.id, 4, '4층', '직업훈련실이 있습니다.');
    
    // 소통관 층 생성
    const sotong1f = await createFloor(sotong.id, 1, '1층', '입구와 안내 공간입니다.');
    const sotong2f = await createFloor(sotong.id, 2, '2층', '갤러리동행과 전시 공간입니다.');
    
    console.log('Floors created');

    // 동행관 1층 방 생성
    await createRoom(donghaeng1f.id, '로비', '복지관 메인 로비 공간입니다.');
    await createRoom(donghaeng1f.id, '카페동행', '따뜻한 음료와 간단한 식사를 제공하는 카페입니다.');
    await createRoom(donghaeng1f.id, '안내데스크', '방문자 접수 및 안내를 담당하는 데스크입니다.');
    
    // 동행관 2층 방 생성
    await createRoom(donghaeng2f.id, '교육실 A', '수화교육 및 언어치료 프로그램이 진행됩니다.');
    await createRoom(donghaeng2f.id, '교육실 B', '컴퓨터 교육 및 디지털 활용 교육이 진행됩니다.');
    await createRoom(donghaeng2f.id, '회의실', '직원 회의 및 소규모 모임 공간입니다.');
    
    // 동행관 3층 방 생성
    await createRoom(donghaeng3f.id, '개별상담실 1', '1:1 개별 상담이 진행되는 공간입니다.');
    await createRoom(donghaeng3f.id, '개별상담실 2', '가족상담 및 집단상담이 진행되는 공간입니다.');
    await createRoom(donghaeng3f.id, '치료실', '언어치료 및 재활치료가 진행되는 공간입니다.');
    
    // 동행관 4층 방 생성
    await createRoom(donghaeng4f.id, '제과제빵실', '제과제빵 기술을 배우는 직업훈련실입니다.');
    await createRoom(donghaeng4f.id, '공예실', '다양한 공예 활동이 진행되는 공간입니다.');
    await createRoom(donghaeng4f.id, '컴퓨터실', 'IT 관련 직업훈련이 진행되는 공간입니다.');
    
    // 소통관 1층 방 생성
    await createRoom(sotong1f.id, '입구홀', '소통관의 메인 입구 공간입니다.');
    await createRoom(sotong1f.id, '안내부스', '소통관 이용 안내를 제공하는 공간입니다.');
    
    // 소통관 2층 방 생성
    await createRoom(sotong2f.id, '갤러리동행', '농아인 작가들의 작품을 전시하는 갤러리입니다.');
    await createRoom(sotong2f.id, '전시실 A', '기획전시가 진행되는 공간입니다.');
    await createRoom(sotong2f.id, '전시실 B', '상설전시 및 체험전시 공간입니다.');
    
    console.log('Sample rooms created');
    console.log('Database seeding completed successfully');
    
    return {
      buildings: [donghaeng, sotong],
      message: 'Database seeded successfully'
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}