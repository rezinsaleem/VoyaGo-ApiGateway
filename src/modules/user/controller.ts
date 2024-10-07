import { Request, Response } from 'express';

import { StatusCode } from '../../interfaces/enum';
import { UserService } from './config/gRPC client/user.client';


export default class userController {
  static signupOtp(arg0: string, signupOtp: any) {
    throw new Error('Method not implemented.');
  }

  
  signupOtp = async (req: Request, res: Response) => {
    try {
      UserService.SignupOtp(
        req.body,
        (err: any, result: { message: string }) => {
          if (err) {
            res.status(StatusCode.BadRequest).json({ message: err });
          } else {
            res.status(StatusCode.Created).json(result);
          }
        }
      );
    } catch (error) {
      console.log(error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: 'Internal Server Error' });
    }
  };

}