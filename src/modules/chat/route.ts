import express, { Application ,Request, Response } from 'express';
import chatController from './controller';

const controller = new chatController()

const chatRoute: Application = express();

chatRoute.get('/inboxUsers', controller.getInboxUsers);


export default chatRoute;