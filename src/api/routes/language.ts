import { Request, Response } from "express";
import { LanguageService } from "../services/languageService";

export const LanguageRoute = {
    addLanguage: async ({ body }: Request, res: Response) => {
        const response = await LanguageService.add(body);
        res.status(response.status).json(response);
    },
    getLanguageOne: async ({ query }: Request, res: Response) => {
        const response = await LanguageService.get(query.search as string);
        res.status(response.status).json(response);
    },
    getLanguageAll: async (req: Request, res: Response) => {
        const response = await LanguageService.all();
        res.status(response.status).json(response);
    },
};
