import { NavLink, useNavigate } from 'react-router-dom';
import DrawerSidebar from '../../components/ui/DrawerSidebar.jsx';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import { RiUserAddFill } from 'react-icons/ri';
import { FaBook } from 'react-icons/fa6';
import { GrTableAdd } from 'react-icons/gr';
import { LuFileSpreadsheet } from 'react-icons/lu';
import { MdLogout } from 'react-icons/md';
import useTheme from '../../hooks/useTheme.jsx';
import useAuth from '../../hooks/useAuth.jsx';

const TeacherLayout = () => {
    const [theme] = useTheme();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/signin');
    }

    const teacherNavLinks =
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
                <NavLink end to="/teacher" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Add User">
                    <RiUserAddFill className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Profile</p>
                </NavLink>
            </li>

            <li>
                <NavLink to="/teacher/my-courses" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Insert & edit marks">
                    <FaBook className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Offered Subjects</p>
                </NavLink>
            </li>

            <li>
                <NavLink to="/teacher/marks" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Insert & edit marks">
                    <GrTableAdd className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Insert Marks</p>
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
            <DrawerSidebar navLinks={teacherNavLinks} />
        </div>
    );
};

export default TeacherLayout;