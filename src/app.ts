import { Application } from "express";
import "dotenv/config";
import http from "http";
import express from "express";
import cors from "cors";
import compression from 'compression';
import helmet from 'helmet';
import { limiter } from './utils/rateLimit';
import userRoute from "./modules/user/route";
import adminRoute from './modules/admin/route';
import rideRoute from "./modules/ride/route";
import morgan from "morgan";
import authRoute from "./modules/auth/route";
import SocketService from "./services/socket";
import chatRoute from "./modules/chat/route";

class App {
  public app: Application;
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  public socketService: SocketService;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.socketService = new SocketService(this.server);
    this.applyMiddleware();
    this.routes();
  }

  private applyMiddleware(): void {

    this.app.use(morgan('combined'));
  
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173', 
        credentials: true,
      })
    );
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(limiter);
  }

  private routes(): void {
    this.app.use("/api/user", userRoute);
    this.app.use('/api/admin', adminRoute);
    this.app.use('/api/ride', rideRoute);
    this.app.use('/api/auth', authRoute);
    this.app.use('/api/chat', chatRoute);

  }

  public startServer(port: number): void {
    this.server.listen(port, () => {
      console.log(`API-Gateway started on ${port}`);
    });
  }
}

export default App;
