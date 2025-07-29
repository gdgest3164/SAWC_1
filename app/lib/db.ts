import { sql } from '@vercel/postgres';
import type { Building, Floor, Room, Connection } from '~/types';
import {
  useMockDatabase,
  mockInitDatabase,
  mockGetBuildings,
  mockGetFloors,
  mockGetRooms,
  mockGetConnections,
  mockCreateBuilding,
  mockCreateFloor,
  mockCreateRoom,
  mockUpdateRoom,
  mockDeleteRoom,
  mockDeleteFloor,
  mockSeedDatabase,
} from './mock-db';

export async function initDatabase() {
  if (useMockDatabase()) {
    return mockInitDatabase();
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS buildings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS floors (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
        floor_number INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(building_id, floor_number)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS rooms (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        floor_id UUID REFERENCES floors(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT,
        position_x INTEGER,
        position_y INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS connections (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        building1_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
        building2_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
        floor1_id UUID REFERENCES floors(id) ON DELETE CASCADE,
        floor2_id UUID REFERENCES floors(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export async function getBuildings(): Promise<Building[]> {
  if (useMockDatabase()) {
    return mockGetBuildings();
  }
  const { rows } = await sql`SELECT * FROM buildings ORDER BY name`;
  return rows as Building[];
}

export async function getFloors(buildingId: string): Promise<Floor[]> {
  if (useMockDatabase()) {
    return mockGetFloors(buildingId);
  }
  const { rows } = await sql`
    SELECT * FROM floors 
    WHERE building_id = ${buildingId} 
    ORDER BY floor_number
  `;
  return rows as Floor[];
}

export async function getRooms(floorId: string): Promise<Room[]> {
  if (useMockDatabase()) {
    return mockGetRooms(floorId);
  }
  const { rows } = await sql`
    SELECT * FROM rooms 
    WHERE floor_id = ${floorId} 
    ORDER BY name
  `;
  return rows as Room[];
}

export async function getConnections(): Promise<Connection[]> {
  if (useMockDatabase()) {
    return mockGetConnections();
  }
  const { rows } = await sql`
    SELECT c.*, 
           b1.name as building1_name, 
           b2.name as building2_name,
           f1.name as floor1_name,
           f2.name as floor2_name
    FROM connections c
    JOIN buildings b1 ON c.building1_id = b1.id
    JOIN buildings b2 ON c.building2_id = b2.id
    JOIN floors f1 ON c.floor1_id = f1.id
    JOIN floors f2 ON c.floor2_id = f2.id
    WHERE c.is_active = true
  `;
  return rows as Connection[];
}

export async function createBuilding(name: string, description?: string): Promise<Building> {
  if (useMockDatabase()) {
    return mockCreateBuilding(name, description);
  }
  const { rows } = await sql`
    INSERT INTO buildings (name, description)
    VALUES (${name}, ${description || null})
    RETURNING *
  `;
  return rows[0] as Building;
}

export async function createFloor(buildingId: string, floorNumber: number, name: string, description?: string): Promise<Floor> {
  if (useMockDatabase()) {
    return mockCreateFloor(buildingId, floorNumber, name, description);
  }
  const { rows } = await sql`
    INSERT INTO floors (building_id, floor_number, name, description)
    VALUES (${buildingId}, ${floorNumber}, ${name}, ${description || null})
    RETURNING *
  `;
  return rows[0] as Floor;
}

export async function createRoom(floorId: string, name: string, description?: string, imageUrl?: string, positionX?: number, positionY?: number): Promise<Room> {
  if (useMockDatabase()) {
    return mockCreateRoom(floorId, name, description, imageUrl, positionX, positionY);
  }
  const { rows } = await sql`
    INSERT INTO rooms (floor_id, name, description, image_url, position_x, position_y)
    VALUES (${floorId}, ${name}, ${description || null}, ${imageUrl || null}, ${positionX || null}, ${positionY || null})
    RETURNING *
  `;
  return rows[0] as Room;
}

export async function updateRoom(roomId: string, updates: Partial<Room>): Promise<Room> {
  if (useMockDatabase()) {
    return mockUpdateRoom(roomId, updates);
  }
  
  const updateFields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && key !== 'id') {
      updateFields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  });

  if (updateFields.length === 0) {
    throw new Error('No valid updates provided');
  }

  const query = `
    UPDATE rooms 
    SET ${updateFields.join(', ')}, updated_at = NOW()
    WHERE id = $${paramIndex}
    RETURNING *
  `;
  
  const { rows } = await sql.query(query, [...values, roomId]);
  return rows[0] as Room;
}

export async function deleteRoom(roomId: string): Promise<void> {
  if (useMockDatabase()) {
    return mockDeleteRoom(roomId);
  }
  await sql`DELETE FROM rooms WHERE id = ${roomId}`;
}

export async function deleteFloor(floorId: string): Promise<void> {
  if (useMockDatabase()) {
    return mockDeleteFloor(floorId);
  }
  await sql`DELETE FROM floors WHERE id = ${floorId}`;
}