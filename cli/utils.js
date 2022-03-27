const { resolve, join, sep } = require('path');
const fs = require('fs');
const chalk = require('chalk');
const package = require('../package.json');

/**
 *
 * @param {string} path
 * @return {string[]} directories
 */
const getAllDirectories = (path) => {
  const result = [];

  const folders = fs
    .readdirSync(path, {
      withFileTypes: true,
    })
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('.'))
    .map((dirent) => resolve(join(path, dirent.name)));

  result.push(...folders);

  for (let i = 0; i < folders.length; i++) {
    result.push(...getAllDirectories(folders[i]));
  }

  return result;
};

/**
 *
 * @param {string[]} data A array of string to join
 * @param {{separator: string, replaceLastSeparator: string}} options
 * @returns {string | undefined} Return a string or undefined
 */
const joinBy = (data, options) => {
  if (data.length <= 1) return data.length ? data[0] : undefined;

  const defaultSeparator = options?.separator ?? ',';
  const replaceLastSeparator = options?.replaceLastSeparator ?? 'or';

  return data.slice(1, data.length).reduce((acc, curr, k) => {
    const isLast = k === data.length - 2;

    return `${acc}${
      isLast ? ` ${replaceLastSeparator} ` : `${defaultSeparator} `
    }${curr}`;
  }, data[0]);
};

/**
 *
 * @param {string} path
 */
const readFile = (path) => {
  if (!fs.existsSync(path)) throw new Error(`File not exists: ${path}`);
  return JSON.parse(fs.readFileSync(path, { encoding: 'utf8' }));
};

const logger = {
  error: (msg) =>
    console.log(chalk.hex('#e74c3c')(`[CLI][${package.name}]`, msg)),
  success: (msg) =>
    console.log(chalk.hex('#1abc9c')(`[CLI][${package.name}]`, msg)),
};

const bundles = getAllDirectories('src/scripts').map((item) => ({
  folder: item.split(sep).pop(),
  dir: item,
}));

module.exports = { getAllDirectories, joinBy, readFile, logger, bundles };
