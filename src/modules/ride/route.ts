import express, { Application } from 'express';
import rideController from './controller';
// import { isValidated } from '../auth/controller';

const controller = new rideController()

const rideRoute: Application = express();

rideRoute.post('/publishRide', controller.publishRide);
rideRoute.get('/getRide/:id', controller.getRide)

export default rideRoute;