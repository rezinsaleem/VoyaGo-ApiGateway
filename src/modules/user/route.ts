import express, { Application } from 'express';
import userController from './controller';
import upload from '../../middlewares/multer';
import { isValidated } from '../auth/controller';


const controller = new userController()

const userRoute: Application = express();

userRoute.post('/signupOtp',controller.signupOtp);
userRoute.post('/resendOtp', controller.resendOtp);
userRoute.post('/registerUser', controller.registerUser);

userRoute.post('/loginUser', controller.loginUser);
userRoute.post('/googleLoginUser', controller.googleLoginUser);
userRoute.post('/forgotPassOtp', controller.forgotPassOtp);
userRoute.post('/otpVerify', controller.otpVerify);
userRoute.post('/updatePassword', controller.updatePassword);
userRoute.get('/isBlocked/:id', controller.isBlocked)
userRoute.post('/verifyUser/:id', isValidated('user'),upload.single('document'), controller.verifyUser)

userRoute.post('/updateProfile/:id', isValidated('user'), upload.single('userImage'), controller.updateUser)
userRoute.post('/changePassword/:id',isValidated('user'), controller.changePassword)

export default userRoute;