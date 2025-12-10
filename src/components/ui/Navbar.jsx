import { NavLink } from 'react-router-dom';
import ThemeSwitch from './ThemeSwitch';
import useTheme from '../../hooks/useTheme';
import { FaMoon, FaSun } from 'react-icons/fa6';

const Navbar = () => {
    const [theme, setTheme] = useTheme();

    // toggle theme
    const toggleTheme = (event) => {
        setTheme(event.target.checked ? "dark" : "light");
    }

    return (
        <div>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl">daisyUI</a>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li><NavLink to="/notice">Notice</NavLink></li>
                        <li><NavLink to="/contact">Contact</NavLink></li>
                        <li><NavLink to="/faculties">Faculties</NavLink></li>
                        {/* <li><ThemeSwitch changeTheme={toggleTheme} /></li> */}
                        <li className='my-auto hover:bg-transparent group/theme'>
                            <label className="swap swap-rotate">
                                {/* this hidden checkbox controls the state */}
                                <input type="checkbox" className="theme-controller" value="light" onChange={toggleTheme} />
{/* rotate-90 */}
                                <FaSun className='swap-on group-hover/theme:rotate-360 group-hover/theme:transition-all' />
                                <FaMoon className='swap-off rotate-217 group-hover/theme:rotate-0 group-hover/theme:transition-all' />
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;