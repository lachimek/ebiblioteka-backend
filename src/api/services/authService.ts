import { getRepository } from "typeorm";
import * as jwt from "jsonwebtoken";
import * as fs from "fs";
import { join } from "path";
import { User, UserRole } from "../../entity/User";
import { ERROR } from "../constants/constants";
import { encryptionUtils } from "../utils/encryptionUtils";
import { CONFIG } from "../config";
import { Group } from "../../entity/Group";
import randomPasswordString from "../utils/randomPasswordString";

export const AuthService = {
    loginUser: async (login: string, password: string) => {
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail({ login: login }, { relations: ["userDetails"] });
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
    registerUser: async (
        id: string, //defined if edit
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
        city: string,
        postalCode: string,
        streetAddress: string,
        groupId: string
    ) => {
        const userRepository = getRepository(User);
        const groupRepository = getRepository(Group);
        let login = `${firstName.toLowerCase().charAt(0)}${lastName.toLowerCase()}`;
        const randomPassword = randomPasswordString(10);

        console.log("id:", id);
        try {
            const group = await groupRepository.findOne({ id: groupId });
            if (id === undefined) {
                //crate new user
                const exists = undefined !== (await userRepository.findOne({ login: login }));
                if (exists) {
                    login = login + Math.floor(Math.random() * 999) + 1;
                }
                const hashedPassword = await encryptionUtils.cryptPassword(randomPassword);
                const user = userRepository.create({
                    login: login, // kamil powski = kpowski || kpowskixxx x=number
                    password: hashedPassword,
                    role: UserRole.STUDENT,
                    userDetails: {
                        firstName,
                        lastName,
                        email,
                        phone,
                        city,
                        postalCode,
                        streetAddress,
                        group: group,
                    },
                });
                await userRepository.save(user);
                console.log("create", user);
                console.log("credentials", { login: login, password: randomPassword });
                fs.writeFile(join(process.cwd(), "resources", `${login}.txt`), `${login}:${randomPassword}`, (err) => {
                    if (err) throw err;
                    console.log("Dane logowania użytkownika zapisane w pliku txt.");
                });
                return {
                    status: 200,
                    member: {
                        ...user.userDetails,
                        id: user.id,
                    },
                };
            } else {
                //edit existing user by id
                const user = await userRepository.findOne({
                    where: [{ role: UserRole.STUDENT, id: id }],
                    join: {
                        alias: "user",
                        leftJoinAndSelect: {
                            userDetails: "user.userDetails",
                            userGroup: "userDetails.group",
                        },
                    },
                });
                user.userDetails.firstName = firstName;
                user.userDetails.lastName = lastName;
                user.userDetails.email = email;
                user.userDetails.phone = phone;
                user.userDetails.city = city;
                user.userDetails.postalCode = postalCode;
                user.userDetails.streetAddress = streetAddress;
                user.userDetails.group = group;
                console.log("edit", user);
                await userRepository.save({ id: id, ...user });
                return {
                    status: 200,
                    member: {
                        ...user.userDetails,
                        id: user.id,
                    },
                };
            }
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.USER_NOT_ADDED };
        }
    },
    all: async () => {
        const userRepository = getRepository(User);
        try {
            const students = await userRepository.find({
                where: [{ role: UserRole.STUDENT }],
                join: {
                    alias: "user",
                    leftJoinAndSelect: {
                        userDetails: "user.userDetails",
                        userGroup: "userDetails.group",
                        issueHistory: "user.issueHistory",
                    },
                },
            });
            return {
                status: 200,
                students: students.map((student) => {
                    const { id, group, ...userDetails } = student.userDetails;
                    const issueHistory = student.issueHistory || [];
                    return {
                        id: student.id,
                        ...userDetails,
                        groupName: student.userDetails.group.name,
                        issuanceCount: issueHistory.length || 0,
                    };
                }),
            };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.GETTING_STUDENT_ALL };
        }
    },
    get: async (userId: string) => {
        const userRepository = getRepository(User);
        try {
            const student = await userRepository.findOne({
                where: [{ role: UserRole.STUDENT, id: userId }],
                join: {
                    alias: "user",
                    leftJoinAndSelect: {
                        userDetails: "user.userDetails",
                        userGroup: "userDetails.group",
                    },
                },
            });
            const { id, group, ...userDetails } = student.userDetails;
            return {
                status: 200,
                member: {
                    id: student.id,
                    ...userDetails,
                    groupName: student.userDetails.group.name,
                    groupId: student.userDetails.group.id,
                    issuanceCount: Math.floor(Math.random() * 50),
                },
            };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.GETTING_STUDENT_ALL };
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
