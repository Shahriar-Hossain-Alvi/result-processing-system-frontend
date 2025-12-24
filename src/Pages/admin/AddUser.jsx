import { useQuery } from '@tanstack/react-query';
import CreateStudentForm from '../../components/pageComponents/AddUserPage/CreateStudentForm.jsx';
import SectionHeader from '../../utils/SectionHeader/SectionHeader.jsx';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';

const AddUser = () => {
    const axiosSecure = useAxiosSecure();

    // fetch departments
    const { data: allDepartments, isLoading: isDepartmentsLoading, isError: isDepartmentsError } = useQuery({
        queryKey: ['allDepartments'],
        queryFn: async () => {
            const res = await axiosSecure('/departments');
            return res.data;
        }
    })


    return (
        <div>
            <SectionHeader section_title='User Registration' />

            {/* name of each tab group should be unique */}
            <div className="tabs tabs-box">
                <input type="radio" name="registration_tab" className="tab" aria-label="Student" defaultChecked />
                <div className="tab-content bg-base-100 border-base-300 p-6">
                    <CreateStudentForm allDepartments={allDepartments} isDepartmentsLoading={isDepartmentsLoading} isDepartmentsError={isDepartmentsError} />
                </div>

                <input type="radio" name="registration_tab" className="tab" aria-label="Teacher" />
                <div className="tab-content bg-base-100 border-base-300 p-6">Teacher Registration Form</div>

                <input type="radio" name="registration_tab" className="tab" aria-label="Admin" />
                <div className="tab-content bg-base-100 border-base-300 p-6">Admin Registration Form</div>
            </div>

            show full data: User Table + Their Table from last created user
        </div>
    );
};

export default AddUser;