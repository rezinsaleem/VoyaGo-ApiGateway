import express, { Application } from 'express'
import AdminController from './controller';
import { isValidated } from '../auth/controller';


const adminRoute:Application=express()

const controller = new AdminController()

adminRoute.post('/adminLogin', controller.adminLogin);
adminRoute.get('/getUsers',isValidated('admin'), controller.getUsers)
adminRoute.put('/users/:id/block-unblock', isValidated('admin'), controller.userBlock)
adminRoute.get('/getUser/:id', isValidated('admin'), controller.getUser)
adminRoute.post('/user/:id/verification', isValidated('admin'), controller.userVerification)

export default adminRoute;