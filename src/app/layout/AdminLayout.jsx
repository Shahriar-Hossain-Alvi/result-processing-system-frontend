import { NavLink, useNavigate } from 'react-router-dom';
import DrawerSidebar from '../../components/ui/DrawerSidebar.jsx';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import { MdDashboard, MdLogout } from 'react-icons/md';
import useAuth from '../../hooks/useAuth.jsx';
import { FaBook, FaBuilding, FaUsers } from 'react-icons/fa6';
import { LuFileSpreadsheet, LuNotebookPen } from 'react-icons/lu';
import { RiUserAddFill } from 'react-icons/ri';
import { GrTableAdd } from 'react-icons/gr';
import useTheme from '../../hooks/useTheme.jsx';


const AdminLayout = () => {
    const [theme] = useTheme();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/signin');
    }

    const adminNavLinks =
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
                <NavLink end to="/admin" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Dashboard">
                    <MdDashboard className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Dashboard</p>
                </NavLink>
            </li>

            <li>
                <NavLink to="/admin/addUser" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Add User">
                    <RiUserAddFill className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Add User</p>
                </NavLink>
            </li>

            <li>
                <NavLink to="/admin/allUser" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="All User">
                    <FaUsers className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">All User</p>
                </NavLink>
            </li>

            <li>
                <NavLink to="/admin/marks" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Insert marks">
                    <GrTableAdd className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Insert and Edit Marks</p>
                </NavLink>
            </li>

            <li>
                <NavLink to="/admin/results" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Results">
                    <LuFileSpreadsheet className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Results</p>
                </NavLink>
            </li>

            {/* Subjects */}
            <li>
                <NavLink to="/admin/subjects" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Subjects">
                    <FaBook className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Subjects</p>
                </NavLink>
            </li>

            {/* Assign Subject */}
            <li>
                <NavLink to="/admin/assignedCourses" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Assign Subject">
                    <LuNotebookPen className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Courses Assignments</p>
                </NavLink>
            </li>

            {/* Departments & Semesters */}
            <li>
                <NavLink to="/admin/departmentsAndSemesters" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Departments & Semesters">
                    <FaBuilding className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Departments & Semesters</p>
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
            <DrawerSidebar navLinks={adminNavLinks} />
        </div>
    );
};

export default AdminLayout;