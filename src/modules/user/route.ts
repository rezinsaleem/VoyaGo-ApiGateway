import express, { Application } from 'express';
import userController from './controller';


const controller = new userController()

const userRoute: Application = express();

userRoute.post('/signupOtp',controller.signupOtp);
userRoute.post('/resendOtp', controller.resendOtp);
userRoute.post('/registerUser', controller.registerUser);
userRoute.post('/loginUser', controller.loginUser);

export default userRoute;