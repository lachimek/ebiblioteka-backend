import { getRepository, Like } from "typeorm";
import { ERROR } from "../constants/constants";
import { Language } from "../../entity/Language";
import { checkIfValidUUID } from "../utils/checkIfValidUUID";

export const LanguageService = {
    add: async (languageData: Language) => {
        const languageRepository = getRepository(Language);
        try {
            const newLanguage = languageRepository.create({
                language: languageData.language,
            });
            await languageRepository.save(newLanguage);

            return { status: 200, language: newLanguage };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.ADDING_LANGUAGE };
        }
    },
    get: async (searchQuery: string) => {
        const languageRepository = getRepository(Language);
        try {
            let language: Language = null;
            if (!checkIfValidUUID(searchQuery)) {
                language = await languageRepository.findOneOrFail({
                    where: [
                        {
                            language: Like(searchQuery),
                        },
                    ],
                });
            } else {
                language = await languageRepository.findOneOrFail({
                    id: searchQuery,
                });
            }

            return { status: 200, language: language };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.LANG_NOT_FOUND };
        }
    },
    all: async () => {
        const languageRepository = getRepository(Language);
        try {
            const languages = await languageRepository.find();

            return { status: 200, languages: languages };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.GETTING_LANG_ALL };
        }
    },
};
