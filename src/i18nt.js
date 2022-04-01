/**
 * @author Dragan Jović
 */

/**
 * @typedef {Object} i18ntManager
 * @property {()=>string} extractor Function used to extract the language code from your desired source.
 * @property {(language:string)=>void} setter Function used to set the new language into your desired source.
 */

const i18nt = (() => {
  let _translations = undefined;
  let _default_language = undefined;
  let _manager = {
    extractor: () => document.location.hash.replace("#", ""),
    setter: (language) => {
      document.location.hash = language;
    },
  };

  /**
   * Performs the magical translation. Also prints a passive aggressive warning.
   * @returns void
   */
  function i18nt_translate() {
    if (document.readyState !== "complete" || !_translations) return;
    let language = _manager.extractor() || _default_language;
    if (!language) return;
    let elements = document.querySelectorAll("[data-i18nd]");

    for (let element of elements) {
      let label = element.getAttribute("data-i18nd");
      let translation = _translations[language][label];
      if (translation) {
        if (typeof translation === "string") element.innerText = translation;
        else if (
          typeof translation === "object" &&
          translation.target &&
          translation.content
        )
          element[translation.target] = translation.content;
      } else
        console.warn(
          `You seem to be using the tag ${label} without a translation for ${language}`
        );
    }
  }

  /**
   * Sets the internal state. Translation should contain a key for each of the supported languages and each should have all appropriate labels.
   * Missing fields are kept from previous config. Set them all or remember what you used earlier. Nothing prevents you from calling init multiple times,
   * maybe if you've loaded additional languages and want to add them.
   * @param {{translations:object, defaultLanguage:string, manager: i18ntManager} config
   */
  function i18nt_init(config) {
    _translations = config.translations || _translations;
    _default_language = config.defaultLanguage || _default_language;
    _manager = config.manager || _manager;
  }

  /**
   * This is mostly useless, but if you really don't wish to remember what target was and what content was, you can use this function.
   * @param {string} translatedContent Translated content that should be displayed
   * @param {string} targetAttribute Which attribute to set instead of the default innerText
   * @returns {{content:string, target:string}} Formatted element;
   */
  function i18nt_special_element(translatedContent, targetAttribute) {
    let result = {};
    result.content = translatedContent;
    result.target = targetAttribute;
    return result;
  }

  /**
   * Sets the new language. By default it triggers the re-translation.
   * @param {string} language New language, modifies the hash in the URL bar
   * @param {boolean} translateInstantly Specifies if the translation should be triggered instantly. You can do it manually later on if you wish.
   */
  function i18nt_switchLanguage(language, translateInstantly = true) {
    _manager.setter(language);
    if (translateInstantly) i18nt_translate();
  }

  return {
    translate: i18nt_translate,
    init: i18nt_init,
    specialElement: i18nt_special_element,
    switchLanguage: i18nt_switchLanguage,
  };
})();

/**
 * @type {{cookies:i18ntManager}}
 */
const i18ntManagers = {
  cookies: {
    extractor: () => {
      let cookie = document.cookie;
      let expr = /.*?language=(\w+).*?/;
      let match = cookie.match(expr);
      if (match && match[1]) return match[1];
      else return undefined; //useless, but I like it.
    },
    setter: (language) => {
      if (!document.cookie) {
        document.cookie = `language=${language};`;
        return;
      }
      let split = document.cookie.split(";").map((p) => p.trim());
      for (let i = 0; i < split.length; i++) {
        if (split[i].startsWith("language=")) {
          split[i] = `language=${language}`;
          break;
        }
      }
      document.cookie = split.join("; ");
    },
  },
};

Object.freeze(i18ntManagers);

document.addEventListener('readystatechange', i18nt.translate);
