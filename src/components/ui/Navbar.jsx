import { NavLink } from 'react-router-dom';
import useTheme from '../../hooks/useTheme.jsx';
import { FaMoon, FaSun } from 'react-icons/fa6';
// @ts-ignore
import eduTrack_logo from "../../assets/edutrack_logo.png";
// @ts-ignore
import eduTrack_logo_white from "../../assets/edutrack_logo_white.png"

const Navbar = () => {
    // const [theme, setTheme] = useTheme();

    // toggle theme
    // const toggleTheme = (event) => {
    //     setTheme(event.target.checked ? "corporate" : "dark");
    // }

    return (
        <div>
            <div id='navbar' className="navbar bg-base-100 shadow-sm ">
                <div className="flex-1">
                    <NavLink to="/" className="text-xl">
                        <img src={eduTrack_logo} className='max-h-20 w-28' alt="edutrack logo" />
                        {/* {
                            theme == "dark" ?
                                <img src={eduTrack_logo_white} className='max-h-20 w-28' alt="edutrack logo" /> :
                                <img src={eduTrack_logo} className='max-h-20 w-28' alt="edutrack logo" />
                        } */}
                    </NavLink>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li><NavLink to="/notice" target='_blank'>Notice</NavLink></li>
                        <li><NavLink to="/contact" target='_blank'>Contact</NavLink></li>
                        <li><NavLink to="/faculties" target='_blank'>Faculties</NavLink></li>
                        {/* <li><ThemeSwitch changeTheme={toggleTheme} /></li> */}
                        {/* <li className='my-auto hover:bg-transparent group/theme'> */}
                        {/* <label className="swap swap-rotate"> */}
                        {/* this hidden checkbox controls the state */}
                        {/* <input type="checkbox" className="theme-controller" value="corporate" onChange={toggleTheme} /> */}

                        {/* rotate-90 */}
                        {/* <FaSun className='swap-on group-hover/theme:rotate-360 group-hover/theme:transition-all' /> */}
                        {/* <FaMoon className='swap-off rotate-217 group-hover/theme:rotate-0 group-hover/theme:transition-all' /> */}
                        {/* </label> */}
                        {/* </li> */}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;