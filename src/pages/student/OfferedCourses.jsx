import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure.jsx";
import useAuth from "../../hooks/useAuth.jsx";
import SectionHeader from "../../utils/SectionHeader/SectionHeader.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import { useEffect } from "react";
import errorMessageParser from "../../utils/errorMessageParser/errorMessageParser.js";
import { toast } from "react-hot-toast";

const OfferedCourses = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: offeredCourses, isPending, isError, error } = useQuery({
        queryKey: ['offeredCourses'],
        queryFn: async () => {
            const res = await axiosSecure(`/subject_offering/studentsOfferedSubjects/${user?.id}`);
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


    return (
        <div>
            <SectionHeader section_title='My Offered Courses' />

            <div className="bg-base-100 sm:p-4 rounded-xl py-5">
                {isPending && <LoadingSpinner />}
                {offeredCourses?.length === 0 && <h2 className="text-xl text-center text-error font-semibold">No Offered Courses found</h2>}
                {
                    !isPending && offeredCourses.length > 0 && offeredCourses?.map((offeredCourse, idx) => (
                        <div key={idx} className="mb-5">
                            <h2 className="uppercase text-center text-xl font-semibold">{offeredCourse?.semester_name} Semester</h2>

                            <div className="overflow-x-auto">
                                <table className="table table-sm sm:table-md">
                                    {/* head */}
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Subject</th>
                                            <th>Code</th>
                                            <th>Teacher</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-xs sm:text-base">
                                        {offeredCourse?.subjects?.map((subject, number) => (
                                            <tr className="hover:bg-base-300" key={subject?.id}>
                                                <th>{number + 1}</th>
                                                <td>{subject?.subject?.subject_title}</td>
                                                <td>{subject?.subject?.subject_code}</td>
                                                <td>{subject?.taught_by?.name} <br />
                                                    <span className="opacity-70 uppercase">From {subject?.taught_by?.department?.department_name.split('-')[0]} department</span>
                                                </td>
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

export default OfferedCourses;