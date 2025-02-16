import express, { Application ,Request, Response } from 'express';
import rideController from './controller';
import { isValidated } from '../auth/controller';
// import { isValidated } from '../auth/controller';

const controller = new rideController()

const rideRoute: Application = express();

rideRoute.post('/publishRide', controller.publishRide);
rideRoute.get('/getRide/:id', controller.getRide)
rideRoute.post('/search-rides',controller.searchRides);


rideRoute.post('/payment/:id', isValidated('user'), controller.payment)
rideRoute.post('/paymentSuccess/:id', isValidated('user'), controller.paymentSuccess)
rideRoute.put('/cancelRide/:id', isValidated('user'), controller.cancelRide)

export default rideRoute;