import { Request, Response } from "express";
import { StatusCode } from "../../interfaces/enum";
import { RideService } from "./config/gRPC-client/auth.ride";
import { RidePlan,  SearchRidesResponse } from "../../interfaces/interface";
import { UserService } from "../user/config/gRPC client/user.client";

interface LocationData {
  address: string;
  lat: number;
  lng: number;
}

interface SearchRideParams {
  date: string;
  leavingFrom: LocationData;
  goingTo: LocationData;
}

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

   searchRides = async (req: Request, res: Response) => {
    try {
      const searchData = req.body; 
  
      await RideService.SearchRides(searchData, async (err: any, result: SearchRidesResponse) => {
        if (err) {
          console.error('SearchRides error:', err);
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
  
        if (result && result.rides) {
          if (result.rides.length === 0) {
            console.log('No rides found, but returning empty array.');
            return res.status(StatusCode.OK).json(result.rides); 
          }
  
          console.log('Found Rides:', result.rides); // Log if there are rides found
  
          const riderIds = result.rides.map((ride: { riderId: any; }) => ride.riderId);
          console.log('riderIds:', riderIds);
  
          const request = { riderIds: riderIds };
          UserService.GetUsersByRides(request, (userErr: any, userResponse: any) => {
            if (userErr) {
              console.error('User Service Error:', userErr);
              return res.status(StatusCode.BadRequest).json({ message: userErr.message });
            }
  
            const ridesWithRiderDetails = result.rides.map((ride) => ({
              ...ride,
              riderDetails: userResponse.users.find((user: any) => user._id === ride.riderId),
            }));
  
            console.log('Rides with Rider Details:', ridesWithRiderDetails);
            return res.status(StatusCode.OK).json(ridesWithRiderDetails); // Return rides with rider details
          });
        } else {
          // If no rides are present in the result, return an empty array
          console.log('No rides found.');
          return res.status(StatusCode.OK).json([]); // Return empty array
        }
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  };
  
}