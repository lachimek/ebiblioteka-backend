import { getRepository, Like } from "typeorm";
import { ERROR } from "../constants/constants";
import { Publisher } from "../../entity/Publisher";
import { checkIfValidUUID } from "../utils/checkIfValidUUID";

export const PublisherService = {
    add: async (publisherData: Publisher) => {
        const publisherRepository = getRepository(Publisher);
        try {
            const newPublisher = publisherRepository.create({
                name: publisherData.name,
            });
            await publisherRepository.save(newPublisher);

            return { status: 200, publisher: newPublisher };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.ADDING_PUBLISHER };
        }
    },
    get: async (searchQuery: string) => {
        const publisherRepository = getRepository(Publisher);
        try {
            let publisher: Publisher = null;
            if (!checkIfValidUUID(searchQuery)) {
                publisher = await publisherRepository.findOneOrFail({
                    where: [
                        {
                            name: Like(searchQuery),
                        },
                    ],
                });
            } else {
                publisher = await publisherRepository.findOneOrFail({
                    id: searchQuery,
                });
            }

            return { status: 200, publisher: publisher };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.PUBLISHER_NOT_FOUND };
        }
    },
    all: async () => {
        const publisherRepository = getRepository(Publisher);
        try {
            const publishers = await publisherRepository.find();

            return { status: 200, publishers: publishers };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.GETTING_PUBLISHER_ALL };
        }
    },
};
