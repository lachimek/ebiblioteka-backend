import { Request, Response } from "express";
import { BooksService } from "../services/booksService";

export const BooksRoute = {
    addBook: async (req: Request, res: Response) => {
        const response = await BooksService.add(req.body);
        res.status(response.status).json(response);
    },
    getBookAll: async (req: Request, res: Response) => {
        const response = await BooksService.all();
        res.status(response.status).json(response);
    },
    getBookOne: async (req: Request, res: Response) => {
        const response = await BooksService.get(req.query);
        res.status(response.status).json(response);
    },
    deleteBook: async (req: Request, res: Response) => {
        const response = await BooksService.delete(req.body);
        res.status(response.status).json(response);
    },
};
