import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth.jsx';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import errorMessageParser from '../../utils/errorMessageParser/errorMessageParser.js';
import SectionHeader from '../../utils/SectionHeader/SectionHeader.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';


const MyAssignedCourses = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: assignedCourses, isPending, isError, error } = useQuery({
        queryKey: ['assignedCourses'],
        queryFn: async () => {
            const res = await axiosSecure(`/subject_offering/teachersAssignedSubjects/${user?.id}`);
            return res.data;
        },
        enabled: !!user
    })

    useEffect(() => {
        if (isError) {
            console.log(error);
            const message = errorMessageParser(error);
            toast.error(message || "Failed to fetch offered courses");
        }
    }, [isError])

    console.log(assignedCourses);

    return (
        <div>
            <SectionHeader section_title='My Offered Courses' />

            <div>
                {isPending && <LoadingSpinner />}
                {assignedCourses?.length === 0 && <h2 className="text-xl text-center text-error font-semibold">No Courses Assigned</h2>}
                {
                    !isPending && assignedCourses.length > 0 && assignedCourses?.map((assignedCourse, idx) => (
                        <div key={idx} className="mb-16">
                            <h2 className="text-center text-xl font-semibold"> Assigned to: {assignedCourse?.department_name.toUpperCase()}</h2>

                            <div className="overflow-x-auto">
                                <table className="table">
                                    {/* head */}
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Subject</th>
                                            <th>Code</th>
                                            <th className='text-center'>Credits</th>
                                            <th className='text-center'>Semester</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignedCourse?.subjects?.map((subject, number) => (
                                            <tr className="hover:bg-base-300" key={subject?.id}>
                                                <th>{number + 1}</th>
                                                <td>
                                                    {subject?.subject?.subject_title}
                                                    <span>{subject?.subject?.is_general === true && "(General)"}</span>
                                                </td>
                                                <td>{subject?.subject?.subject_code}</td>
                                                <td className='text-center'>{subject?.subject?.credits}</td>
                                                <td className='capitalize text-center'>{subject?.subject?.semester?.semester_name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default MyAssignedCourses;