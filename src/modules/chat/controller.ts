import { Request, Response } from "express";
import { StatusCode } from "../../interfaces/enum";
import { ChatService } from "./config/gRPC-client/chat.client";


export default class chatController{


 getInboxUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;

    if (!userId) {
     res.status(StatusCode.BadRequest).json({ error: "userId is required" });
     return;
    }

    ChatService.GetInboxUsers({ userId }, (err: any, result: any) => {
      if (err) {
        console.error("Error in ChatService.GetInboxUsers:", err);
        res.status(StatusCode.BadRequest).json({ message: err.message });
        return;
      }

      res.status(StatusCode.OK).json(result || []);
    });
  } catch (error) {
    console.error("Error in getInboxUsers:", error);
    res.status(StatusCode.InternalServerError).json({ message: "Internal Server Error" });
  }
};

}