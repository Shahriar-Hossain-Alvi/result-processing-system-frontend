import { useQuery } from '@tanstack/react-query';
import SectionHeader from '../../utils/SectionHeader/SectionHeader.jsx';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import CreateStudentTab from '../../components/pageComponents/AddUserPage/CreateStudentTab.jsx';
import CreateTeacherTab from '../../components/pageComponents/AddUserPage/CreateTeacherTab.jsx';

const AddUser = () => {
    const axiosSecure = useAxiosSecure();

    // fetch departments
    const { data: allDepartments, isLoading: isDepartmentsLoading, isError: isDepartmentsError } = useQuery({
        queryKey: ['allDepartments'],
        queryFn: async () => {
            const res = await axiosSecure('/departments/');
            return res.data;
        }
    })


    return (
        <div>
            <div className='place-self-center'>
                <SectionHeader section_title='User Registration' />
            </div>

            {/* name of each tab group should be unique */}
            <div className="tabs tabs-box place-self-center">
                <input type="radio" name="registration_tab" className="tab checked:font-bold checked:text-primary" aria-label="Student" defaultChecked />
                <div className="tab-content bg-base-100 border-base-300 md:p-6">
                    <CreateStudentTab allDepartments={allDepartments} isDepartmentsLoading={isDepartmentsLoading} isDepartmentsError={isDepartmentsError} />
                </div>

                <input type="radio" name="registration_tab" className="tab checked:text-primary checked:font-bold" aria-label="Teacher" />
                <div className="tab-content bg-base-100 border-base-300 md:p-6">
                    <CreateTeacherTab allDepartments={allDepartments} isDepartmentsLoading={isDepartmentsLoading} isDepartmentsError={isDepartmentsError} />
                </div>

                <input type="radio" name="registration_tab" className="tab checked:font-bold checked:text-primary" aria-label="Admin" />
                <div className="tab-content bg-base-100 border-base-300 md:p-6">Admin Registration Form</div>
            </div>
        </div>
    );
};

export default AddUser;