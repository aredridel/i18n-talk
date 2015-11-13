# Nuts and bolts of internationalization

^ This isn’t the most fascinating topic, unless you care about people and whether they can use what you make.

----

# What is i18n?

Internationlization is the process of making your application able to handle multiple languages.

I, 18 letters, n.

i18n.

^ It’s also a really long word. 20 letters. An I, 18 less important letters, then an n.

^ There are actually two abbreviations you find when doing this work. I18n, internationalization, the process of making an application support multiple languages, and l10n, localization, which is making it work in _a_ specific locale.

----

# How many of you can read five languages?

^ I can pick the sounds out of that many at least.

----

# How many of you can read two languages?

^ My spanish is acceptable. Kinda.

----

# Just one?

^ Y’all are from the US, aren’t you?

----

# Supporting multiple languages is _hard_

-----

# Why do we do this?

-----

# Internationalization is accessibility

^ If your site is in English only, there are millions of people who cannot use it. In the United States _alone_

----

# Empathy

## Imagine you’re planning a vacation

^ Let’s do a little empathy practice here. I want you to imagine you’re trying to plan a big exciting vacation. You’ve saved up a nice little chunk of cash. Your lover is a doctor, and it’s been a stressful year, but you’ve two weeks for a holiday. You’ve always wanted to see the Grand Canyon, and the two of you decide to go. You have to decide whether to do a package tour, or decide to rent a camper, drive to the Grand Canyon, and go hiking.

----

# Empathy

## Grab your iPad, sit down on the patio in your house in El Pedregal, Mexico City.

----

# Empathy

## Type *vacaciones gran cañon* into google.com.mx.

^ What do you think your first obstacle is going to be? Put some hands up!

-----

### Human languages have some irregular bits.

```javascript
console.log("There are " + items.length + " " + (
    items.length == 1 ? "item" : "items"
) + " in your cart")
```

^ How many of you have done this?

---

## in Polish

istnieją 0 produkty w koszyku.
istnieje 1 produkt w koszyku.
istnieją 2 produkty w koszyku.
istnieją 3 produkty w koszyku.
istnieją 4 produkty w koszyku.
istnieje 5 produktów w koszyku

---

### Polish

```javascript
console.log((
    items.length == 0 ? "istnieją " + items.length + " produkty" :
    items.length == 1 ? "znajduje się " + items.length + " produkt" :
    items.length % 10 == 2 || items.length % 10 == 3 || items.length % 10 == 4 ?
        "istnieją " + items.length + " produkty" :
    "istnieje " + items.length + " produktów"
    ) + " w koszyku");
```

----

## We’ve created a monster

```javascript
console.log(
    lang == "pl" ? (
        items.length == 0 ? "istnieją " + items.length + " produkty" :
        items.length == 1 ? "znajduje się " + items.length + " produkt" :
        items.length % 10 == 2 || items.length % 10 == 3 || items.length % 10 == 4 ?
            "istnieją " + items.length + " produkty" :
        "istnieje " + items.length + " produktów"
        ) + " w koszyku"
    ) :
    lang == "en" ? (
        "There are " + items.length + " " + (items.length == 1 ? "item" : "items") + " in your cart"
    ) : "unsupported language"
);
```

----

```javascript
"dependencies": {
    "the-english-language": "^2015.0.0",
    "academie-francaise": "^2005.33.9"
}
```

Never make your code depend on English.

^ Who here has used rails? Ever had a model class called "Human"? Did you follow Rails demands and name the underlying table "humen"?

----

Because we’ve integrated this into our code, we have to scatter i18n into all sorts of places, deep and high in the stack.

----

Adding a new language means editing the entire codebase.

Translations take time. This means several edits.

Merge conflicts with every piece of the codebase that has user-visible text.

----

Let’s find a better way.

----

# MessageFormat

## (or `gettext`, or ...)

Push the list of cases out into each translation. Polish specifics go in the Polish language files. Programmers see only one string in the source code.

^ There are other message formatting libraries. This one’s my favorite. Use one.

----

Message formatters usually use a key in the source code, plus placeholder values to fill in numbers and dates.

Essentially, a function call.

----

English

```json
{
    "cart": {
        "items": "There are
            {items, number, =1 {item}, other {#items}}
            in your cart"
    }
}
```

----

Polish (as line-wrapped JSON)

