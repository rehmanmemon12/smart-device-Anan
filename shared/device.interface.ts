export interface Device {
  id: string;
  name: string;
  isOnline: boolean;
  isOn: boolean;
  batteryPercentage: number;
  brightness: number;
  lastUpdated: string;
  type: DeviceType;
  location: string;
}

export type DeviceType = 
  | 'light' 
  | 'thermostat' 
  | 'sensor' 
  | 'controller' 
  | 'camera' 
  | 'sprinkler' 
  | 'plug' 
  | 'fan' 
  | 'doorbell';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface DeviceControlPayload {
  isOn?: boolean;
  brightness?: number;
}
