import VueI18n from "vue-i18n";
import Vue from "vue";
import en from "@/langs/en.json";
import de from "@/langs/de.json";

function getUserLang() {
  return (
    window.navigator.language ||
    window.navigator.userLanguage ||
    "en"
  ).split("-")[0];
}

Vue.use(VueI18n);
export const i18n = new VueI18n({
  locale: getUserLang(),
  fallbackLocale: "en",
  messages: { en, de },
});
