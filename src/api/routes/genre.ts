import { Request, Response } from "express";
import { GenreService } from "../services/genreService";

export const GenreRoute = {
    addGenre: async ({ body }: Request, res: Response) => {
        const response = await GenreService.add(body);
        res.status(response.status).json(response);
    },
    getGenreOne: async ({ body }: Request, res: Response) => {
        const response = await GenreService.get(body);
        res.status(response.status).json(response);
    },
    getGenreAll: async (req: Request, res: Response) => {
        const response = await GenreService.all();
        res.status(response.status).json(response);
    },
};
