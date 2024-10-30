import express, { Application } from 'express'
import AdminController from './controller';
import { isValidated } from '../auth/controller';


const adminRoute:Application=express()

const controller = new AdminController()

adminRoute.post('/adminLogin', controller.adminLogin);
adminRoute.get('/getUsers', isValidated, controller.getUsers)
adminRoute.patch('/users/:id/block-unblock', isValidated, controller.userBlock)

export default adminRoute;