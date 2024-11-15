import express, { Application } from 'express';
import rideController from './controller';

const controller = new rideController()

const rideRoute: Application = express();

rideRoute.post('/publishRide',controller.publishRide);

export default rideRoute;