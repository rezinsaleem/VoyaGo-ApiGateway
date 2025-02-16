import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { AuthService } from '../modules/auth/config/gRPC-client/auth.client';
import jwt from 'jsonwebtoken';
import { Tokens } from '../interfaces/interface';

class SocketService {
  private io: SocketIOServer;
  private socketMap: Map<string, any>;

  constructor(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      },
    });
    this.socketMap = new Map();
    this.io.use(this.authenticateSocket.bind(this));
    this.initializeSocketEvents();
  }

  private async authenticateSocket(socket: Socket, next: (err?: any) => void) {
    try {
      const { token, refreshToken } = socket.handshake.auth;
      if (!token && !refreshToken) {
        console.error('No tokens provided');
        return next(new Error('No tokens provided'));
      }

      if (token) {
        try {
          jwt.verify(token, process.env.SECRET_KEY as string);
          return next();
        } catch (error) {
          if (error instanceof jwt.TokenExpiredError) {
            console.warn('Access token expired, attempting to refresh token');
            // Refresh token
            if (refreshToken) {
              AuthService.RefreshToken({ token: refreshToken }, (err: any, result: Tokens) => {
                if (err) {
                  console.error('Error refreshing token:', err);
                  return next(new Error('Refresh token error'));
                } else {
                  // Send new tokens to the client
                  socket.emit('newTokens', {
                    token: result.access_token,
                    refreshToken: result.refresh_token,
                  });
                  return next();
                }
              });
            } else {
              return next(new Error('Refresh token is missing'));
            }
          } else {
            return next(new Error('Invalid access token'));
          }
        }
      }

      if (refreshToken) {
        AuthService.RefreshToken(
          { token: refreshToken },
          (err: any, result: Tokens) => {
            if (err) {
              console.error('Error refreshing token:', err);
              return next(new Error('Refresh token error'));
            } else {
              socket.emit('newTokens', {
                token: result.access_token,
                refreshToken: result.refresh_token,
              });
              return next();
            }
          }
        );
      } else {
        return next(new Error('Authentication error: No token provided'));
      }
    } catch (error) {
      console.error('Socket authentication error:', error);
      return next(new Error('Authentication error'));
    }
  }

  private initializeSocketEvents(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);
      socket.emit('authenticated', { message: 'You are authenticated' }); // Notify the client

      socket.on('join_chat', (user: { userId: string }) => {
        const userId = user.userId; 
        console.log(userId);
        this.socketMap.set(userId, socket.id);
      
        console.log(this.socketMap);
      });
      

      socket.on('message', (msg: string) => {
        console.log(`Received message: ${msg}`);
        // Handle received message here, e.g., save to database or broadcast
        this.io.emit('message', msg); // Broadcast to all clients
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
        socket.emit('error', { message: 'An error occurred with the socket connection' });
      });
    });
  }
}

export default SocketService;
