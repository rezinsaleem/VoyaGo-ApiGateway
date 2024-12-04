export interface AuthResponse {
  message: string;
  name: string;
  email:string;
  refreshToken: string;
  token: string;
  _id: string;
  service: string;
  image: string;
  mobile: string;
  isVerified: string;
}

export interface AdminAuthResponse {
  message: string;
  name: string;
  token: string;
}

export interface UpdateUser {
  message: string;
  name: string;
  phoneNumber: number;
  userImage: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface UserCredentials {
  userId: string;
  role: string;
}

export interface User {
  message: string;
  id: string;
  name: string;
  email: string;
  phoneNumber: number;
  userImage: string;
  password?: string;
  accountStatus?: string;
  isVerified?: string;      
  verificationDetails?: {
    govIdType?: string;
    govIdNumber?: string;
    document?: string;
  };
  createdAt?: Date;        
  updatedAt?: Date;
}


export interface CustomUser {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomUser;
    }
  }
}

export interface RidePlan {
  start_address: string;
  end_address: string;
  routeName: string;
  distance: string;
  duration: string;
  numSeats: number;
  rideDate: string;
  rideTime: string;
  pricePerSeat: number;
  car: string;
  additionalInfo: string;
  passengers: Passenger[];
}

interface Passenger {
  id: number;
  name: string;
  phoneNumber: number,
}

interface SearchRides {
  riderDetails: any;
  start_lat: number;
  start_lng: number;
  start_address: string;
  end_lat: number;
  end_lng: number;
  end_address: string;
  routeName: string;
  distance: string;
  duration: string;
  numSeats: number;
  rideDate: Date;
  rideTime: string;
  pricePerSeat: number;
  car: string;
  additionalInfo: string;
  status: string;
  riderId: string;
  passengers:  Passenger[];
  startDistance?: number; 
  endDistance?: number;   
}

export interface SearchRidesResponse {
  rides: SearchRides[];
}