```json
{
    "cart": {
        "items": "{items, number,
            one {znajduje się # produkt w koszyku.}
            few {istnieją # produkty w koszyku.}
            many {istnieje # produktów w koszyku}}"
    }
}
```
---

And in our code:

```javascript
formatMessage(messages.items.cart, items.length)
```

^ It turns out that most i18n tasks turn into lookup tables. Programmers are really tempted to get clever and treat them as code and to repeat as little as possible. My advice there is only do that if you think you can beat gzip. This is data, not program.

----

That was the easy part.

----

# Workflows

The hard part.

^ The first translation is the hardest. Finding all the words embedded in code somewhere and extracting the strings, that’s the first pass.

----

## The ongoing pain

Applications change over time.

^ Content is edited. User interface text is made clearer. Special cases are added. New features are edited in around the old ones.

----

`git commit -m 'updated translations for user interface'`

Not that simple.

^ This wouldn’t be so bad if you could just update the text in all the languages at once.

----

# Translation takes time.

^ A few days is typical of service bureaus. In-house can be hours if everyone’s colocated, but that’s almost never the case.

^ Turns out the people who speak Russian best tend to be in Russia. And the people who speak Mandarin best are in China.

^ At some point in your work, you will have some languages updated and others still pending.

^ In the mean time, you’ll have to keep track of what’s outstanding and what’s completed.

^ Work hard to make sure what is derived from what is clear, and make sure there’s no loops in there. It’s hard to catch errors when you can’t read the text that has been updated.

----

# Updates should flow one way

----

Decide on a definitive source translation.

Update that, then retranslate the changed pieces in each language.

^ If you need to have something localized to one country, put that variation in the source translation. Maybe mark that the translation need not exist for languages not spoken in that country, though chances are this doesn’t change your cost that much.

^ This is the irreduceable complexity of internationalization. You have n source files times m locales. Don’t make specialized content for special cases or certain locales a separate layer, you’ll only end up permuting it. Tuck it in with the source files, and keep the complexity from exploding.

Remember that you have to maintain any specialization.

----

# ¡Vamos a crearlo!

## So let’s do this!

----

`server.js`

```javascript
var express = require('express');
var path = require('path');

var app = express();

var hbs = require('hbs');
var hbsIntl = require('handlebars-intl');
var engine = hbs.create();
hbsIntl.registerWith(engine);
app.engine("hbs",  engine.__express);

app.listen(process.env.PORT || 8080);
```

----

```javascript
app.use(function selectLanguageForRequest(req, res, next) {
    var lang = req.query.lang || 'en';
    // Or use req.headers['Accept-Language']
    // Or use the user's account settings.
    // Or use multiple strategies.

    req.messages = require(path.resolve(__dirname, 'locales', lang + '.json'))
    next();
});
```

-----

### `views/hello.hbs`

```hbs
<!doctype html>
<p>{{formatMessage messages.hello}}</p>
```

### Handler

```javascript
app.get('/', function (req, res) {
    res.render('hello.hbs', {
        messages: req.messages
    });
});
```

----

### `locales/es.json`

```json
{
    "hello": "¡Hola al mundo!"
}
```

### `locales/en.json`

```json
{
    "hello": "Hello, World!"
}
```

----

Let’s try it out.

```sh
$ PORT=8080 npm start
$ curl http://localhost:$PORT
```

```html
<!doctype html>
<p>Hello, World!</p>
```

```sh
$ curl http://localhost:$PORT?lang=es
```

```html
<!doctype html>
<p>¡Hola al mundo!</p>
```

----

## Let’s add more

---

### English

```json
{
    "bag": "There {items, plural, one{is one item} other {are # items}} in your bag"
}
```

---

### Spanish

```json
{
    "bag": "Hay {items, plural, one {# itema} other {# itemas}} en su bolso"
}
```

^ You can see that we use the replacement tokens differently in each language -- English has two things that have to agree on number, Spanish only has one. In Russian, this would be one replacement with four cases. In Chinese, no variation at all. All this complexity is specific to each language, so we really do need the flexibility pushed out into the locale files, and not cluttering up the main body of our code.

----

### `views/bag.hbs`

```hbs
<!doctype html>
<p>{{formatMessage messages.bag items=items}}}</p>
```

### Handler

```javascript
app.get('/bag', function (req, res) {
    res.render('bag.hbs', {
        messages: req.messages,
        items: req.query.items
    });
});
```

