import { getRepository, In, Like, QueryBuilder } from "typeorm";
import { ERROR } from "../constants/constants";
import { Genre } from "../../entity/Genre";
import { checkIfValidUUID } from "../utils/checkIfValidUUID";

export const GenreService = {
    add: async (genreData: Genre) => {
        const genreRepository = getRepository(Genre);
        try {
            const newGenre = genreRepository.create({
                name: genreData.name,
            });
            await genreRepository.save(newGenre);

            return { status: 200, genre: newGenre };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.ADDING_GENRE };
        }
    },
    get: async (searchQuery: { ids: boolean; search: string[] }) => {
        const genreRepository = getRepository(Genre);
        console.log("genre_log: ", searchQuery);
        try {
            let genres: Genre[] = null;
            if (searchQuery.ids) {
                genres = await genreRepository.find({ where: [{ id: In(searchQuery.search) }] });
            } else {
                genres = await genreRepository.find({ where: [{ name: In(searchQuery.search) }] });
            }
            return { status: 200, genres: genres };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.GENRE_NOT_FOUND };
        }
    },
    all: async () => {
        const genreRepository = getRepository(Genre);
        try {
            const genres = await genreRepository.find();

            return { status: 200, genres: genres };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.GETTING_GENRE_ALL };
        }
    },
};
