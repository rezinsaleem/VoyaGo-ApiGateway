import { Request, Response } from "express";
import { StatusCode } from "../../interfaces/enum";
import { RideService } from "./config/gRPC-client/auth.ride";


export default class rideController{

  publishRide = async (req: Request, res: Response) => {
    try {
      
      const {rideData} = req.body;
      console.log(rideData);
      RideService.PublishRide(
        rideData,
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

}