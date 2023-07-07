const fs = require('fs');
const test = require('ava');
const postcss = require('postcss');
const plugin = require('./index.js');

function compare(t, fixtureFilePath, expectedFilePath, options = {}, {
  warningCount = 0,
  warningContent = [],
} = {}){
  return postcss([ plugin(options) ])
    .process(
      readFile(`./fixtures/${fixtureFilePath}`),
      { from: fixtureFilePath }
    )
    .then(result => {
      const expected = result.css;
      const actual = readFile(`./expected/${expectedFilePath}`);
      t.is(expected, actual);
      t.is(result.warnings().length, warningCount);

      if (warningCount > 0) {
        result.warnings().forEach((warning, index) => {
          t.is(warning?.text, warningContent[index]);
        });
      }
    });
}

function readFile(filename) {
  return fs.readFileSync(filename, 'utf8');
}

test('drop :root selector', t => {
  return compare(t, 'basic.css', 'basic.css', {});
});

test('capture fallback definitions from :root', t => {
  return compare(t, 'with-fallback.css', 'with-fallback.css', {
    withFallbacks: true,
  });
});

  test('warn if withFallback is true and a non-variable property is found in :root', t => {
    return compare(t, 'with-fallback-warning.css', 'with-fallback-warning.css', {
      withFallbacks: true,
    }, { warningCount: 1, warningContent: ['Only custom properties can be preserved from :root'] });
});
