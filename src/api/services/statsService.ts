import { getRepository, Like } from "typeorm";
import { Book } from "../../entity/Book";
import { IssueHistory } from "../../entity/IssueHistory";
import { ERROR } from "../constants/constants";

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
};
