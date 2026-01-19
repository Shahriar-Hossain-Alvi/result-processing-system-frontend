import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure.jsx";
import SectionHeader from "../../utils/SectionHeader/SectionHeader.jsx";
import CreateNewCourseAssignment from "../../components/pageComponents/AssignedCourses/CreateNewCourseAssignment.jsx";
import { useEffect, useState } from "react";
import errorMessageParser from "../../utils/errorMessageParser/errorMessageParser.js";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import useAuth from "../../hooks/useAuth.jsx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


const AssignedCourses = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [selectedSubjectOffering, setSelectedSubjectOffering] = useState(null); // state for editing
    const [isFormLoading, setIsFormLoading] = useState(false);

    const { data: allAssignedCourses, isPending: isAllAssignedCoursesPending, error: assignedCoursesError, isError: isAssignedCoursesError, refetch: allAssignedCoursesRefetch } = useQuery({
        queryKey: ['allAssignedCourses'],
        queryFn: async () => {
            const res = await axiosSecure('/subject_offering/');
            return res.data;
        }
    })

    console.log(allAssignedCourses);
    console.log(selectedSubjectOffering);

    useEffect(() => {
        if (isAssignedCoursesError) {
            console.log(assignedCoursesError);
            const message = errorMessageParser(assignedCoursesError);
            toast.error(message || "Failed to fetch assigned courses");
        }
    }, [isAssignedCoursesError])

    // delete subject offering (course assignment)
    const deleteSubjectOffering = async (id) => {
        try {
            setIsFormLoading(true);
            const res = await axiosSecure.delete(`/subject_offering/${id}`);
            console.log(res);
            // @ts-ignore
            document.getElementById('delete_subject_offering_modal').close();
            allAssignedCoursesRefetch();
            toast.success(res?.data?.message);
        } catch (error) {
            console.log(error);
            // @ts-ignore
            document.getElementById('delete_subject_offering_modal').close();
            const message = errorMessageParser(error);
            toast.error(message || 'Failed to delete course assignment');
        } finally {
            setIsFormLoading(false);
        }
    }

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
                                            <td className="min-w-40">
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
                                            <td>
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
                                                                setSelectedSubjectOffering(assignedCourse);
                                                                document.getElementById('delete_subject_offering_modal').
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
                                    <th>ID</th>
                                    <th>Assigned <br /> Teacher</th>
                                    <th>Assigned <br /> Subject</th>
                                    <th>Assigned to <br /> (Department)</th>
                                    <th>Semester</th>
                                    <th>Assigned Date</th>
                                    <th>Updated On<br /> (Assignment)</th>
                                    <th>Actions</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                }
            </div>

            {/* Modals */}
            {/* delete subject offering modal */}
            <dialog id="delete_subject_offering_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-error uppercase">Be Careful!!!</h3>
                    <p className="py-4">
                        <span className="font-semibold block mb-2">Are you sure you want to delete this course assignment?</span>
                        <span className="font-bold block underline">Details:</span>
                        Assigned <span className="text-info">{selectedSubjectOffering?.taught_by?.name}</span> from <span className="font-medium uppercase text-info">
                            {(selectedSubjectOffering?.taught_by?.department?.department_name)?.split(/\s*[-\u2013\u2014]\s*/)[0]}
                        </span> department <br /> as <span className="font-medium capitalize text-info">{selectedSubjectOffering?.subject.subject_title}</span> <span className="text-sm text-info italic">({selectedSubjectOffering?.subject?.subject_code})</span> teacher <br /> to <span className="text-info">{selectedSubjectOffering?.department.department_name.toUpperCase()}</span> department
                    </p>
                    <p className='text-warning text-sm'>The course assignment is connected with other data such as Mark Inputs. Deleting it may create errors and failures in the system!!! Try Editing instead</p>
                    <div className="modal-action">
                        <button
                            onClick={() => deleteSubjectOffering(selectedSubjectOffering?.id)}
                            className={`btn ${isFormLoading ? "btn-disabled" : "btn-error"}`}
                        >
                            {isFormLoading ? <AiOutlineLoading3Quarters className='animate-spin' /> : "Yes, delete it"}
                        </button>
                        <form method="dialog"
                        >
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default AssignedCourses;
