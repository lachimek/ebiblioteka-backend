import { getRepository, Like } from "typeorm";
import { validate } from "isbn-util";
import * as ISBN from "isbn3";
import { Book } from "../../entity/Book";
import { ERROR } from "../constants/constants";
import { IBookData } from "../constants/IBookData";
import { Language } from "../../entity/Language";
import { Publisher } from "../../entity/Publisher";
import { Genre } from "../../entity/Genre";
import { Author } from "../../entity/Author";

export const BooksService = {
    add: async (bookData: IBookData) => {
        const booksRepository = getRepository(Book);
        const authorRepo = getRepository(Author);
        const langRepo = getRepository(Language);
        const pubRepo = getRepository(Publisher);
        const genreRepo = getRepository(Genre);
        console.log(bookData);

        try {
            if (!ISBN.parse(bookData.isbn).isValid) throw `Invalid isbn data ${bookData.isbn}`;
            //console.log([language, condition, publisher, genres]);
            //if ([language, publisher, genres].some((el) => el === undefined)) throw ERROR.FETCHED_DATA_NULL;

            const author = authorRepo.create({
                name: bookData.author.toLocaleLowerCase(),
            });
            await authorRepo.upsert(author, ["name"]);

            const lang = langRepo.create({
                language: bookData.language.toLocaleLowerCase(),
            });
            await langRepo.upsert(lang, ["language"]);

            const pub = pubRepo.create({
                name: bookData.publisher.toLocaleLowerCase(),
            });
            await pubRepo.upsert(pub, ["name"]);

            let genresToAdd: Genre[] = [];
            bookData.genres.search.forEach((genre) => {
                const g = new Genre();
                g.name = genre.toLocaleLowerCase();
                genresToAdd.push(g);
            });
            await genreRepo.upsert(genresToAdd, ["name"]);

            const book = new Book();
            book.isbn = bookData.isbn;
            book.title = bookData.title;
            book.publicationDate = bookData.publicationDate;
            book.author = author;
            book.language = lang;
            book.publisher = pub;
            book.genres = genresToAdd;
            book.description = bookData.description;

            if (bookData.id === "") await booksRepository.save(book);
            else await booksRepository.save({ id: bookData.id, ...book });

            return { status: 200, book: book };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.ADDING_BOOK, throwable: error };
        }
    },
    all: async () => {
        const booksRepository = getRepository(Book);
        try {
            const books = await booksRepository.find({
                relations: ["author", "genres", "language", "publisher", "issueHistory"],
                where: [{ deleted: false }],
            });

            return { status: 200, books: books };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.GETTING_BOOK_ALL };
        }
    },
    delete: async ({ id }: { id: string }) => {
        const booksRepository = getRepository(Book);
        try {
            const book = await booksRepository.save({ id: id, deleted: true });

            return { status: 200, book: book };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.DELETING_BOOK };
        }
    },
    get: async (params: any) => {
        // isbn w formie 978-4-87311-336-4 lub 9784873113364
        console.log(params);
        const booksRepository = getRepository(Book);
        try {
            if (params.isbn) {
                if (!ISBN.parse(params.isbn) || !ISBN.parse(params.isbn).isValid)
                    throw `Invalid isbn data ${params.isbn}`;
                const book = await booksRepository.findOne({
                    relations: ["author", "genres", "language", "publisher"],
                    where: [
                        { isbn: params.isbn, deleted: false }, //szukanie po isbn w formie podanej
                        { isbn: ISBN.parse(params.isbn).isbn13h, deleted: false }, //szukanie po isbn w formie przeciwnej do podanej
                    ],
                });
                return { status: 200, book: book };
            } else if (params.id) {
                const book = await booksRepository.findOne({
                    relations: ["author", "genres", "language", "publisher"],
                    where: [
                        { id: params.id, deleted: false }, //szukanie po id
                    ],
                });
                return { status: 200, book: book };
            } else {
                throw "ISBN nor ID provided " + params;
            }
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.GETTING_BOOK_ONE };
        }
    },
};
