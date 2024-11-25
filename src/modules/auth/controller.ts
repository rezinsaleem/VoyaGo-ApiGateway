import { NextFunction, Request, Response } from 'express';
import { StatusCode } from '../../interfaces/enum';
import { Tokens, UserCredentials } from '../../interfaces/interface';
import { AuthService } from './config/gRPC-client/auth.client';
import expressAsyncHandler from 'express-async-handler';



export const isValidated = (requiredRole: string) =>
  expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      if (!res.headersSent) {
        res.status(401).json({ success: false, message: 'Token not provided' });
      }
      return;
    }

    try {
      const user = await new Promise<any>((resolve, reject) => {
        AuthService.IsAuthenticated({ token, requiredRole }, (error: any, response: any) => {
          if (error) {
            reject(error); 
          } else {
            resolve(response); 
          }
        });
      });

      if (!user || user.role !== requiredRole) {
        if (!res.headersSent) {
          res.status(403).json({
            success: false,
            message: 'Forbidden: You do not have the required permissions',
          });
        }
        return;
      }

      // User is authenticated and authorized
      next();
    } catch (error) {
      console.error('Error during authentication in API Gateway:', error);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
    }
  });


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
      console.log(result);
      if (err) {
        console.error('Refresh Token Error:', err);
        res.status(StatusCode.NotAcceptable).json({ success: false, message: 'Invalid refresh token' });
        return;  // Explicitly return to stop execution
      }
      res.status(StatusCode.Created).json(result);
    });
  } catch (error) {
    console.error('Refresh Middleware Error:', error);
    res.status(StatusCode.InternalServerError).json({ success: false, message: 'Internal Server Error' });
  }
};
