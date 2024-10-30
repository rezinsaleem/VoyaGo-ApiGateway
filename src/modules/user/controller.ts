import { Request, Response } from "express";
import { StatusCode } from "../../interfaces/enum";
import { UserService } from "./config/gRPC client/user.client";
import { AuthResponse, UpdateUser } from "../../interfaces/interface";
import uploadToS3 from "../../services/s3";


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

googleLoginUser = (req: Request, res: Response) => {
  try {
    UserService.GoogleLoginUser(
      req.body,
      (err: any, result: AuthResponse) => {
        if (err) {
          console.log(err);
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

updateUser = async (req: Request, res: Response) => {
  try {
    const files: Express.Multer.File | undefined = req.file;
    let userImage = '';
    if (files) {
      userImage = await uploadToS3(files);
      console.log(userImage);
    }
    const {id} = req.params
    UserService.UpdateUser({...req.body,userImage, id}, (err: any, result: {user: UpdateUser}) => {
      if (err) {
        res.status(StatusCode.BadRequest).json({ message: err });
      } else {
        console.log(result);
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

changePassword = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const {currentPassword, newPassword} = req.body
    UserService.ChangePassword({id, currentPassword, newPassword}, (err: any, result: { message: string}) => {
      if (err) {
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

forgotPassOtp = async (req: Request, res: Response) => {
  try {
    UserService.ForgotPassOtp(
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
    res
      .status(StatusCode.InternalServerError)
      .json({ message: 'Internal Server Error' });
  }
};

otpVerify = async (req: Request, res: Response) => {
  try {
    UserService.OtpVerify(
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
    res
      .status(StatusCode.InternalServerError)
      .json({ message: 'Internal Server Error' });
  }
};

updatePassword = async (req: Request, res: Response) => {
  try {
    UserService.UpdatePassword(
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
    res
      .status(StatusCode.InternalServerError)
      .json({ message: 'Internal Server Error' });
  }
};

isBlocked = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    UserService.IsBlocked({id}, (err: any, result: { message: string}) => {
      if (err) {
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


};
