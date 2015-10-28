Nuts and bolts of internationalization

----

This isn't the most fascinating topic.

----

Unless you care about people and whether they can use what you make.

----

Internationlization is the process of making your application able to handle multiple languages.

It's also a really long word. 20 letters. An I, 18 less important letters, then an n.

i18n.

----

How many of you can read five languages??

----

How many of you can read two languages?

----

Just one?

-----

Human languages have some irregular bits.

```
console.log("There are " + items.length + " " + (items.length == 1 ? "item" : "items") + " in your cart")
```

^ How many of you have done this?

---

And now in Russian:

```
// FIXME
console.log("There are " + items.length + " " + (
        items.length % 10 == 1 ? "item" :
        items.length % 10 == 2 ? "itemi" :
        items.length % 10 == 0 ? "itemo" : "items" ) + " in your cart")
```

----

We've created a monster

```
// FIXME
console.log(
    lang == "ru" ? (
        "There are " + items.length + " " + (
        items.length % 10 == 1 ? "item" :
        items.length % 10 == 2 ? "itemi" :
        items.length % 10 == 0 ? "itemo" : "items" ) + " in your cart"
    ) :
    lang == "en" ? (
        "There are " + items.length + " " + (items.length == 1 ? "item" : "items") + " in your cart"
    ) : "unsupported language"
);
```

----

Because we've integrated this into our code, we have to scatter i18n into all sorts of places, deep and high in the stack.

Let's find a better way.

----

# MessageFormat

(or `gettext`, or ...) FIXME

Push the list of cases out into each translation. 

^ There are other message formatting libraries. This one's my favorite.

----

```
"There are n items in your cart": "There are {items, number, 1 item, 2 itemi, 3 itemo, other items} in your cart"
```

And in our code:

```
formatMessage("There are n items in your cart", items)
```

^ It turns out that most i18n tasks turn into lookup tables.

----

That was the easy part.

----

# Workflows

The hard part.

^ The first translation is the hardest. Finding all the words embedded in code somewhere and extracting the strings, that's the first pass.

----

## The ongoing pain

Applications change over time.

^ Content is edited. User interface text is made clearer. Special cases are added. New features are edited in around the old ones.

----

`git commit -m 'updated translations for user interface'`

Not that simple.

^ This wouldn't be so bad if you could just update the text in all the languages at once.

----

# Translation takes time.

^ A few days is typical of service bureaus. In-house can be hours if everyone's colocated, but that's almost never the case.

^ Turns out the people who speak Russian best tend to be in Russia. And the people who speak Mandarin best are in China.

^ At some point in your work, you will have some languages updated and others still pending.

^ In the mean time, you'll have to keep track of what's outstanding and what's completed.

^ Work hard to make sure what is derived from what is clear, and make sure there's no loops in there. It's hard to catch errors when you can't read the text that has been updated.

----

# So let's do this!

## Vamos a crearlo!

----

`server.js`

```
var express = require('express');
var app = require('app');
var path = require('path');

app.views({
    "hbs": blah blah FIXME set up helper
});

app.set("i18n", path.resolve(__dirname, 'locales'));

app.listen(process.env.PORT || 8080);
```

----

```
app.use(function (req, res, next) {
    req.language = req.params.lang || 'en';
    // Or use req.headers['Accept-Language']
    // Or use the user's account settings.
    // Or use multiple strategies.
    next();
});
```

-----

`templates/hello.hbs`

```
<!doctype html>
<p>{{msg "Hello World"}}</p>
```

```
app.get('/', function (req, res) {
    res.render('hello');
});
```

----

`locales/es.json`

```
{
    "Hello World": "¡Hola al mundo!"
}
```

`locales/en.json`

```
{
    "Hello World": "Hello, World!"
}
```

----

Let's try it out.

```
$ PORT=8080 npm start
# curl http://localhost:8080
<!doctype html>
<p>Hello, World!</p>
# curl http://localhost:8080?lang=es
<!doctype html>
<p>¡Hola al mundo!</p>
```

----

Let's add more

`en`:

```
"There are n items in your bag":
    "There {items, number, 1 is, other are} {items} {items, number, 1 item, other items"} in your bag"
```

`es`: 
```
"There are n items in your cart":
    "Hay {items} {items, number, 1 itema, other itemas"} en su bolso"
```

^ You can see that we use the replacement tokens differently in each language -- English has two things that have to agree on number, Spanish only has one. In Russian, this would be one replacement with four cases. In Chinese, no variation at all. All this complexity is specific to each language, so we really do need the flexibility pushed out into the locale files, and not cluttering up the main body of our code.

----

`templates/bag.hbs`

```
<!doctype html>
<p>{{msg "There are n items in your bag", { items: items }}}</p>
```

```
app.get('/bag', function (req, res) {
    res.render('cart', { items: req.params.items });
});
```

----

```
$ PORT=8080 npm start
# curl http://localhost:8080/bag?items=2
<!doctype html>
<p>There are 2 items in your bag</p>
# curl http://localhost:8080/bag?items=1
<!doctype html>
<p>There is 1 item in your bag</p>
# curl http://localhost:8080/bag?items=2&lang=es
<!doctype html>
<p>Hay 2 itemas en su bolso</p>
```

----

Now let's do it client-side.

```
app.use('/locales', serveStatic(app.get('i18n')))
```

^ We need a way to get the content strings to the client. There are lots of strategies for this that work.

^ Embed them in the page as json inside a tag and parse.

^ Build language-specific application bundles -- swapping out the language files with each build, so you get an `app.es.js` and `app.en.js`

^ You can fetch the language files with an XHR or fetch() call. Set them with long caching and use cache-breaking techniques like hashes in the URLs to force a new fetch on updates. Let's use a simple version of this this time.

----
```
var formatMessage = require('message-format');
var Intl = require('intl-shim');

var dramaticPause = 3000;

var lang = document.documentElement.getAttribute('lang');
var x = new XMLHttpRequest('/locale/' + lang + '.json');
x.onready = function (wa wa wa FIXME) {
    Intl.loadContent(lang, body);
    setTimeout(render, dramaticPause);
};
x.send();
```

---

```
function render() {
    document.querySelector('p').innerText = formatMessage("There are n items in your bag", { items: 2});
}
```

----

```
<!doctype html>
<script src='app.js'>
<html lang="{{ lang }}">
    <p>Loading...</p>
</html>
```

----

# Angular?

Content service exposes key-value pairs. Supply some!

---

# Dust templating?

formatjs.io has `dust-intl`. It's great, and supplies message formatting. Just supply text strings.

-----

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

If you're parsing a language expectation from an external source, you may have more or less to the language tag than you expect.

Use the `bcp47` module to parse them. Use `bcp47-serialize` to get them as a string again.

Canonicalize into a locale you support early on.

Pass them as opaque strings whenever possible -- it's far easier to get right.

Plan to do matching and fallback when you get a request for a language that's close to one you support but not quite right.

