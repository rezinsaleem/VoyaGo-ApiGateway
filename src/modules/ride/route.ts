import express, { Application ,Request, Response } from 'express';
import rideController from './controller';
// import { isValidated } from '../auth/controller';

const controller = new rideController()

const rideRoute: Application = express();

rideRoute.post('/publishRide', controller.publishRide);
rideRoute.get('/getRide/:id', controller.getRide)
rideRoute.post('/search-rides',controller.searchRides);


export default rideRoute;