import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SingleHeadline from '../src/components/SingleHeadline';

describe('Single Headline', () => {
  test('Single Headline with author', async () => {
    render(
      <SingleHeadline
        headline={{ title: 'This is a title', author: 'Jones, Bob' }}
      />
    );
    const displaysTitle = screen.getByText('This is a title');
    const displaysAuthor = screen.getByText(', By Jones, Bob');
    expect(displaysTitle).toHaveTextContent('This is a title');
    expect(displaysAuthor).toHaveTextContent(', By Jones, Bob');
  });

  test('Single Headline without author', async () => {
    render(
      <SingleHeadline headline={{ title: 'This is a title', author: '' }} />
    );
    const displaysTitle = screen.getByText('This is a title');
    const authorElement = screen.getByText((content, element) => {
      return element.className === 'singleHeadline__author' && content === '';
    });
    expect(displaysTitle).toHaveTextContent('This is a title');
    expect(authorElement).toBeEmptyDOMElement();
  });

  test('News icon appears with correct alt text', async () => {
    render(
      <SingleHeadline
        headline={{ title: 'This is a title', author: 'Jones, Bob' }}
      />
    );
    const image = screen.getByAltText('This is a title');
    expect(image).toBeInTheDocument();
  });

  test('Correct classnames are applied', async () => {
    render(
      <SingleHeadline
        headline={{ title: 'This is a title', author: 'Jones, Bob' }}
      />
    );
    const displaysTitle = screen.getByText('This is a title');
    const displaysAuthor = screen.getByText(', By Jones, Bob');
    expect(displaysTitle).toHaveClass('singleHeadline__title');
    expect(displaysAuthor).toHaveClass('singleHeadline__author');
  });
});
