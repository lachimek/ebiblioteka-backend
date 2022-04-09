import { getRepository, Like, getManager } from "typeorm";
import { ERROR } from "../constants/constants";
import { IssueHistory } from "../../entity/IssueHistory";
import { checkIfValidUUID } from "../utils/checkIfValidUUID";
import { Book } from "../../entity/Book";
import { User } from "../../entity/User";

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
            const issues = await issueRepository.find();

            return { status: 200, issues: issues };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.GETTING_LANG_ALL };
        }
    },
};
