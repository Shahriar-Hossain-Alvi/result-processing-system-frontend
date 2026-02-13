import { FaCalendarAlt, FaChalkboardTeacher, FaCheckCircle, FaTasks } from "react-icons/fa";
import { FaBook, FaBuilding, FaUserGraduate, FaUsers, FaUserShield } from "react-icons/fa6";
import { GrTableAdd } from "react-icons/gr";
import { PiImageBrokenFill } from "react-icons/pi";


const AdminDashboardCards = ({ title, count }) => {

    const iconConfig = {
        "users": { icon: <FaUsers />, color: "blue-500", bg: "bg-blue-100" },
        "admins": { icon: <FaUserShield />, color: "red-500", bg: "bg-red-100" },
        "teachers": { icon: <FaChalkboardTeacher />, color: "green-500", bg: "bg-green-100" },
        "students": { icon: <FaUserGraduate />, color: "orange-500", bg: "bg-orange-100" },
        "departments": { icon: <FaBuilding />, color: "purple-500", bg: "bg-purple-100" },
        "semesters": { icon: <FaCalendarAlt />, color: "pink-500", bg: "bg-pink-100" },
        "subjects": { icon: <FaBook />, color: "yellow-600", bg: "bg-yellow-100" },
        "assigned courses": { icon: <FaTasks />, color: "cyan-500", bg: "bg-cyan-100" },
        "marks": { icon: <GrTableAdd />, color: "emerald-500", bg: "bg-emerald-100" },
    };

    const config = iconConfig[title] || { icon: <PiImageBrokenFill />, color: "text-gray-400" }

    return (
        <div className="card card-border bg-white card-sm shadow-sm">
            <div className="card-body justify-between">
                {/* The Icon Container */}
                <div className={` text-2xl btn btn-circle btn-lg p-2 ${config.bg} text-${config.color}`}>
                    {config.icon}
                </div>

                <h2 className="card-title capitalize">{title}</h2>
                <h4 className='text-2xl'>{count}</h4>
            </div>
        </div>
    );
};

export default AdminDashboardCards;