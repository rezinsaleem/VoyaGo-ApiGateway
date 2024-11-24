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
      console.log('Calling AuthService with token:', token);
      const user = await new Promise<any>((resolve, reject) => {
        AuthService.IsAuthenticated({ token, requiredRole }, (error: any, response: any) => {
          if (error) {
            reject(error); // Reject the promise if there's an error
          } else {
            resolve(response); // Resolve the promise with the response
          }
        });
      });

      console.log('AuthService response:', user);

      // Check if user exists and their role matches the requiredRole
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
