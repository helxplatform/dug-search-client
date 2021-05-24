import React from 'react';
import { render } from '@testing-library/react';
import App from './app';

test('renders header', () => {
  const { getByText } = render(<App />);
  const titleElement = getByText(/Semantic Search/i);
  expect(titleElement).toBeInTheDocument();
});
