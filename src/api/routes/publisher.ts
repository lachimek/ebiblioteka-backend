import { Request, Response } from "express";
import { PublisherService } from "../services/publisherService";

export const PublisherRoute = {
    addPublisher: async ({ body }: Request, res: Response) => {
        const response = await PublisherService.add(body);
        res.status(response.status).json(response);
    },
    getPublisherOne: async ({ query }: Request, res: Response) => {
        const response = await PublisherService.get(query.search as string);
        res.status(response.status).json(response);
    },
    getPublisherAll: async (req: Request, res: Response) => {
        const response = await PublisherService.all();
        res.status(response.status).json(response);
    },
};
