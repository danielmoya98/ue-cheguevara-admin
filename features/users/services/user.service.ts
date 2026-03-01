import { userRepository } from "../repositories/user.repository";

export const userService = {
    getUsers: async (filters?: { query?: string; role?: string }) => {
        return await userRepository.findAll(filters);
    }
};