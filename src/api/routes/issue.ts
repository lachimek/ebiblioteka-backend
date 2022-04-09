import { Request, Response } from "express";
import { IssueService } from "../services/issueService";

export const IssueRoute = {
    addIssue: async ({ body }: Request, res: Response) => {
        const response = await IssueService.add(body);
        res.status(response.status).json(response);
    },
    getIssueOne: async ({ query }: Request, res: Response) => {
        const response = await IssueService.get(query.search as string);
        res.status(response.status).json(response);
    },
    getIssueAll: async (req: Request, res: Response) => {
        const response = await IssueService.all();
        res.status(response.status).json(response);
    },
};
