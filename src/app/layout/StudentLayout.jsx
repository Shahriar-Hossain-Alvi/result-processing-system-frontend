import { NavLink, useNavigate } from 'react-router-dom';
import DrawerSidebar from '../../components/ui/DrawerSidebar.jsx';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import { MdDashboard, MdLogout } from 'react-icons/md';
import { RiUserAddFill } from 'react-icons/ri';
import { FaBook, FaUsers } from 'react-icons/fa6';
import { GrTableAdd } from 'react-icons/gr';
import { LuFileSpreadsheet } from 'react-icons/lu';
import useTheme from '../../hooks/useTheme.jsx';
import useAuth from '../../hooks/useAuth.jsx';

const StudentLayout = () => {
    const [theme] = useTheme();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/signin');
    }

    const studentNavLinks =
        <ul className="menu w-full grow">

            {/* Close/Open Sidebar */}
            <li className='lg:block'>
                <label htmlFor="my-drawer-4" aria-label="open sidebar" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Open Sidebar">
                    {/* Sidebar toggle icon */}
                    <GoSidebarCollapse className='is-drawer-open:hidden w-4 h-4' />
                    <GoSidebarExpand className='is-drawer-close:hidden w-4 h-4' />
                    <p className='is-drawer-close:hidden transition duration-500 ease-in'>Close Sidebar</p>
                </label>

            </li>

            {/* Links */}
            <li>
                <NavLink end to="/student" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Dashboard">
                    <MdDashboard className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Dashboard</p>
                </NavLink>
            </li>

            <li>
                <NavLink to="/student/profile" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Add User">
                    <RiUserAddFill className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Profile</p>
                </NavLink>
            </li>

            <li>
                <NavLink to="/student/my-courses" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Insert & edit marks">
                    <FaBook className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Offered Subjects</p>
                </NavLink>
            </li>

            <li>
                <NavLink to="/student/marks" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Insert & edit marks">
                    <GrTableAdd className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">All Marks</p>
                </NavLink>
            </li>

            <li>
                <NavLink to="/student/results" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Results">
                    <LuFileSpreadsheet className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Check Result</p>
                </NavLink>
            </li>


            {/* logout button */}
            <li className='mt-5'>
                <button onClick={handleLogout} className="is-drawer-close:tooltip is-drawer-close:tooltip-right btn btn-error is-drawer-close:btn-sm is-drawer-open:rounded-none" data-tip="Logout">

                    <MdLogout className={`w-4 h-4 ${theme === "light" ? "text-white" : "text-black"}`} />
                    <p className={`is-drawer-close:hidden ${theme === "light" ? "text-white" : "text-black"}`}>Logout</p>
                </button>
            </li>
        </ul>


    return (
        <div>
            <DrawerSidebar navLinks={studentNavLinks} />
        </div>
    );
};

export default StudentLayout;