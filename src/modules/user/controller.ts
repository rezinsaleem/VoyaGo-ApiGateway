import { Request, Response } from "express";
import { StatusCode } from "../../interfaces/enum";
import { UserService } from "./config/gRPC client/user.client";
import { AuthResponse } from "../../interfaces/interface";


export default class userController {
  signupOtp = async (req: Request, res: Response) => {
    try {
      UserService.SignupOtp(
        req.body,
        (err: any, result: { message: string }) => {
          if (err) {
            return res.status(StatusCode.BadRequest).json({ message: err });
          } else {
            return res.status(StatusCode.Created).json(result);
          }
        }
      );
      
    } catch (error) {
      console.error(error);

      res
        .status(StatusCode.InternalServerError)
        .json({ message: "Internal Server Error" });
    }
  };

  resendOtp = async (req: Request, res: Response) => {
    console.log("Incoming request for resendOtp:", req.body);
    try {
        console.log("Forwarding request to UserService.ResendOtp with:", req.body);
        UserService.ResendOtp(req.body, (err: any, result: { message: string }) => {
            console.log("UserService response:", { err, result });
            if (err) {
                console.log("Error in UserService:", err);
                return res.status(StatusCode.BadRequest).json({ message: err });
            }
            return res.status(StatusCode.Created).json(result);
        });
    } catch (error) {
        console.log("Error in resendOtp API Gateway:", error);
        res.status(StatusCode.InternalServerError).json({ message: "Internal Server Error" });
    }
};


registerUser = async (req: Request, res: Response) => {
  try {
    
    UserService.RegisterUser(
      req.body,
      (err: any, result: AuthResponse) => {
        console.log(req.body)
        if (err) {
          res.status(StatusCode.BadRequest).json({ message: err });
        } else {
          res.status(StatusCode.Created).json(result);
        }
      }
    );
  } catch (error) {
    console.log(error);
    res
      .status(StatusCode.InternalServerError)
      .json({ message: 'Internal Server Error' });
  }
};

loginUser = (req: Request, res: Response) => {
  try {
    UserService.LoginUser(req.body, (err: any, result: AuthResponse) => {
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

};
