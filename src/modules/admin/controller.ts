import { Request, Response } from 'express';
import { StatusCode } from "../../interfaces/enum";
import { UserService } from "../user/config/gRPC client/user.client";
import { AdminAuthResponse, User } from '../../interfaces/interface';

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

  getUsers = async (req: Request, res: Response) => {
    try {
      UserService.GetUsers({}, (err: any, result: { users: User[] }) => {
        if (err) {
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result) { 
          return res.status(StatusCode.OK).json(result.users); 
        }
        return res.status(StatusCode.NotFound).json({ message: 'NoUsersFound' });
      });
    } catch (error) {
      console.error(error);
      res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  };

  userBlock = async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      const {accountStatus} = req.body
      console.log(id , accountStatus)
      UserService.BlockUser({id, accountStatus}, (err: any, result: { message: string}) => {
        if (err) {
          console.log(err)
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result) { 
          return res.status(StatusCode.OK).json(result); 
        }
        return res.status(StatusCode.NotFound).json({ message: 'UserNotFound' });
      });
    } catch (error) {
      console.error(error);
      res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  };

  getUser  = async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      UserService.GetUser({id}, (err: any, result: { user: User}) => {
        if (err) {
          console.log(err)
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result) { 
          return res.status(StatusCode.OK).json(result); 
        }
        return res.status(StatusCode.NotFound).json({ message: 'UserNotFound' });
      });
    } catch (error) {
      console.error(error);
      res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  };

  userVerification = async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      UserService.userVerification({id, ...req.body}, (err: any, result: { message: string}) => {
        if (err) {
          console.log(err)
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result) { 
          console.log(result)
          return res.status(StatusCode.OK).json(result); 
        }
        return res.status(StatusCode.NotFound).json({ message: 'UserNotFound' });
      });
    } catch (error) {
      console.error(error);
      res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  };

}