import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { latestArticles, leadArticle } from '../src/lib/page-data.ts';

const post = (id, publishedAt, extra = {}) => ({ id, publishedAt, ...extra });
const hero = { src: '/x.webp', alt: 'x', kind: 'figure' };

test('the lead is the newest post that has a thumbnail', () => {
  const articles = latestArticles([
    post('old-with-hero', '2026-01-01', { hero }),
    post('new-note', '2026-03-01'),
    post('mid-with-hero', '2026-02-01', { hero }),
  ]);
  assert.equal(leadArticle(articles).id, 'mid-with-hero');
});

test('a featured post wins over a newer post with a thumbnail', () => {
  const articles = latestArticles([
    post('pinned', '2026-01-01', { featured: true }),
    post('newer', '2026-02-01', { hero }),
  ]);
  assert.equal(leadArticle(articles).id, 'pinned');
});

test('with several featured posts the newest one leads', () => {
  const articles = latestArticles([
    post('a', '2026-01-01', { featured: true, hero }),
    post('b', '2026-02-01', { featured: true }),
  ]);
  assert.equal(leadArticle(articles).id, 'b');
});

test('without thumbnails or featured posts the newest post leads', () => {
  const articles = latestArticles([post('a', '2026-01-01'), post('b', '2026-02-01')]);
  assert.equal(leadArticle(articles).id, 'b');
});

test('no posts, no lead', () => {
  assert.equal(leadArticle([]), undefined);
});

test('the published site leads with its newest post that has a thumbnail', { skip: !existsSync('generated/registry.json') }, () => {
  const registry = JSON.parse(readFileSync('generated/registry.json', 'utf8'));
  const articles = latestArticles(Array.isArray(registry) ? registry : registry.articles);
  const lead = leadArticle(articles);
  const featured = articles.filter((article) => article.featured);
  if (featured.length) return assert.equal(lead.id, featured[0].id);
  const withHero = articles.filter((article) => article.hero);
  assert.equal(lead.id, (withHero[0] ?? articles[0]).id);
  for (const article of articles) {
    if (article.id === lead.id) break;
    assert.equal(article.hero, undefined, `${article.id} is newer than the lead and has a thumbnail`);
  }
});

test('every thumbnail is an image of its own article body', { skip: !existsSync('generated/registry.json') }, () => {
  const registry = JSON.parse(readFileSync('generated/registry.json', 'utf8'));
  const articles = Array.isArray(registry) ? registry : registry.articles;
  const withHero = articles.filter((article) => article.hero);
  assert.ok(withHero.length > 0);
  for (const article of withHero)
    assert.ok(article.html.includes(`src="${article.hero.src}"`), `${article.id}: ${article.hero.src} is not in the article body`);
});
