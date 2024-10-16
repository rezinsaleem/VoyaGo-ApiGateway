import express, { Application } from 'express';
import userController from './controller';
import upload from '../../middlewares/multer';


const controller = new userController()

const userRoute: Application = express();

userRoute.post('/signupOtp',controller.signupOtp);
userRoute.post('/resendOtp', controller.resendOtp);
userRoute.post('/registerUser', controller.registerUser);
userRoute.post('/loginUser', controller.loginUser);
userRoute.post('/googleLoginUser', controller.googleLoginUser);

userRoute.post('/updateProfile/:id', upload.single('userImage'), controller.updateUser)
userRoute.post('/changePassword/:id',controller.changePassword)

export default userRoute;