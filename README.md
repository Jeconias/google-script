## Google Script Template

A simple way of using Google Script with typescript based on minified CDN files.

### How to use

- `yarn start` will watch the `src` folder to rebuild the files to the `public` folder;
  - You can use `yarn start -n script_folder` to rebuild a specific script when files in `src` have changes.
- `yarn start:server` will start the local server on the default port (1717) and use Ngrok to provide a link to access `public` files;
- `yarn start:server:watch` will start the local server on the default port (1717) and will NOT start Ngrok, but watch the `server` folder;
- `yarn build` will call the CLI to build the scripts;
  - You need to build one script at a time;
  - The CLI accepts an argument `-n or --name` to identify a script folder and build;
  - Use `yarn build --help` to see more details.
- You can have multiple folders of scripts in `/src/scripts` and build each.

### Google Script

The example of code to use `Book` script on a sheet.

```js
const SCRIPT_URL = 'https://0ec6-168-194-177-3.ngrok.io/books.min.js';
const CACHE_KEY = 'script-contents';

function loadScript(ignoreCache) {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(CACHE_KEY);

  if (cached !== null && !ignoreCache) {
    Logger.log('Reusing cache');
    return cached;
  }

  Logger.log('Request a new Script');
  const result = UrlFetchApp.fetch(SCRIPT_URL).getContentText();
  cache.put(CACHE_KEY, result, 21600);

  return result;
}

function cacheLoad() {
  loadScript();
  onOpen();
}

function cacheUpdate() {
  loadScript(true);
}

function cacheRemove() {
  const cache = CacheService.getScriptCache();
  cache.remove(CACHE_KEY);
}

const SCRIPT_CONTROL = {
  instance: undefined,
  init: function () {
    if (this.instance) return this.instance;

    new Function(`return ${loadScript()}`)();

    this.instance = Books.default();
    return this.instance;
  },
};

function onOpen() {
  const menu = SpreadsheetApp.getUi().createMenu('Books Automation');

  try {
    loadScript();

    menu.addItem('List:Books', 'listBooks');
    menu.addSubMenu(
      SpreadsheetApp.getUi()
        .createMenu('Settings')
        .addItem('Update', 'cacheUpdate')
        .addItem('Remove', 'cacheRemove')
    );
  } catch {
    menu.addSubMenu(
      SpreadsheetApp.getUi().createMenu('Settings').addItem('Load', 'cacheLoad')
    );
  }
  // Render menu
  menu.addToUi();

  // Show informations
  SCRIPT_CONTROL.init().info();
}

function listBooks() {
  SCRIPT_CONTROL.init().books();
}
```

This example code works with `src/scripts/book`, try it yourself.

### Example

![google-script](https://user-images.githubusercontent.com/32512776/160265850-53c46bb8-f1fa-44d1-a9bf-9a993cc5fc97.gif)
