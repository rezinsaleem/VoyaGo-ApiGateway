import { NextFunction, Request, Response } from 'express';
import { StatusCode } from '../../interfaces/enum';
import { Tokens, UserCredentials } from '../../interfaces/interface';
import { AuthService } from './config/gRPC-client/auth.client';
import AsyncHandler from 'express-async-handler';

export const isValidated = AsyncHandler(
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

      if (!token) {
        res.status(StatusCode.Unauthorized).json({ success: false, message: 'Token not provided' });
        return;  
      }

      AuthService.IsAuthenticated({ token }, (err: any, result: UserCredentials) => {
        if (err) {
          console.error('Authentication Error:', err.details);
          res.status(StatusCode.Unauthorized).json({ success: false, message: 'Unauthorized' });
          return;  
        }
        next();
      });
    } catch (error) {
      console.error('Validation Middleware Error:', error);
      res.status(StatusCode.InternalServerError).json({ success: false, message: 'Internal Server Error' });
    }
  }
);

export const refreshToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token =
      req.cookies?.refreshToken ||
      req.headers.authorization?.split(' ')[1] ||
      req.body.token;

    if (!token) {
      res.status(StatusCode.Unauthorized).json({ success: false, message: 'Token is missing' });
      return;  // Explicitly return to stop execution
    }

    AuthService.RefreshToken({ token }, (err: any, result: Tokens) => {
      if (err) {
        console.error('Refresh Token Error:', err);
        res.status(StatusCode.NotAcceptable).json({ success: false, message: 'Invalid refresh token' });
        return;  // Explicitly return to stop execution
      }
      res.status(StatusCode.Created).json({
        success: true,
        accessToken: result?.access_token,
        refreshToken: result?.refresh_token,
        message: 'New token generated successfully',
      });
    });
  } catch (error) {
    console.error('Refresh Middleware Error:', error);
    res.status(StatusCode.InternalServerError).json({ success: false, message: 'Internal Server Error' });
  }
};
