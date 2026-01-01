import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import { DepartmentsSkeleton, SemestersSkeleton } from '../../components/ui/Skeletons.jsx';
import CreateDepartment from '../../components/pageComponents/DepartmentPage/CreateDepartment.jsx';
import CreateSemester from '../../components/pageComponents/DepartmentPage/CreateSemester.jsx';
import DepartmentTable from '../../components/pageComponents/DepartmentPage/DepartmentTable.jsx';
import SemesterTable from '../../components/pageComponents/DepartmentPage/SemesterTable.jsx';
import SectionHeader from '../../utils/SectionHeader/SectionHeader.jsx';

const DepartmentsAndSemesters = () => {
    const axiosSecure = useAxiosSecure();


    // DEPARTMENTS query
    const { data: allDepartments, isPending, error, isError, refetch: allDepartmentsRefetch } = useQuery({
        queryKey: ['allDepartments'],
        queryFn: async () => {
            const res = await axiosSecure('/departments/');
            return res.data;
        }
    })

    // SEMESTERS query
    const { data: totalSemesters, isPending: isSemesterPending, error: semesterError, isError: isSemesterError, refetch: totalSemestersRefetch } = useQuery({
        queryKey: ['totalSemesters'],
        queryFn: async () => {
            const res = await axiosSecure('/semesters/');
            return res.data;
        }
    })



    return (
        <div>
            {/* DEPARTMENTS */}
            <div>
                <div className='flex justify-between'>
                    <SectionHeader section_title='Departments' />

                    <CreateDepartment allDepartmentsRefetch={allDepartmentsRefetch} />
                </div>

                {(isPending) && <DepartmentsSkeleton />}
                {isError && <h4 className='text-error text-center text-lg'>An Error Occurred: {error?.message}</h4>}


                {/* departments table */}
                {
                    allDepartments?.length === 0 ?
                        <h4 className='text-error text-center text-lg'>No departments found</h4>
                        :
                        (!isPending && <DepartmentTable allDepartments={allDepartments} allDepartmentsRefetch={allDepartmentsRefetch} />)
                }
            </div>



            {/* SEMESTERS */}
            <div className='mt-10'>

                <div className='flex justify-between'>
                    <SectionHeader section_title='Semesters' />

                    <CreateSemester totalSemestersRefetch={totalSemestersRefetch} />
                </div>

                {(isSemesterPending) && <SemestersSkeleton />}
                {isSemesterError && <h4 className='text-error text-center text-lg'>An Error Occurred: {semesterError?.message}</h4>}
                {
                    totalSemesters?.length === 0 ?
                        <h4 className='text-error text-center text-lg'>No semesters found</h4>
                        :
                        (!isSemesterPending && <SemesterTable totalSemesters={totalSemesters} totalSemestersRefetch={totalSemestersRefetch} />)
                }


            </div>
        </div >
    );
};

export default DepartmentsAndSemesters;