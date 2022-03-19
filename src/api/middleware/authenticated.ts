import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";

export const authenticated = async (req: Request, res: Response, next: NextFunction) => {
    const response = await AuthService.authenticate(req.header("Authorization"));
    if (response.status === 200) next();
    else res.status(response.status).json(response);
};
