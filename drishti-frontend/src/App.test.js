import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Drishti brand name', () => {
  render(<App />);
  const brand = screen.getAllByText(/drishti/i)[0];
  expect(brand).toBeInTheDocument();
});