Package.describe({
  summary: "Wunderlist package",
  version: "0.1.0",
  name: "wunderlist"
});

Package.onUse(function (api) {
  api.addFiles('wunderlist.js', 'server');
  api.export('Wunderlist');
});