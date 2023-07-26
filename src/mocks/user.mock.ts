import { v4 as uuidv4 } from 'uuid';
import { User } from '../types/user';

export const userFactory = (override?: Partial<User>): User => {
  return {
    id: uuidv4(),
    name: 'fake-name',
    avatarUrl: 'fake-avatarUrl',
    email: 'fake-email',
    password: 'fake-password',
    __DO_NOT_USE__password: 'fake-__DO_NOT_USE__password',
    ...override,
  };
};
