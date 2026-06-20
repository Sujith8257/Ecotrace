import { render, screen } from '@testing-library/react';
import App from './App';
import { expect, test } from 'vitest';

test('renders EcoTrace AI title', () => {
  render(<App />);
  const heading = screen.getAllByText(/EcoTrace AI/i);
  expect(heading.length).toBeGreaterThan(0);
});
