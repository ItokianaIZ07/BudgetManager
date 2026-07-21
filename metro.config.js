const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// On ajoute 'wasm' aux extensions de fichiers gérées par Metro
config.resolver.sourceExts.push('wasm');

module.exports = config;