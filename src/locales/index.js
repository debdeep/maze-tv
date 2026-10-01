import { createI18n } from "vue-i18n";
import en from "./en.json";
import dt from "./dt.json";
export const i18n = createI18n({
    legacy: false,
    locale: "dt",
    messages: {
        en: en,
        dt: dt
    }
});