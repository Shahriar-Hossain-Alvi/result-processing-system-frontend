import { createContext, useEffect, useState } from "react";



// @ts-ignore
export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
    // get stored theme by default from local storage
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "corporate";
    })

    // save theme to local storage
    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.body.className = theme;
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;