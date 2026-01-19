import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure.jsx";
import SectionHeader from "../../utils/SectionHeader/SectionHeader.jsx";
import CreateNewCourseAssignment from "../../components/pageComponents/AssignedCourses/CreateNewCourseAssignment.jsx";
import { useEffect } from "react";
import errorMessageParser from "../../utils/errorMessageParser/errorMessageParser.js";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import useAuth from "../../hooks/useAuth.jsx";


const AssignedCourses = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: allAssignedCourses, isPending: isAllAssignedCoursesPending, error: assignedCoursesError, isError: isAssignedCoursesError, refetch: allAssignedCoursesRefetch } = useQuery({
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
    }, [isAssignedCoursesError])

    return (
        <div>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                    <SectionHeader section_title='Assign Course' />
                    <span>({allAssignedCourses?.length})</span>
                </div>

                <CreateNewCourseAssignment allAssignedCoursesRefetch={allAssignedCoursesRefetch} />
            </div>


            {/* Show all assigned courses */}
            <div>
                {isAllAssignedCoursesPending ? <span className="loading loading-spinner loading-sm"></span> : ""}

                {allAssignedCourses?.length === 0 && <div className="text-center py-4">No assigned courses found</div>}

                {
                    allAssignedCourses?.length > 0 &&
                    <div className="overflow-x-auto">
                        <table className="table table-xs md:table-sm xl:table-md">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Assigned <br /> Teacher</th>
                                    <th>Assigned <br /> Subject</th>
                                    <th>Assigned to <br /> (Department)</th>
                                    <th>Semester</th>
                                    <th>Assigned Date</th>
                                    <th>Updated On<br /> (Assignment)</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allAssignedCourses?.map(assignedCourse =>
                                        <tr key={assignedCourse.id} className="text-sm md:text-base xl:text-lg">
                                            {/* ID */}
                                            <th>{assignedCourse.id}</th>

                                            {/* Teacher Name  & Department */}
                                            <td>
                                                <h4>{assignedCourse.taught_by.name}</h4>
                                                <p className="text-xs xl:text-sm opacity-60 mt-1">
                                                    From <span className="uppercase font-bold opacity-100">{(assignedCourse.taught_by.department.department_name).split(/\s*[-\u2013\u2014]\s*/)[0]}</span> Department {/* removes different types of  hyphens and keeps the first word */}
                                                </p>
                                            </td>

                                            {/* Assigned Subject Name & Code */}
                                            <td>
                                                <h4>{assignedCourse.subject.subject_title}</h4>
                                                <p className="opacity-60 text-xs xl:text-sm mt-1">Code: <span className="uppercase font-bold">{assignedCourse.subject.subject_code}</span></p>
                                            </td>

                                            {/* Assigned Department Name */}
                                            <td className="text-sm xl:text-base">{assignedCourse.department.department_name.toUpperCase()}</td>

                                            {/* Semester Name */}
                                            <td className="capitalize text-sm xl:text-base">{assignedCourse.subject.semester.semester_name} Semester</td>

                                            {/* Assigned Date */}
                                            <td className="text-sm">{assignedCourse.created_at.split("T")[0]}</td>

                                            {/* Updated Date */}
                                            <td className="text-sm">{assignedCourse.updated_at.split("T")[0]}</td>

                                            {/* Actions */}
                                            <td className='flex'>
                                                {/* update department Modal trigger */}
                                                <button
                                                    // onClick={() => openUpdateDepartmentModal(department)}
                                                    className="btn btn-ghost hover:bg-transparent border-0 group/edit-dept">
                                                    <FaEdit className='group-hover/edit-dept:text-success'
                                                    />
                                                </button>


                                                {/* Delete Department confirmation Modal */}
                                                {
                                                    user?.role === "super_admin" &&
                                                    <>
                                                        <button className="btn btn-ghost hover:bg-transparent border-0 group/delete-dept"
                                                            onClick={() => {
                                                                // setSelectedDept(department);
                                                                document.getElementById('delete_dept_modal').
                                                                    // @ts-ignore
                                                                    showModal()
                                                            }}
                                                        >
                                                            <MdDelete className='group-hover/delete-dept:text-red-700 text-lg' />
                                                        </button>
                                                    </>}
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th></th>
                                    <th>Name</th>
                                    <th>Job</th>
                                    <th>company</th>
                                    <th>location</th>
                                    <th>Last Login</th>
                                    <th>Favorite Color</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                }
            </div>
        </div>
    );
};

export default AssignedCourses;
