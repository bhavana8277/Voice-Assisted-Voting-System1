import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

function LanguageSelector() {

    const { language, setLanguage } = useContext(LanguageContext);

    return (

        <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
        >

            <option value="en">English</option>

            <option value="kn">ಕನ್ನಡ</option>

            <option value="hi">हिन्दी</option>

            <option value="te">తెలుగు</option>

            <option value="ta">தமிழ்</option>

        </select>

    );

}

export default LanguageSelector;