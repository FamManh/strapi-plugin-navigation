const pluginPkg = require('../../package.json');

let pluginId = pluginPkg.name.replace(/^strapi-plugin-/i, '');
pluginId = pluginPkg.name.replace(/^@viconsol\/plugin-/i, '');

module.exports = pluginId;
