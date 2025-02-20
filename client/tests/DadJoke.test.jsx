import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DadJoke from '../src/components/DadJoke';

describe('Dad Jokes', () => {
  test('Dad joke receives text', async () => {
    render(<DadJoke dadJoke={"Hi testing suite, I'm dad!"} />);
    const jokeElement = screen.getByText("Hi testing suite, I'm dad!");
    expect(jokeElement).toHaveTextContent("Hi testing suite, I'm dad!");
  });

  test('Dad joke classname is applied', async () => {
    render(<DadJoke dadJoke={"Hi testing suite, I'm dad!"} />);
    const dadJoke = screen.getByText("Hi testing suite, I'm dad!");
    expect(dadJoke).toHaveClass('dadJoke');
  });
});
