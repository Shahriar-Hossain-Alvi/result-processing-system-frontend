import { FaCalendarAlt, FaChalkboardTeacher, FaTasks } from "react-icons/fa";
import { FaBook, FaBuilding, FaUserGraduate, FaUsers, FaUserShield } from "react-icons/fa6";
import { GrTableAdd } from "react-icons/gr";
import { PiImageBrokenFill } from "react-icons/pi";
import useTheme from "../../hooks/useTheme.jsx";


const AdminDashboardCards = ({ title, count }) => {
    const [theme] = useTheme();

    const iconConfig = {
        "users": { icon: <FaUsers />, color: "text-blue-500", bg: `${theme == "light" ? "bg-blue-100" : "bg-base-300"}` },
        "admins": { icon: <FaUserShield />, color: "text-red-500", bg: `${theme == "light" ? "bg-red-100" : "bg-base-300"}` },
        "teachers": { icon: <FaChalkboardTeacher />, color: "text-green-500", bg: `${theme == "light" ? "bg-green-100" : "bg-base-300"}` },
        "students": { icon: <FaUserGraduate />, color: "text-orange-500", bg: `${theme == "light" ? "bg-orange-100" : "bg-base-300"}` },
        "departments": { icon: <FaBuilding />, color: "text-purple-500", bg: `${theme == "light" ? "bg-purple-100" : "bg-base-300"}` },
        "semesters": { icon: <FaCalendarAlt />, color: "text-pink-500", bg: `${theme == "light" ? "bg-pink-100" : "bg-base-300"}` },
        "subjects": { icon: <FaBook />, color: "text-yellow-600", bg: `${theme == "light" ? "bg-yellow-100" : "bg-base-300"}` },
        "assigned courses": { icon: <FaTasks />, color: "text-cyan-500", bg: `${theme == "light" ? "bg-cyan-100" : "bg-base-300"}` },
        "marks": { icon: <GrTableAdd />, color: "text-emerald-500", bg: `${theme == "light" ? "bg-emerald-100" : "bg-base-300"}` },
    };

    const config = iconConfig[title] || { icon: <PiImageBrokenFill />, color: "text-gray-400" }

    return (
        <div className="card card-border bg-base-100 card-sm shadow-sm">
            <div className="card-body justify-between">
                {/* The Icon Container */}
                <div className={` text-2xl btn btn-circle btn-lg p-2 ${config.bg} ${config.color}`}>
                    {config.icon}
                </div>

                <h2 className="card-title capitalize">{title}</h2>
                <h4 className='text-2xl'>{count}</h4>
            </div>
        </div>
    );
};

export default AdminDashboardCards;