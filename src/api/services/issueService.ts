import { getRepository, Like, getManager } from "typeorm";
import { ERROR } from "../constants/constants";
import { IssueHistory } from "../../entity/IssueHistory";
import { checkIfValidUUID } from "../utils/checkIfValidUUID";
import { Book } from "../../entity/Book";
import { User } from "../../entity/User";
import dateDiffInDays from "../utils/dateDiffInDays";

export const IssueService = {
    add: async (issueData: { bookId: string; userId: string; issueDate: string; expectedReturnDate: string }) => {
        try {
            let addedIssue = null;
            await getManager().transaction(async (transactionalEntityManager) => {
                const book = await transactionalEntityManager.findOneOrFail<Book>(Book, issueData.bookId);
                const user = await transactionalEntityManager.findOneOrFail<User>(User, issueData.userId);

                book.available = false;

                await transactionalEntityManager.save(book);
                addedIssue = await transactionalEntityManager.save(
                    transactionalEntityManager.create(IssueHistory, {
                        member: user,
                        book: book,
                        issueDate: issueData.issueDate,
                        expectedReturnDate: issueData.expectedReturnDate,
                    })
                );
            });
            if (addedIssue) return { status: 200, issue: addedIssue };
            else return { status: 404, error: ERROR.ADDING_ISSUE };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.ADDING_ISSUE };
        }
    },
    get: async (searchQuery: string) => {
        const issueRepository = getRepository(IssueHistory);
        try {
            let issue: IssueHistory = null;
            if (!checkIfValidUUID(searchQuery)) {
                issue = await issueRepository.findOneOrFail({
                    where: [
                        {
                            issue: Like(searchQuery),
                        },
                    ],
                });
            } else {
                issue = await issueRepository.findOneOrFail({
                    id: searchQuery,
                });
            }

            return { status: 200, issue: issue };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.LANG_NOT_FOUND };
        }
    },
    all: async () => {
        const issueRepository = getRepository(IssueHistory);
        const status = (issue: IssueHistory) => {
            const daysTillReturn = dateDiffInDays(
                new Date(new Date().toISOString()),
                new Date(issue.expectedReturnDate)
            );
            if (issue.returned) {
                return "returned";
            } else if (daysTillReturn > 2) {
                return "good";
            } else if (daysTillReturn <= 2 && daysTillReturn > 0) {
                return "near";
            } else {
                return "overdue";
            }
        };
        try {
            const issues = await issueRepository.find({
                join: {
                    alias: "issue",
                    leftJoinAndSelect: {
                        book: "issue.book",
                        member: "issue.member",
                        memberDetails: "member.userDetails",
                        memberGroup: "memberDetails.group",
                    },
                },
            });
            let formattedIssues = [];

            issues.forEach((issue) => {
                formattedIssues.push({
                    id: issue.id,
                    issueDate: issue.issueDate,
                    returnDate: issue.returnDate,
                    expectedReturnDate: issue.expectedReturnDate,
                    status: status(issue),
                    book: {
                        id: issue.book.id,
                        title: issue.book.title,
                        isbn: issue.book.isbn,
                    },
                    member: {
                        id: issue.member.id,
                        firstName: issue.member.userDetails.firstName,
                        lastName: issue.member.userDetails.lastName,
                        phone: issue.member.userDetails.phone,
                        groupName: issue.member.userDetails.group.name,
                    },
                });
            });

            return { status: 200, issues: formattedIssues };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.GETTING_ISSUE_ALL };
        }
    },
    overdues: async () => {
        const issueRepository = getRepository(IssueHistory);
        try {
            const issues = await issueRepository.find({
                join: {
                    alias: "issue",
                    leftJoinAndSelect: {
                        book: "issue.book",
                        member: "issue.member",
                        memberDetails: "member.userDetails",
                        memberGroup: "memberDetails.group",
                    },
                },
                where: { returned: false },
            });

            let formattedIssues = [];

            issues.forEach((issue) => {
                const daysTillReturn = dateDiffInDays(
                    new Date(new Date().toISOString()),
                    new Date(issue.expectedReturnDate)
                );
                if (daysTillReturn <= 2) {
                    formattedIssues.push({
                        id: issue.id,
                        issueDate: issue.issueDate,
                        returnDate: issue.returnDate,
                        expectedReturnDate: issue.expectedReturnDate,
                        overdue: daysTillReturn <= 0,
                        book: {
                            id: issue.book.id,
                            title: issue.book.title,
                            isbn: issue.book.isbn,
                            available: issue.book.available,
                            deleted: issue.book.deleted,
                        },
                        member: {
                            id: issue.member.id,
                            firstName: issue.member.userDetails.firstName,
                            lastName: issue.member.userDetails.lastName,
                            phone: issue.member.userDetails.phone,
                            groupName: issue.member.userDetails.group.name,
                        },
                    });
                }
            });

            return { status: 200, issues: formattedIssues };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.GETTING_ISSUE_ALL };
        }
    },
    returnIssue: async (issueId: string) => {
        try {
            let returnedIssue = null;
            await getManager().transaction(async (transactionalEntityManager) => {
                const foundIssue = await transactionalEntityManager.findOneOrFail<IssueHistory>(IssueHistory, {
                    join: {
                        alias: "issue",
                        leftJoinAndSelect: {
                            book: "issue.book",
                        },
                    },
                    where: { id: issueId },
                });
                foundIssue.returnDate = new Date();
                foundIssue.returned = true;

                const foundBook = await transactionalEntityManager.findOneOrFail<Book>(Book, foundIssue.book.id);
                foundBook.available = true;

                await transactionalEntityManager.save(foundBook);
                returnedIssue = await transactionalEntityManager.save(foundIssue);
            });
            console.log(returnedIssue);

            if (returnedIssue) return { status: 200, issue: returnedIssue };
            else return { status: 404, error: ERROR.RETURNING_ISSUE };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.RETURNING_ISSUE };
        }
    },
};
