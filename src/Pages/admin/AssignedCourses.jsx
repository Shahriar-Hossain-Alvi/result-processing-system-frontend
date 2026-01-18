import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure.jsx";
import SectionHeader from "../../utils/SectionHeader/SectionHeader.jsx";
import CreateNewCourseAssignment from "../../components/pageComponents/AssignedCourses/CreateNewCourseAssignment.jsx";
import { useEffect } from "react";
import errorMessageParser from "../../utils/errorMessageParser/errorMessageParser.js";
import toast from "react-hot-toast";


const AssignedCourses = () => {
    const axiosSecure = useAxiosSecure();

    const { data: allAssignedCourses, isPending, error: assignedCoursesError, isError: isAssignedCoursesError, refetch: allAssignedCoursesRefetch } = useQuery({
        queryKey: ['allAssignedCourses'],
        queryFn: async () => {
            const res = await axiosSecure('/subject_offering/');
            return res.data;
        }
    })

    console.log(allAssignedCourses);

    useEffect(() => {
        if (isAssignedCoursesError) {
            console.log(assignedCoursesError);
            const message = errorMessageParser(assignedCoursesError);
            toast.error(message || "Failed to fetch assigned courses");
        }
    })

    return (
        <div>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                    <SectionHeader section_title='Assign Course' />
                    <span>({allAssignedCourses?.length})</span>
                </div>

                <CreateNewCourseAssignment allAssignedCoursesRefetch={allAssignedCoursesRefetch} />
            </div>
        </div>
    );
};

export default AssignedCourses;
