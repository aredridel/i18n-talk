require('intl');
require('intl/locale-data/jsonp/en.js');
require('intl/locale-data/jsonp/es.js');

var fetch = require('isomorphic-fetch');
var Promise = require('bluebird');
var Formatter = require('./formatter');
var render = require('./render');

var dramaticPause = 3000;

var lang = document.documentElement.getAttribute('lang');

var messages = fetch('/locales/' + lang + '.json').then(function (res) {
    return res.json();
});

Promise.join(messages, Promise.delay(dramaticPause)).spread(function (dict) {
    var formatter = new Formatter(dict);
    render(formatter);
});
