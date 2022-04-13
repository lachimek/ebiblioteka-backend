import { getRepository, Like, getManager } from "typeorm";
import { ERROR } from "../constants/constants";
import { IssueHistory } from "../../entity/IssueHistory";
import { checkIfValidUUID } from "../utils/checkIfValidUUID";
import { Book } from "../../entity/Book";
import { User } from "../../entity/User";

const _MS_PER_DAY = 1000 * 60 * 60 * 24;
function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    console.log("diff", (utc2 - utc1) / _MS_PER_DAY);

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export const IssueService = {
    add: async (issueData: { bookId: string; userId: string; issueDate: string; returnDate: string }) => {
        try {
            let addedIssue = null;
            await getManager().transaction(async (transactionalEntityManager) => {
                const book = await transactionalEntityManager.findOneOrFail<Book>(Book, issueData.bookId);
                const user = await transactionalEntityManager.findOneOrFail<User>(User, issueData.userId);

                console.log("book: ", book);
                console.log("user: ", user);

                book.available = false;

                await transactionalEntityManager.save(book);
                addedIssue = await transactionalEntityManager.save(
                    transactionalEntityManager.create(IssueHistory, {
                        member: user,
                        book: book,
                        issueDate: issueData.issueDate,
                        returnDate: issueData.returnDate,
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
                const daysTillReturn = dateDiffInDays(new Date(new Date().toISOString()), new Date(issue.returnDate));
                if (daysTillReturn <= 2) {
                    formattedIssues.push({
                        id: issue.id,
                        issueDate: issue.issueDate,
                        returnDate: issue.returnDate,
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
};