----

```
http://localhost:8080/bag?items=2
```

```html
<!doctype html>
<p>There are 2 items in your bag</p>
```

```
http://localhost:8080/bag?items=1
```

```html
<!doctype html>
<p>There is 1 item in your bag</p>
```

```
http://localhost:8080/bag?items=2&lang=es
```

```html
<!doctype html>
<p>Hay 2 itemas en su bolso</p>
```

----

# Now let’s do it in the browser

---

```javascript
app.use('/locales',
    serveStatic(path.resolve(__dirname, 'locales')));
```

^ We need a way to get the content strings to the client. There are lots of strategies for this that work.

^ Embed them in the page as json inside a tag and parse.

^ Build language-specific application bundles -- swapping out the language files with each build, so you get an `app.es.js` and `app.en.js`

^ You can fetch the language files with an XHR or fetch() call. Set them with long caching and use cache-breaking techniques like hashes in the URLs to force a new fetch on updates. Let’s use a simple version of this this time.

----

```javascript
var MessageFormat = require('message-format');

function Formatter(dict) {
    this.dict = dict;
}

Formatter.prototype.format = function format(message, args) {
    if (!this.dict[message]) {
        console.warn('no translation found for', message);
    }

    message = this.dict[message] || message;

    return new MessageFormat(message).format(args);
}

module.exports = Formatter;
```

---


```javascript
// A trivial ‘render’ function for my component^Wapplication
module.exports = function render(formatter) {
    document.querySelector('p').innerText =
        formatter.format("bag", { items: 2});
}
```

----

```javascript
// Polyfills are scratchy
require('intl');
require('intl/locale-data/jsonp/en.js');
require('intl/locale-data/jsonp/es.js');

var fetch = require('isomorphic-fetch');
var Promise = require('bluebird');
var Formatter = require('./formatter');
var render = require('./render');
```

----

```javascript
var dramaticPause = 3000;

var lang = document.documentElement.getAttribute('lang');

var messages = fetch('/locale/' + lang + '.json').then(function (res) {
    return res.json();
});

messages.then(function (dict) {
    alert('A dramatic pause...');
    return Promise.delay(dramaticPause)).then(function () {
        var formatter = new Formatter(dict);
        render(formatter);
    });
});
```

----

```hbs
<!doctype html>
<html lang="{{ lang }}">
    <p>Loading...</p>
    <script src='built-app.js'></script>
</html>
```

----

# Angular?

Content service exposes key-value pairs. Supply some!

---

# Dust templating?

formatjs.io has `dust-intl`. It’s great, and supplies message formatting. Just supply text strings.

-----

# User Interface Concerns

* Finding word boundaries isn’t always easy
* Japanese sentences involving imported words can be very long
* German words get very long and finding good wrapping gets tricky
* Arabic and 8 other currently used scripts start on the right and go left.

----

# Culture Matters

* Names don’t work everywhere the same way they do in your country.
* Names don’t even work the way you think they do.
* Not everyone writes numbers the same way.

----

# Warnings

Language != locale

English is spoken in the US. English is spoken in the UK.

But we spell `colour` differently and we write our dates inside out in the US. Same language, different specifics. You can call the language with the local details a "locale".

---

BCP47 document from the IETF has a whole standard for identifiers for languages.

`en-US`

`en-UK`

`en`

`i-navajo`

`zh-CN-hanz`

----

# Tips for language tags

If you’re parsing a language expectation from an external source, you may have more or less to the language tag than you expect.

Use the `bcp47` module to parse them. Use `bcp47-serialize` to get them as a string again.

Canonicalize into a locale you support early on.

----

# Tips for language tags

Plan to do matching and fallback when you get a request for a language that’s close to one you support but not quite right.

----

# Tips for language tags

Pass locale tags as opaque strings whenever possible -- it’s far easier to get right.

```javascript
"en-US" // Better

{lang: 'en', region: 'US'} // You will make mistakes
```

Especially once you add `i-navajo` and `zh-CN-hanz`.

----

# Tips for long form

Handle long form content separately.

Use one language per file.

Keep it simple.

^ The additional complexity to show the right one and not re-use the format string system will be vastly dwarfed by the workflow simplicity of keeping long form content in simple files.

-----

# And in closing

Your native language isn’t the _right way_, it’s just _a way_.
