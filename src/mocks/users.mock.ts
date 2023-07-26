import { userFactory } from './user.mock';

export const usersFactory = (size = 3) => {
  return Array.from({ length: size }).map(() => userFactory());
};
