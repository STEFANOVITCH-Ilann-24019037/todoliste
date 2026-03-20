import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the todo app', () => {
  render(<App />);

  expect(screen.getByText(/ma to-do list/i)).toBeInTheDocument();
  expect(screen.getByText(/modifier le dossier/i)).toBeInTheDocument();
  expect(screen.getByText(/supprimer/i)).toBeInTheDocument();
});
