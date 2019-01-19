'use strict';

const { createServer } = require('http');
const handler = require('serve-handler');
const { resolve, relative } = require('path');

const headers = [{
  source: '**',
  headers: [{
    key: 'Access-Control-Allow-Origin',
    value: '*'
  }, {
    key: 'Access-Control-Allow-Headers',
    value: 'Origin, X-Requested-With, Content-Type, Accept, Range'
  }]
}];

module.exports = ({ config, cli }, { path = 'public', port = 8000 }) => {
  const { servicePath } = config;
  const publicPath = resolve(servicePath, path);

  const handleRequest = async (req, res) => {
    return handler(req, res, {
      public: publicPath,
      cleanUrls: false,
      headers,
      directoryListing: false,
      trailingSlash: true,
      renderSingle: false,
    });
  };

  const handleListening = (resolve) => () => {
    const relPath = relative(servicePath, publicPath);

    cli.consoleLog('');
    cli.log(`[ Static ] serving files from ${relPath} folder`);
    cli.log(`[ Static ] serving files on port ${port}`);
    cli.consoleLog('');
    resolve();
  };

  return new Promise((resolve) => {
    return createServer(handleRequest).listen(port, handleListening(resolve));
  });
};
