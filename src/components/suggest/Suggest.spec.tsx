// @vitest-environment jsdom

import { test, expect, beforeEach, afterEach, vi, describe } from 'vitest';
import userEvent from '@testing-library/user-event';
import { cleanup, render, fireEvent } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';

import { Suggest } from './Suggest';
import * as usersService from '../../services/users';
import { User } from '../../types/user';
import { usersFactory } from '../../mocks/users.mock';

let container: RenderResult;
let input: HTMLInputElement;
let list: HTMLUListElement;
let enableDebounce: HTMLInputElement;

beforeEach(async () => {
  container = render(<Suggest />);
  input = (await container.findByTestId('suggest-input')) as HTMLInputElement;
  list = (await container.findByTestId('suggest-list')) as HTMLUListElement;
  enableDebounce = (await container.findByTestId(
    'suggest-enable-debounce',
  )) as HTMLInputElement;
});

afterEach(cleanup);

describe('disabled debounce', () => {
  test('should display empty input', async () => {
    expect(input).toBeDefined();
    expect(input.value).toEqual('');
  });

  test('should display empty list suggestions', async () => {
    expect(list).toBeDefined();
    expect(list.children.length).toEqual(0);
  });

  test('should display all item in suggestions', async () => {
    vi.spyOn(usersService, 'findUsers').mockImplementation(async () =>
      usersFactory(3),
    );
    await userEvent.type(input, 'abc');
    expect(list.children.length).toEqual(3);
  });

  test('should display empty list of suggestions when fetching suggestions not completed', async () => {
    vi.spyOn(usersService, 'findUsers').mockImplementation(
      (): Promise<User[]> => {
        return new Promise((resolve) => {
          setTimeout(resolve, 100, usersFactory(3));
        });
      },
    );
    await userEvent.type(input, 'abc');
    expect(list.children.length).toEqual(0);
  });
});

describe('enabled debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should display empty list of suggestions when change query', async () => {
    // Given
    enableDebounce.checked = true;

    const findUsersSpy = vi
      .spyOn(usersService, 'findUsers')
      .mockImplementation((): Promise<User[]> => {
        return new Promise((resolve) => {
          setTimeout(resolve, 100, usersFactory(3));
        });
      });

    expect(findUsersSpy).toHaveBeenCalledTimes(0);

    // When
    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.change(input, { target: { value: 'b' } });
    fireEvent.change(input, { target: { value: 'c' } });

    await vi.runAllTimersAsync();

    // Then
    expect(list.children.length).toEqual(3);
    expect(findUsersSpy).toHaveBeenCalledTimes(1);

    // When
    fireEvent.change(input, { target: { value: 'q' } });
    fireEvent.change(input, { target: { value: 'w' } });
    fireEvent.change(input, { target: { value: 'e' } });

    // Then
    expect(findUsersSpy).toHaveBeenCalledTimes(1);
    expect(list.children.length).toEqual(0);
  });
});
