import { Request, Response } from "express";
import { StatusCode } from "../../interfaces/enum";
import { RideService } from "./config/gRPC-client/auth.ride";
import { RidePlan } from "../../interfaces/interface";


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

  getRide  = async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      RideService.GetRide({id}, (err: any, result: { ride:RidePlan}) => {
        if (err) {
          console.log(err)
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result) { 
          return res.status(StatusCode.OK).json(result); 
        }
        return res.status(StatusCode.NotFound).json({ message: 'RideNotFound' });
      });
    } catch (error) {
      console.error(error);
      res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  };

}