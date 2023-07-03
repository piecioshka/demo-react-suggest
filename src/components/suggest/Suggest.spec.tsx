// @vitest-environment jsdom

import { test, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Suggest } from './Suggest';

test('should display empty input', async () => {
  const container = render(<Suggest />);
  const item = await container.findByTestId('suggest-input');
  expect(item).toBeDefined();
  expect(item.value).toEqual('');
});
