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
    getIssuesByUserId: async ({ query }: Request, res: Response) => {
        const response = await IssueService.getByUserId(query.id as string);
        res.status(response.status).json(response);
    },
    getIssueAll: async (req: Request, res: Response) => {
        const response = await IssueService.all();
        res.status(response.status).json(response);
    },
    getIssueOverdues: async (req: Request, res: Response) => {
        const response = await IssueService.overdues();
        res.status(response.status).json(response);
    },
    returnIssue: async ({ body }: Request, res: Response) => {
        const response = await IssueService.returnIssue(body.issueId);
        res.status(response.status).json(response);
    },
};
