import { getRepository, Like } from "typeorm";
import { ERROR } from "../constants/constants";
import { Author } from "../../entity/Author";
import { checkIfValidUUID } from "../utils/checkIfValidUUID";

export const AuthorService = {
    add: async (authorData: Author) => {
        const authorRepository = getRepository(Author);
        try {
            const newAuthor = authorRepository.create({
                name: authorData.name,
            });
            await authorRepository.save(newAuthor);

            return { status: 200, author: newAuthor };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.ADDING_AUTHOR };
        }
    },
    get: async (searchQuery: string) => {
        const authorRepository = getRepository(Author);
        try {
            let author: Author = null;
            if (!checkIfValidUUID(searchQuery)) {
                author = await authorRepository.findOneOrFail({
                    where: [
                        {
                            name: Like(searchQuery),
                        },
                    ],
                });
            } else {
                author = await authorRepository.findOneOrFail({
                    id: searchQuery,
                });
            }

            return { status: 200, author: author };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.AUTHOR_NOT_FOUND };
        }
    },
    all: async () => {
        const authorRepository = getRepository(Author);
        try {
            const authors = await authorRepository.find();

            return { status: 200, authors: authors };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.GETTING_AUTHORS_ALL };
        }
    },
};
