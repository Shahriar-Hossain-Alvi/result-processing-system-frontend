import { Link, NavLink, useNavigate } from 'react-router-dom';
import DrawerSidebar from '../../components/ui/DrawerSidebar.jsx';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import { CiLogout } from 'react-icons/ci';
import { MdDashboard, MdLogout } from 'react-icons/md';
import useAuth from '../../hooks/useAuth.jsx';
import { FaBook, FaBuilding, FaUsers } from 'react-icons/fa6';
import { LuFileSpreadsheet, LuNotebookPen } from 'react-icons/lu';
import { RiUserAddFill } from 'react-icons/ri';
import { GrTableAdd } from 'react-icons/gr';


const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/signin');
    }

    const adminNavLinks =
        <ul className="menu w-full grow">

            {/* Close/Open Sidebar */}
            <li className='sm:hidden lg:block'>
                <label htmlFor="my-drawer-4" aria-label="open sidebar" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Open Sidebar">
                    {/* Sidebar toggle icon */}
                    <GoSidebarCollapse className='is-drawer-open:hidden w-4 h-4' />
                    <GoSidebarExpand className='is-drawer-close:hidden w-4 h-4' />
                    <p className='is-drawer-close:hidden transition duration-500 ease-in'>Close Sidebar</p>
                </label>

            </li>

            {/* Links */}
            <li>
                <Link to="/admin" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Dashboard">
                    <MdDashboard className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Dashboard</p>
                </Link>
            </li>


            <li>
                <Link to="/admin/departmentsAndSemesters" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Departments & Semesters">
                    <FaBuilding className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Departments & Semesters</p>
                </Link>
            </li>

            <li>
                <Link to="/admin/subjects" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Subjects">
                    <FaBook className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Subjects</p>
                </Link>
            </li>

            <li>
                <Link to="/admin/assignSubject" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Assign Subject">
                    <LuNotebookPen className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Assign Subject</p>
                </Link>
            </li>

            <li>
                <Link to="/admin/addUser" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Add User">
                    <RiUserAddFill className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Add User</p>
                </Link>
            </li>

            <li>
                <Link to="/admin/allUser" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="All User">
                    <FaUsers className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">All User</p>
                </Link>
            </li>

            <li>
                <Link to="/admin/insertMarks" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Insert marks">
                    <GrTableAdd className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Insert marks</p>
                </Link>
            </li>

            <li>
                <Link to="/admin/results" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Results">
                    <LuFileSpreadsheet className='w-4 h-4' />
                    <p className="is-drawer-close:hidden">Results</p>
                </Link>
            </li>

            {/* logout button */}
            <li className='mt-5'>
                <button onClick={handleLogout} className="is-drawer-close:tooltip is-drawer-close:tooltip-right btn btn-error is-drawer-close:btn-sm is-drawer-open:rounded-none" data-tip="Logout">

                    <MdLogout className='w-4 h-4' />
                    <p className="is-drawer-close:hidden text-black">Logout</p>
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