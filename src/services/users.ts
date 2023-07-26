import { User } from '../types/user';
import { makeRequest } from '../utils/makeRequest';

const usersUrl = 'https://fakes.piecioshka.io/users';
const delayed = (url: string, time: number) =>
  `https://delay.piecioshka.io/delay?time=${time}&url=${url}`;

export const findUsers = async (
  phrase: string,
  options: RequestInit = {},
): Promise<User[]> => {
  const url = delayed(`${usersUrl}?q=${phrase}`, 500);
  return await makeRequest<User[]>(url, options);
};
