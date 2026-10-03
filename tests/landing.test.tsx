import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it, vi} from 'vitest';
import {StoryLanding} from '../src/StoryLanding';

vi.mock('../src/api', () => ({readDraft: () => 'My saved Malaysian business brief', saveDraft: vi.fn()}));

function render(signedIn = false) {
  return renderToStaticMarkup(<StoryLanding onStart={() => {}} onLogin={() => {}} signedIn={signedIn} theme="light" onTheme={() => {}}/>);
}

describe('Lumo visual sales landing', () => {
  it('introduces one clear product and preserves the saved brief', () => {
    const html = render();
    expect(html.match(/<h1>/g)).toHaveLength(1);
    expect(html).toContain('Lumo. Your Malaysian');
    expect(html).toContain('sales agent.');
    expect(html).toContain('My saved Malaysian business brief');
    expect(html).toContain('minLength="10"');
    expect(html).toContain('maxLength="3000"');
  });
  it('makes the local multilingual demo explicit without claiming live delivery', () => {
    const html = render();
    expect(html).toContain('English, BM, 中文');
    expect(html).toContain('No account. No card. Preset replies.');
    expect(html).toContain('Preset demo. No real leads, orders or messages are sent.');
    expect(html).toContain('aria-label="Message the sample chatbot"');
    expect(html).toContain('aria-label="Restart sample conversation"');
  });
  it('discloses budget ceilings next to the monthly allowances, not only inside an accordion', () => {
    const html = render();
    const budget = html.indexOf('US$5 AI budget/month. Usage stops');
    expect(budget).toBeGreaterThan(0);
    expect(budget).toBeLessThan(html.indexOf('<details'));
    expect(html).toContain('3 generations, 50 replies, US$0.50 AI budget total');
    expect(html).toContain('Subscriptions open at launch.');
    expect(html).toContain('Renews automatically until cancelled.');
  });
  it('provides keyboard-labelled navigation, story controls and disclosure controls', () => {
    const html = render();
    expect(html).toContain('Skip to builder');
    expect(html).toContain('aria-controls="ls-mobile-nav"');
    expect(html).toContain('aria-current="step"');
    expect(html).toContain('aria-controls="ls-answer-0"');
    expect(html).toContain('data-story-step="4"');
    expect(html).not.toContain('Play sample story');
  });
  it('keeps the workspace entry for returning customers', () => {
    expect(render(true)).toContain('>Workspace</button>');
    expect(render(false)).toContain('>Log in</button>');
  });
  it('puts one usable conversation before the story and preserved builder', () => {
    const html = render();
    expect(html.match(/aria-label="Message the sample chatbot"/g)).toHaveLength(1);
    expect(html.indexOf('id="playground"')).toBeLessThan(html.indexOf('id="how-it-works"'));
    expect(html.indexOf('id="how-it-works"')).toBeLessThan(html.indexOf('id="builder"'));
    expect(html).toContain('Not just replies.');
    expect(html).toContain('Sales conversations.');
    expect(html).toContain('maxLength="500"');
    expect(html).toContain('Try this conversation');
  });
  it('connects approved prices to the answer without inventing a contact or checkout', () => {
    const html = render();
    expect(html).toContain('APPROVED PRODUCT RECORD');
    expect(html).toContain('From the approved record');
    expect(html).toContain('Contact details only with permission.');
    expect(html).toContain('Confirm colour &amp; delivery');
    expect(html).toContain('id="chapter-4"');
  });
});
