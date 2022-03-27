#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const path = require('path');
const browserify = require('browserify');
const tsify = require('tsify');
const babelify = require('babelify');
const uglifyjs = require('uglify-js');
const package = require('../package.json');
const utils = require('./utils');

const folders = utils.bundles.map((item) => item.folder);

program.version(package.version);
program
  .command('build')
  .option('-n, --name [name]', 'Set a script name to build', ...folders)
  .description('This command will generate a output files in /public')
  .action(async ({ name }) => {
    if (!folders.includes(name)) {
      if (!folders.length) {
        utils.logger.error('Script name not defined or invalid.');
      } else if (folders.length === 1) {
        utils.logger.error(
          `Script name not defined or invalid. Please use "${folders[0]}".`
        );
      } else {
        utils.logger.error(
          `Script name not defined or invalid. Please use one of "${utils.joinBy(
            folders
          )}".`
        );
      }
      return;
    }

    const bundle = utils.bundles.find((item) => item.folder === name);
    if (!bundle) {
      utils.logger.error(`${name} not found on src/scripts`);
      return;
    }

    try {
      const configFile = `${bundle.dir}/config.json`;
      const bundleConfig = utils.readFile(configFile);
      const globalReference = bundleConfig['global-reference'];

      if (!globalReference) {
        utils.logger.error(`"global-reference" not defined on ${configFile}`);
      }

      browserify(bundle.dir, {
        standalone: globalReference,
      })
        .plugin(tsify, { noImplicitAny: true })
        .transform(babelify)
        .bundle((err, buf) => {
          if (err) {
            throw err;
          }

          const code = uglifyjs.minify(buf.toString(), {
            compress: true,
            keep_fnames: true,
          }).code;

          const output = `${path.dirname(
            __dirname
          )}/public/${globalReference.toLowerCase()}.min.js`;
          fs.writeFileSync(output, code, {
            encoding: 'utf8',
          });

          utils.logger.success(
            `Finished!\n\nGlobal Reference: ${globalReference}\nOutput: ${output}`
          );
        })
        .on('error', function (error) {
          utils.logger.error(error.toString());
        });
    } catch (err) {
      utils.logger.error(err.message);
    }
  });

program.parse(process.argv);
