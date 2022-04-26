import { getRepository, Like } from "typeorm";
import { Book } from "../../entity/Book";
import { Group } from "../../entity/Group";
import { IssueHistory } from "../../entity/IssueHistory";
import { User, UserRole } from "../../entity/User";
import { ERROR } from "../constants/constants";
import dateDiffInDays from "../utils/dateDiffInDays";

export const StatsService = {
    getBooksPageStats: async () => {
        const booksRepository = getRepository(Book);
        const issuesRepository = getRepository(IssueHistory);
        try {
            const books = await booksRepository.find();
            const issues = await issuesRepository.find({ where: { returned: true } });

            const countOfCurrentlyIssuedBooks = books.filter((book) => {
                return !book.available;
            }).length;

            const countOfLostBooks = books.filter((book) => {
                return book.deleted;
            }).length;

            const countOfReturnedBooks = issues.length;
            const baseVal = Math.floor(Math.random() * 100);
            const graphData = [
                { month: ["Styczeń", "2022"], value: baseVal + Math.floor(Math.random() * 10) },
                { month: ["Luty", "2022"], value: baseVal + Math.floor(Math.random() * 10) },
                { month: ["Marzec", "2022"], value: baseVal + Math.floor(Math.random() * 10) },
                { month: ["Kwiecień", "2022"], value: baseVal + Math.floor(Math.random() * 10) },
                { month: ["Maj", "2022"], value: baseVal + Math.floor(Math.random() * 10) },
                { month: ["Czerwiec", "2022"], value: baseVal + Math.floor(Math.random() * 10) },
                { month: ["Sierpień", "2022"], value: baseVal + Math.floor(Math.random() * 10) },
                { month: ["Wrzesień", "2022"], value: baseVal + Math.floor(Math.random() * 10) },
                { month: ["Październik", "2022"], value: baseVal + Math.floor(Math.random() * 10) },
                { month: ["Listopad", "2022"], value: baseVal + Math.floor(Math.random() * 10) },
                { month: ["Grudzień", "2022"], value: baseVal + Math.floor(Math.random() * 10) },
            ];
            return {
                status: 200,
                info: {
                    countIssued: countOfCurrentlyIssuedBooks,
                    countReturned: countOfReturnedBooks,
                    countLost: countOfLostBooks,
                    graphData: graphData,
                },
            };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.GETTING_BOOKS_STATS };
        }
    },
    getMembersPageStats: async () => {
        const membersRepository = getRepository(User);
        const groupsRepository = getRepository(Group);
        try {
            const members = await membersRepository.find({
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

            const groups = await groupsRepository.find();

            const membersCount = members.length;
            const groupsCount = groups.length;

            // let groupsMap = new Map();
            // members.forEach(({ userDetails: { group }, issueHistory }) => {
            //     if (!groupsMap.has(group.name)) groupsMap.set(group.name, issueHistory.length);
            //     else groupsMap.set(group.name, groupMap.get(group.name) + issueHistory.length);
            // });

            // sum total issues per group
            let groupsDict = {};
            groups.map((group) => (groupsDict[group.name] = 0));
            members.forEach(({ userDetails: { group }, issueHistory }) => {
                if (!groupsDict[group.name]) {
                    groupsDict[group.name] = issueHistory.length;
                } else {
                    groupsDict[group.name] += issueHistory.length;
                }
            });

            const bestGroup = [];
            for (let item in groupsDict) {
                bestGroup.push({ group: item, value: groupsDict[item] });
            }

            return {
                status: 200,
                info: {
                    membersCount: membersCount,
                    groupsCount: groupsCount,
                    bestGroup: bestGroup.sort((a, b) => b.value - a.value)[0],
                    graphData: bestGroup.sort((a, b) => {
                        let textA = a.group.toUpperCase();
                        let textB = b.group.toUpperCase();
                        return textA < textB ? -1 : textA > textB ? 1 : 0;
                    }),
                },
            };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.GETTING_MEMBERS_STATS };
        }
    },
    getIssuesPageStats: async () => {
        const issueRepository = getRepository(IssueHistory);
        try {
            const issues = await issueRepository.find();
            let nearCount = 0;
            let overdueCount = 0;
            issues.forEach((issue) => {
                if (!issue.returned) {
                    const daysTillReturn = dateDiffInDays(
                        new Date(new Date().toISOString()),
                        new Date(issue.expectedReturnDate)
                    );
                    if (daysTillReturn <= 2 && daysTillReturn > 0) nearCount++;
                    else if (daysTillReturn < 0) overdueCount++;
                }
            });
            return {
                status: 200,
                info: {
                    open: issues.filter((issue) => issue.returned === false).length,
                    near: nearCount,
                    overdue: overdueCount,
                },
            };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.GETTING_ISSUE_ALL };
        }
    },
};
