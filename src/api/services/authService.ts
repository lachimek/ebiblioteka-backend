import { getRepository } from "typeorm";
import { User } from "../../entity/User";
import { ERROR } from "../constants/constants";
import { encryptionUtils } from "../utils/encryptionUtils";
import * as jwt from "jsonwebtoken";
import { CONFIG } from "../config";

export const AuthService = {
    loginUser: async (login: string, password: string) => {
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail({ login: login });
            if (!(await encryptionUtils.comparePassword(password, user.password))) {
                return { status: 404, error: ERROR.USER_NOT_FOUND };
            }

            delete user.password;

            const token = jwt.sign({ user: user }, CONFIG.TOKEN_SECRET, {
                expiresIn: CONFIG.TOKEN_EXPIRE,
            });
            const refreshToken = jwt.sign({ user: user }, CONFIG.REFRESH_TOKEN_SECRET, {
                expiresIn: CONFIG.REFRESH_TOKEN_EXPIRE,
            });
            const now = new Date().getTime();
            const expires = new Date(now + 1000 * CONFIG.REFRESH_TOKEN_EXPIRE);

            return {
                status: 200,
                token: token,
                refreshToken: refreshToken,
                expires: expires,
            };
        } catch (error) {
            //EntityNotFoundError
            console.log(error);
            return { status: 404, error: ERROR.USER_NOT_FOUND };
        }
    },
    registerUser: async (login: string, password: string, firstName: string, lastName: string) => {
        const userRepository = getRepository(User);
        try {
            const hashedPassword = await encryptionUtils.cryptPassword(password);
            const user = userRepository.create({
                login: login,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName,
            });
            await userRepository.save(user);

            return { status: 200, uuid: user.id, login: user.login };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.USER_NOT_FOUND };
        }
    },
    authenticate: async (token: string) => {
        if (!token) return { status: 401, error: ERROR.INVALID_TOKEN };
        if (!token.split(" ")[1]) return { status: 401, error: ERROR.INVALID_TOKEN };

        token = token.split(" ")[1];
        //if(!token) return {status: 401, error: ERROR.INVALID_TOKEN};
        try {
            const verified = jwt.verify(token, CONFIG.TOKEN_SECRET);
            if (!verified) return { status: 403, error: ERROR.ACCESS_DENIED };
            else return { status: 200 };
        } catch (error) {
            console.log(error);
            return { status: 401, error: ERROR.INVALID_TOKEN };
        }
    },
    refreshToken: async (refreshToken: string) => {
        if (!refreshToken) return { status: 401, error: ERROR.INVALID_REFRESH_TOKEN };

        try {
            const decoded = jwt.verify(refreshToken, CONFIG.REFRESH_TOKEN_SECRET);
            const token = jwt.sign({ user: (decoded as jwt.JwtPayload).user }, CONFIG.TOKEN_SECRET, {
                expiresIn: CONFIG.TOKEN_EXPIRE,
            });

            return { status: 200, token: token };
        } catch (error) {
            console.log(error);
            return { status: 401, error: ERROR.INVALID_TOKEN };
        }
    },
};
