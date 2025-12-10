import { ThemeContext } from '../provider/ThemeProvider';
import { useContext } from 'react';

const useTheme = () => {
    const theme = useContext(ThemeContext);
    return [theme.theme, theme.setTheme];
};

export default useTheme;