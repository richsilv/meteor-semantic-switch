Package.describe({
  name: 'richsilv:semantic-ui-switch',
  summary: 'Switch element plugin for Semantic-UI',
  version: '0.0.1',
  git: 'https://github.com/richsilv/meteor-semantic-switch'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.2.1');
  api.use('jquery', 'client')
  api.addFiles('switch.js', 'client');
  api.addFiles('switch.css', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('richsilv:semantic-ui-switch');
  api.addFiles('richsilv:semantic-ui-switch-tests.js');
});
