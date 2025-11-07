import { render, screen } from '@testing-library/react';
import App from './App';

test('renders KOLIBRI.AI application', () => {
  render(<App />);
  const headerElements = screen.getAllByText(/KOLIBRI.AI/i);
  expect(headerElements.length).toBeGreaterThan(0);
});
