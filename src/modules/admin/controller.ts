import { Request, Response } from 'express';
import { StatusCode } from "../../interfaces/enum";
import { UserService } from "../user/config/gRPC client/user.client";
import { AdminAuthResponse } from '../../interfaces/interface';

export default class AdminController {
  adminLogin = (req: Request, res: Response) => {
    try {
      UserService.AdminLogin(req.body, (err: any, result: AdminAuthResponse) => {
        console.log(req.body);
        if (err) {
          res.status(StatusCode.BadRequest).json({ message: err });
        } else {
          res.status(StatusCode.Created).json(result);
        }
      });
    } catch (error) {
      console.log(error);
      res
        .status(StatusCode.InternalServerError)
        .json({ message: 'Internal Server Error' });
    }
  };
}