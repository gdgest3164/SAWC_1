import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Building, Floor, Room, Connection } from '~/types';

interface FloorWithRooms extends Floor {
  rooms: Room[];
}

interface BuildingWithFloors extends Building {
  floors: FloorWithRooms[];
}

interface KioskState {
  buildings: BuildingWithFloors[];
  connections: Connection[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;
}

type KioskAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: { buildings: BuildingWithFloors[]; connections: Connection[] } }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_BUILDING'; payload: BuildingWithFloors }
  | { type: 'DELETE_BUILDING'; payload: string }
  | { type: 'ADD_BUILDING'; payload: BuildingWithFloors };

const initialState: KioskState = {
  buildings: [],
  connections: [],
  isLoading: false,
  error: null,
  lastUpdated: 0,
};

function kioskReducer(state: KioskState, action: KioskAction): KioskState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_DATA':
      return {
        ...state,
        buildings: action.payload.buildings,
        connections: action.payload.connections,
        isLoading: false,
        error: null,
        lastUpdated: Date.now(),
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'UPDATE_BUILDING':
      return {
        ...state,
        buildings: state.buildings.map(b => 
          b.id === action.payload.id ? action.payload : b
        ),
        lastUpdated: Date.now(),
      };
    
    case 'DELETE_BUILDING':
      return {
        ...state,
        buildings: state.buildings.filter(b => b.id !== action.payload),
        lastUpdated: Date.now(),
      };
    
    case 'ADD_BUILDING':
      return {
        ...state,
        buildings: [...state.buildings, action.payload],
        lastUpdated: Date.now(),
      };
    
    default:
      return state;
  }
}

interface KioskContextType {
  state: KioskState;
  dispatch: React.Dispatch<KioskAction>;
  refreshData: () => Promise<void>;
  getBuilding: (id: string) => BuildingWithFloors | undefined;
  getFloor: (id: string) => FloorWithRooms | undefined;
  getRoom: (id: string) => Room | undefined;
}

const KioskContext = createContext<KioskContextType | undefined>(undefined);

export function KioskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(kioskReducer, initialState);

  // 데이터 새로고침 함수
  const refreshData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch('/api/kiosk-data');
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      dispatch({ type: 'SET_DATA', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  // 빠른 조회 함수들
  const getBuilding = (id: string) => state.buildings.find(b => b.id === id);
  
  const getFloor = (id: string) => {
    for (const building of state.buildings) {
      const floor = building.floors.find(f => f.id === id);
      if (floor) return floor;
    }
    return undefined;
  };

  const getRoom = (id: string) => {
    for (const building of state.buildings) {
      for (const floor of building.floors) {
        const room = floor.rooms.find(r => r.id === id);
        if (room) return room;
      }
    }
    return undefined;
  };

  // 초기 데이터 로드
  useEffect(() => {
    refreshData();
  }, []);

  // 5분마다 자동 새로고침 (선택적)
  useEffect(() => {
    const interval = setInterval(refreshData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const contextValue: KioskContextType = {
    state,
    dispatch,
    refreshData,
    getBuilding,
    getFloor,
    getRoom,
  };

  return (
    <KioskContext.Provider value={contextValue}>
      {children}
    </KioskContext.Provider>
  );
}

export function useKiosk() {
  const context = useContext(KioskContext);
  if (!context) {
    throw new Error('useKiosk must be used within a KioskProvider');
  }
  return context;
}