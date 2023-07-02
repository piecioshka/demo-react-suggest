import { User } from '../types/user';
import { makeRequest } from '../utils/makeRequest';

const usersUrl = 'https://fakes.piecioshka.io/users';

export const getUsers = async (): Promise<User[]> => {
  return await makeRequest(usersUrl);
};

export const findUsers = async (
  phrase: string,
  options: RequestInit = {},
): Promise<User[]> => {
  return await makeRequest(`${usersUrl}?q=${phrase}`, options);
};
