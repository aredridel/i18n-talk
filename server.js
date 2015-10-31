var express = require('express');
var path = require('path');
var hbs = require('hbs');
var hbsIntl = require('handlebars-intl');
var serveStatic = require('serve-static');

var app = express();

var engine = hbs.create();
hbsIntl.registerWith(engine);
app.engine("hbs",  engine.__express);

app.set("i18n", path.resolve(__dirname, 'locales'));

app.use(function selectLanguageForRequest(req, res, next) {
    var lang = req.query.lang || 'en';
    // Or use req.headers['Accept-Language']
    // Or use the user's account settings.
    // Or use multiple strategies.

    req.messages = require(path.resolve(__dirname, 'locales', lang + '.json'))
    next();
});

app.get('/', function (req, res) {
    res.render('hello.hbs', {
        messages: req.messages
    });
});

app.get('/bag', function (req, res) {
    res.render('bag.hbs', {
        messages: req.messages,
        items: req.query.items
    });
});

app.get('/app', function (req, res) {
    res.render('app.hbs', {
        lang: req.query.lang || 'en'
    });
});

app.use(serveStatic(__dirname));

app.listen(process.env.PORT || 8080);
