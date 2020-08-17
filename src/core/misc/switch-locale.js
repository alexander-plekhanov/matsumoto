import i18n from "i18next";
import { windowLocalStorage } from "core/misc/window-storage";

import View from "stores/view-store";

export const switchLocale = lng => {
    View.setOpenDropdown(null);
    i18n.changeLanguage(lng);
    windowLocalStorage.remove("direction"); //todo: temporary cleaning, remove any time
    windowLocalStorage.set("locale", lng);
    window.setPageDirectionFromLS();
};