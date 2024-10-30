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
  createdAt?: Date;        
  updatedAt?: Date;
}