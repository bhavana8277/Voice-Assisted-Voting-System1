import { createContext, useState } from "react";

import en from "../languages/en.json";
import kn from "../languages/kn.json";
import hi from "../languages/hi.json";
import te from "../languages/te.json";
import ta from "../languages/ta.json";

export const LanguageContext = createContext();

function LanguageProvider({ children }) {

    const [language, setLanguage] = useState("en");

    const languages = {
        en,
        kn,
        hi,
        te,
        ta
    };

    return (

        <LanguageContext.Provider
            value={{
                language,
                setLanguage,
                text: languages[language]
            }}
        >

            {children}

        </LanguageContext.Provider>

    );

}

export default LanguageProvider;