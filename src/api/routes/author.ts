import { Request, Response } from "express";
import { AuthorService } from "../services/authorService";

export const AuthorRoute = {
    addAuthor: async ({ body }: Request, res: Response) => {
        const response = await AuthorService.add(body);
        res.status(response.status).json(response);
    },
    getAuthorOne: async ({ query }: Request, res: Response) => {
        const response = await AuthorService.get(query.search as string);
        res.status(response.status).json(response);
    },
    getAuthorAll: async (req: Request, res: Response) => {
        const response = await AuthorService.all();
        res.status(response.status).json(response);
    },
};
