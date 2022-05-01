import { Request, Response, NextFunction } from "express";
import { UserRole } from "../../entity/User";
import { AuthService } from "../services/authService";

/**
 * @param {boolean} studentAllowed - allow student permission to access this route
 * @default studentAllowed=false
 * @returns next() or response with error code.
 */
export const authenticated = (studentAllowed: boolean = false) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const response = await AuthService.authenticate(req.header("Authorization"));
        if (response.status === 200) {
            if (studentAllowed && response.permissions === UserRole.STUDENT) return next();

            if (!studentAllowed && response.permissions !== UserRole.STUDENT) return next();

            return res.status(response.status).json({ status: response.status, error: "ROLE_MISMATCH" });
        }

        return res.status(response.status).json(response);
    };
};
