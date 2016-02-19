## In which I tell you why you should care about

# Internationalization

^ This isn’t the most fascinating topic, unless you care about people and whether they can use what you make.

----

# Internationalization

## making your application able to handle multiple languages.

^ It’s also a really long word. 20 letters. An I, 18 less important letters, then an n.

^ There are actually two abbreviations you find when doing this work. I18n, internationalization, the process of making an application support multiple languages, and l10n, localization, which is making it work in _a_ specific locale.

-----

# Why do we do this?

----

# How many of you can read five languages?

^ I don't mean programming languages here.

^ Let's see some hands!

^ I can pick the sounds out of that many at least.

----

# How many of you can read two languages?

^ My spanish is acceptable. Kinda.

----

# Just one?

^ You with your hands up, you are from the US, aren’t you?

-----

# Internationalization is accessibility

^ If your site is in English only, there are millions of people who cannot use it. In the United States _alone_

----

# A little empathy game

^ I want you to imagine something with me. Really think about it, get into someone else's shoes for a moment.

-----

## You’re planning a vacation

^ I want you to imagine you’re trying to plan a big exciting vacation. It's been a stressful year, but you have two weeks off.

----

## It's march, it's beautiful outside

^ You’ve saved up a nice little chunk of cash. You've always wanted to see the Grand Canyon, and you and someone close to you decide to go. You have to decide whether to do a package tour, or decide to rent a camper, drive to the Grand Canyon, and go hiking.

----

## Grab your iPad, sit down on the patio

---

## Pour a glass of wine and figure out this vacation.

----

## Type 

# `vacaciones gran cañon`

## into google.com.mx.

^ What do you think your first obstacle is going to be? Put some hands up!

^ First is that the do-it-yourself option has no translation. The US parks service has no information in spanish. The package tour companies do though!

-----

# Unreadable information is inaccessible

^ There's an ton of information about the grand canyon out there. The official information is English only. People capitalize on this and sell books and guides, but fundamentally, the original truth is going to take some work to read. It may not be worth it.

-----

## Another thing

# There are non-fluent speakers

It takes a long time to learn a language. It's stressful. It's hard enough to read but even harder to speak.

^ As a fluent reader, you're probably not afraid of paragraphs.

^ What about when you have to look up multiple words in a sentence?

^ What about when you're not sure whether the concepts are being linked together or not in each sentence.

----

## Remember 

# Dense writing is hard to read

^ As developers we can assume that people don't read; this is particularly true of application developers. If there's a message, or something unique, people will stop to read, but in general, humans take lots of approaches to interacting with the world and reading isn't actually the primary one. 

^ We experiment, we explore, we highlight things as we read, we click buttons to see what they do. We rarely read without interacting. The richer the environment, the more people will interact with it over reading any given text.

------

# Why we fail

^ The status quo is pretty bad.

-----

# Supporting multiple languages is _hard_

----

### Human languages are irregular.

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

^ There are tools for handling plurals in messages -- check out MessageFormat and the formatjs project

---

## The code is the easy part

---

## We fail because

# Accessibility is not a feature checkbox

------

# Process

## is the hard part.

^ This is hard in part because resources aren't allocated to do it right.

^ The first translation is the hardest. Finding all the words embedded in code somewhere and extracting the strings, that’s the first pass.

^ Ongoing maintenance, however...

----

## We fail because

# Translation takes time.

^ A few days is typical of service bureaus. In-house can be hours if everyone’s together, but that’s almost never the case.

^ Turns out the people who speak Russian best tend to be in Russia. And the people who speak Mandarin best are in China.

^ At some point in your work, you will have some languages updated and others still pending. And you keep developing your application.

^ In the mean time, you’ll have to keep track of what’s outstanding and what’s completed.

^ Work hard to make sure what is derived from what is clear, and make sure there’s no loops in there. It’s hard to catch errors when you can’t read the text that has been updated.

----

## You will lose track of it unless

# updates flow one way

^ Marketing wants to tweak some copy, but just in one language, or just for one area. Now we have to get that information into our source translation. 

^ Complexity shows up.

----

## Translations that only make sense in one context are harder to maintain

----

## We fail because

# we alienate our users

^ Accessibility is a process that means interacting with our users, specifically the users who struggle to use what we make.

^ We must include our users, all of them, as early as we can.

-----

## We fail because

# we forget culture matters

* Names don’t work everywhere the same way they do in your country.
* Names don’t even work the way you think they do.
* Not everyone writes numbers the same way.

----

## We fail because

# the world is a varied place

* English has so many words with similar meanings
* German words get very long and finding good wrapping gets tricky
* Japanese sentences involving imported words can be very long
* Arabic and 8 other currently used scripts start on the right and go left.

^ Seriously, go to `google.com.iq`. Also, be weirded out that your language preference sticks just by visiting that.

----

## In closing

# Your native language isn’t the _right way_, it’s just _a way_.
