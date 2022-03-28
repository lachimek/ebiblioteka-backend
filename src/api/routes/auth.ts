import { Request, Response } from "express";
import { AuthService } from "../services/authService";

export const AuthRoute = {
    loginUser: async (req: Request, res: Response) => {
        const response = await AuthService.loginUser(req.body.login, req.body.password);
        if (response.status === 404) {
            res.status(response.status).json(response);
        } else {
            res.status(response.status)
                .cookie("refreshToken", response.refreshToken, {
                    httpOnly: true,
                    expires: response.expires,
                })
                .header("Authorization", "Bearer " + response.token)
                .json({ token: response.token });
        }
    },
    registerUser: async ({ body }: Request, res: Response) => {
        const response = await AuthService.registerUser(
            body.login,
            body.password,
            body.firstName,
            body.lastName,
            body.email,
            body.phone,
            body.city,
            body.postalCode,
            body.streetAddress,
            body.groupId,
            body.role
        );
        res.status(response.status).json(response);
    },
    getStudentAll: async (req: Request, res: Response) => {
        const response = await AuthService.all();
        res.status(response.status).json(response);
    },
    refreshToken: async (req: Request, res: Response) => {
        const response = await AuthService.refreshToken(req.cookies["refreshToken"]);
        res.status(response.status).json(response);
    },
};
