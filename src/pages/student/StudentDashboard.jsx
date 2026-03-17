import SectionHeader from "../../utils/SectionHeader/SectionHeader.jsx";

const StudentDashboard = () => {
    return (
        <div>
            <SectionHeader section_title="Student Dashboard" />


            Plans to add these features: <br />
            1. Current Semester Stats: total subjects number & Published marks of Current semesters <br />
            2. Latest Published Result: Last Published result (notification or stored data) <br />
            3. Result Challenge Status: if any result is challenged then show the current challenge status <br />
        </div>
    );
};

export default StudentDashboard;