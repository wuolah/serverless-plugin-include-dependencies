'use strict';

const path = require('path');

const test = require('ava');

const getDependencyList = require('../get-dependency-list.js');

test('includes a deep dependency', (t) => {
  const fileName = path.join(__dirname, 'fixtures', 'thing.js');

  const list = getDependencyList(fileName);

  t.true(list.some(item => item.match(/jwa/)));
});

test('handles relative/project dependency', (t) => {
  const fileName = path.join(__dirname, 'fixtures', 'other', 'other-thing.js');

  const list = getDependencyList(fileName);

  t.true(list.some(item => item.match(/jwa/)));
});

test('should include local files', (t) => {
  const fileName = path.join(__dirname, 'fixtures', 'other', 'other-thing.js');

  const list = getDependencyList(fileName);

  t.true(list.some(item => path.basename(item) === 'other-thing.js'));
  t.true(list.some(item => path.basename(item) === 'thing.js'));
});

test('should include packages with no main', (t) => {
  const fileName = path.join(__dirname, 'fixtures', 'babel.js');

  const list = getDependencyList(fileName);

  t.true(list.some(item => path.basename(item) === 'babel.js'));
  t.true(list.some(item => item.match(/babel-runtime/)));
  t.true(list.some(item => item.match(/babel-polyfill/)));
});

test('handles requiring dependency file', (t) => {
	const fileName = path.join(__dirname, 'fixtures', 'dep-file.js');

	const list = getDependencyList(fileName);

	t.true(list.some(item => item.match(/test-dep/)));
});

test('handles requiring dependency file in scoped package', (t) => {
	const fileName = path.join(__dirname, 'fixtures', 'scoped-dep-file.js');

	const list = getDependencyList(fileName);

	t.true(list.some(item => item.indexOf(`@test/scoped-dep`) !== -1));
});

test('should handle requires with same relative path but different absolute path', (t) => {
  const fileName = path.join(__dirname, 'fixtures', 'same-relative-require.js');

  const list = getDependencyList(fileName);

  t.true(list.some(item => item.indexOf(`bar/baz.js`) !== -1));
  t.true(list.some(item => item.indexOf(`foo/baz.js`) !== -1));
});
