# i18nt

Tiny Javascript library which can be used to translate simple plain HTML websites. The term library here is used loosely. It can also be used for larger projects, I can't stop you, but a more sophisticated solution may be a bit more appropriate. Not sure if anyone will find this useful, but I needed it so I figured I'd post it.

## Quick and dirty how-to

### How to use it?

Your target elements would preferably be elements where target text is just a bunch of text, no fancy hyperlinks in the middle of the sentence, no special formatting and such. Not to say that it can only translate `innerText` properties, more on that later. So, let's get to how-to:

You should define additional property on your elements. The property is `data-i18nd` and it should be set to the label you wish to use for your text, for example

```html
<div id="footer">
  <p class="classes..." data-i18nd="COPYRIGHT">Default text here</p>
</div>
```

Ok, now that we've got that sorted, you'll want to define your translations. Currently, it works with just the easiest one: JS.
If you look at the example you'll see an object `translations` which has keys `sr` and `en` for Serbian (latin) and English respectively. Each of those is a nested object which has all of the translation labels and their corresponding translations.

Once you've typed out those translations painstakingly, you wish to initialize i18nt by using the global `i18nt` object and calling it's `.init()` method. It takes in a configuration which contains the following properties:
| Key | Description |
| --- | ----------- |
| translations | The previously described translations object. It should contain all of the supported languages and each should have all of their strings translated. |
| defaultLanguage | The default language in case it has not already been set by the user. |
| manager | An instance of `i18ntManager`, more on this later. But if not set, by default it will use URL fragment, but can be set to use cookies or your custom solution. |

Now that that's set, you can call `i18nt.translate()` and it will translate your document. I'd recommend adding `i18nt.translate` as a handler for readystatechanged event, but this is not mandatory.

Predefined manager(s) are available in the `i18ntManagers` object and currently there's only one: cookies.

And last but not least: remember the remark about `innerText`? Well, here's the thing: you should also translate your aria-labels, tooltips and button elements which have `value` property holding the text. For those cases you can set translation to be something like:

```js
let translations = {
  lang: {
    MY_BUTTON_LABEL: { content: "Localized text", target: "value" },
  },
};
```

Where `target` is the attribute which holds the text that is displayed. If you dislike my naming, you can call the `i18nt.specialElement()` function which takes in the localized text as it's first argument, and target attribute as it's second so the above example becomes

```js
let translations = {
  lang: {
    MY_BUTTON_LABEL: i18nt.specialElement("Localized text", "value"),
  },
};
```
I know it didn't save you much typing, but it lets me forget what I used internally.

## Notes

Thank you for reading this, the readme has more text than the js file has code. This is a quick and easy solution and it's far from perfect.

## License

MIT Licensed.
