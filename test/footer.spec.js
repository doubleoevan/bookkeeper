// libraries
import React from 'react/addons';

// components
import { Footer } from '../src/components/footer';

// functions
import { expect } from 'chai';
import { describe, it } from 'mocha/lib/mocha';
const { renderIntoDocument, scryRenderedDOMComponentsWithTag } = React.addons.TestUtils;

describe('Navigation', () => {
  // return an href for the link at an index
  const toHref = (links, index) => {
    return links[index].getAttribute('href');
  };

  it('renders the footer with links', () => {
    // render the footer
    const footer = renderIntoDocument(
        <Footer />
    );

    // verify that the correct links are rendered
    const links = scryRenderedDOMComponentsWithTag(footer, 'a');
    expect(links.length).to.equal(4);
    expect(toHref(links, 0)).to.equal('https://facebook.github.io/react/');
    expect(toHref(links, 1)).to.equal('http://redux.js.org/');
    expect(toHref(links, 2)).to.equal('https://github.com/doubleoevan/bookkeeper');
    expect(toHref(links, 3)).to.equal(null); // a path link should not render without the router for now...
  });

  it('hides the privacy link on the privacy page', () => {
    // render the footer
    const footer = renderIntoDocument(
        <Footer currentPath="/privacy"/>
    );

    // verify that the correct links are rendered
    const links = scryRenderedDOMComponentsWithTag(footer, 'a');
    expect(links.length).to.equal(3);
    expect(toHref(links, 0)).to.equal('https://facebook.github.io/react/');
    expect(toHref(links, 1)).to.equal('http://redux.js.org/');
    expect(toHref(links, 2)).to.equal('https://github.com/doubleoevan/bookkeeper');
  });
});
