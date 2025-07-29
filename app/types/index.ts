export interface Building {
  id: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Floor {
  id: string;
  building_id: string;
  floor_number: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Room {
  id: string;
  floor_id: string;
  name: string;
  description?: string;
  image_url?: string;
  position_x?: number;
  position_y?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Connection {
  id: string;
  building1_id: string;
  building2_id: string;
  floor1_id: string;
  floor2_id: string;
  name: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface KioskData {
  buildings: Building[];
  floors: Floor[];
  rooms: Room[];
  connections: Connection[];
}