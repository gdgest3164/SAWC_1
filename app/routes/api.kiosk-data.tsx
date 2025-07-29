import { type LoaderFunctionArgs } from 'react-router';
import { getBuildings, getFloors, getRooms, getConnections, initDatabase } from '~/lib/db';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    await initDatabase();
    
    // 모든 데이터를 병렬로 가져오기
    const [buildings, connections] = await Promise.all([
      getBuildings(),
      getConnections(),
    ]);

    // 각 건물의 층과 방 데이터를 병렬로 가져오기
    const buildingsWithData = await Promise.all(
      buildings.map(async (building) => {
        const floors = await getFloors(building.id);
        
        // 각 층의 방 데이터를 병렬로 가져오기
        const floorsWithRooms = await Promise.all(
          floors.map(async (floor) => {
            const rooms = await getRooms(floor.id);
            return { ...floor, rooms };
          })
        );
        
        return { ...building, floors: floorsWithRooms };
      })
    );

    // 캐시 헤더 설정 (1분간 캐시)
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60, s-maxage=300');
    headers.set('Content-Type', 'application/json');

    return Response.json(
      { 
        buildings: buildingsWithData, 
        connections,
        timestamp: Date.now(),
      },
      { 
        headers,
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error loading kiosk data:', error);
    return Response.json(
      { 
        error: 'Failed to load data',
        buildings: [],
        connections: [],
        timestamp: Date.now(),
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}