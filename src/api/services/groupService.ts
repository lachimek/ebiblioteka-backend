import { getRepository, Like } from "typeorm";
import { ERROR } from "../constants/constants";
import { checkIfValidUUID } from "../utils/checkIfValidUUID";
import { Group } from "../../entity/Group";

export const GroupService = {
    add: async (groupData: Group) => {
        const groupRepository = getRepository(Group);
        try {
            const newGroup = groupRepository.create({
                name: groupData.name,
            });
            await groupRepository.save(newGroup);

            return { status: 200, group: newGroup };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.ADDING_GROUP };
        }
    },
    get: async (searchQuery: string) => {
        const groupRepository = getRepository(Group);
        try {
            let group: Group = null;
            if (!checkIfValidUUID(searchQuery)) {
                group = await groupRepository.findOneOrFail({
                    where: [
                        {
                            name: Like(searchQuery),
                        },
                    ],
                });
            } else {
                group = await groupRepository.findOneOrFail({
                    id: searchQuery,
                });
            }

            return { status: 200, group: group };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.GROUP_NOT_FOUND };
        }
    },
    all: async () => {
        const groupRepository = getRepository(Group);
        try {
            const groups = await groupRepository.find();

            return { status: 200, groups: groups };
        } catch (error) {
            console.log(error);
            return { status: 404, error: ERROR.GETTING_GROUPS_ALL };
        }
    },
};
