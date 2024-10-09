import express, { Application } from 'express';
import userController from './controller';


const controller = new userController()

const userRoute: Application = express();

userRoute.post('/signupOtp',controller.signupOtp);
userRoute.post('/resendOtp', controller.resendOtp);
userRoute.post('/registerUser', controller.registerUser);

export default userRoute;