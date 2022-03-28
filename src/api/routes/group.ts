import { Request, Response } from "express";
import { GroupService } from "../services/groupService";

export const GroupRoute = {
    addGroup: async ({ body }: Request, res: Response) => {
        const response = await GroupService.add(body);
        res.status(response.status).json(response);
    },
    getGroupOne: async ({ query }: Request, res: Response) => {
        const response = await GroupService.get(query.search as string);
        res.status(response.status).json(response);
    },
    getGroupAll: async (req: Request, res: Response) => {
        const response = await GroupService.all();
        res.status(response.status).json(response);
    },
};
