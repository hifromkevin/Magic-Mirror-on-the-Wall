import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DadJoke from '../src/components/DadJoke';

test('Dad Joke', async () => {
  render(<DadJoke dadJoke={"Hi testing suite, I'm dad!"} />);
  const jokeElement = screen.getByText("Hi testing suite, I'm dad!");
  expect(jokeElement).toHaveTextContent("Hi testing suite, I'm dad!");
});
