import { render, screen } from '@testing-library/react';
import App from './App';

test('renders KOLIBRI.AI header', () => {
  render(<App />);
  const headerElement = screen.getByText(/KOLIBRI.AI/i);
  expect(headerElement).toBeInTheDocument();
});
