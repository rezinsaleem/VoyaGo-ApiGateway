import express, { Application } from 'express';
import userController from './controller';


const userRoute: Application = express();

userRoute.post('/signupOtp', userController.signupOtp);

export default userRoute;