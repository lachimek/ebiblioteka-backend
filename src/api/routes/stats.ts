import { Request, Response } from "express";
import { StatsService } from "../services/statsService";

export const StatsRoute = {
    getBooksPageStats: async ({ body }: Request, res: Response) => {
        const response = await StatsService.getBooksPageStats();
        res.status(response.status).json(response);
    },
    getMembersPageStats: async ({ body }: Request, res: Response) => {
        const response = await StatsService.getMembersPageStats();
        res.status(response.status).json(response);
    },
};
