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
import UpdateCourseAssignment from "../../components/pageComponents/AssignedCourses/UpdateCourseAssignment.jsx";
import { AssignedCoursesSkeleton } from "../../components/ui/Skeletons.jsx";
import { useDebounce } from "../../hooks/useDebounce.jsx";


const AssignedCourses = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [selectedSubjectOffering, setSelectedSubjectOffering] = useState(null); // state for editing
    const [isFormLoading, setIsFormLoading] = useState(false);

    // Filter
    const [filters, setFilters] = useState({
        search: "",
        department_id: "",
        course_assignment_order_by_filter: localStorage.getItem("course_assignment_order_by_filter") || ""
    });

    // debounce the search string by 500ms(wait 500ms before making the request send after user stop typing)
    const debouncedSearch = useDebounce(filters.search, 500);

    // Fetch all assigned courses
    const { data: allAssignedCourses, isPending: isAllAssignedCoursesPending, error: assignedCoursesError, isError: isAssignedCoursesError, refetch: allAssignedCoursesRefetch } = useQuery({
        queryKey: ['allAssignedCourses', filters.course_assignment_order_by_filter, filters.department_id, debouncedSearch],
        queryFn: async () => {
            const params = new URLSearchParams();

            if (filters.department_id) params.append('filter_by_department', filters.department_id);
            if (filters.course_assignment_order_by_filter) params.append('order_by_filter', filters.course_assignment_order_by_filter);

            // Use the debounced value for the API call
            if (debouncedSearch) params.append('search', debouncedSearch);

            const res = await axiosSecure(`/subject_offering/?${params.toString()}`);
            return res.data;
        }
    })

    // Departments fetch for update and create
    const { data: allDepartments, isPending: isAllDepartmentsPending, error: allDepartmentsError, isError: isAllDepartmentsError, refetch: allDepartmentsRefetch } = useQuery({
        queryKey: ['allDepartments'],
        queryFn: async () => {
            const res = await axiosSecure('/departments/');
            return res.data;
        }
    })

    useEffect(() => {
        if (isAssignedCoursesError) {
            console.log(assignedCoursesError);
            const message = errorMessageParser(assignedCoursesError);
            toast.error(message || "Failed to fetch assigned courses");
        }
    }, [isAssignedCoursesError])

    useEffect(() => {
        if (isAllDepartmentsError) {
            console.log(allDepartmentsError);
            const message = errorMessageParser(allDepartmentsError);
            toast.error(message || "Failed to fetch departments");
        }
    }, [isAllDepartmentsError])

    // Handler to update filters
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

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

                <CreateNewCourseAssignment
                    allDepartments={allDepartments}
                    isAllDepartmentsPending={isAllDepartmentsPending}
                    allDepartmentsRefetch={allDepartmentsRefetch}
                    allAssignedCoursesRefetch={allAssignedCoursesRefetch} />
            </div>


            {/* Show all assigned courses */}
            <div>
                {/* 3. Filter UI Section */}
                <div className="grid grid-cols-1 md:grid-cols-10 gap-4 mb-6 bg-base-200 p-4 rounded-lg">

                    {/* Department Select */}
                    <div className="form-control md:col-span-3">
                        <label className="label">Filter by Assigned Department</label>
                        <select
                            name="department_id"
                            className="select w-full uppercase"
                            value={filters.department_id}
                            onChange={handleFilterChange}
                        >
                            <option value="">All</option>
                            {allDepartments?.map(department => (
                                <option key={department.id} value={department.id}>{department.department_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Order by */}
                    <div className="md:col-span-2">
                        <label className="label">Order By: </label>
                        <select
                            name='course_assignment_order_by_filter'
                            className='select'
                            value={filters.course_assignment_order_by_filter}
                            onChange={(e) => {
                                localStorage.setItem("course_assignment_order_by_filter", e.target.value);
                                handleFilterChange(e);
                            }}
                        >
                            <option value="asc">ASC ⬇️</option>
                            <option value="desc">DESC ⬆️</option>
                        </select>
                    </div>

                    {/* Search Title/Code */}
                    <div className="form-control md:col-span-4">
                        <label className="label">Search By Teacher</label>
                        <input
                            type="text"
                            name="search"
                            placeholder="Teacher name.."
                            className="input input-bordered w-full"
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                    </div>

                    {/* Reset Button */}
                    <div className="md:col-span-1 md:place-self-center md:mt-5">
                        <button
                            className="btn btn-error text-sm"
                            onClick={() => {
                                setFilters({
                                    search: "",
                                    department_id: "",
                                    course_assignment_order_by_filter: ""
                                })
                                localStorage.removeItem("course_assignment_order_by_filter");
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
                {isAllAssignedCoursesPending && <AssignedCoursesSkeleton />}

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
                                                <h4>
                                                    {assignedCourse?.taught_by && assignedCourse?.taught_by?.name}
                                                    <span className="text-error font-bold uppercase opacity-100">{!assignedCourse?.taught_by?.name && "N/A"}</span>
                                                </h4>
                                                <p className="text-xs xl:text-sm opacity-60 mt-1">
                                                    From <span className="uppercase font-bold opacity-100">{(assignedCourse?.taught_by && (assignedCourse?.taught_by?.department?.department_name).split(/\s*[-\u2013\u2014]\s*/)[0])}</span> <span className="text-error font-bold uppercase opacity-100">{!assignedCourse?.taught_by?.department?.department_name && "N/A"}</span> Department {/* removes different types of  hyphens and keeps the first word */}
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
                                                {/* update course assignment Modal trigger */}
                                                <UpdateCourseAssignment
                                                    assignedCourse={assignedCourse}
                                                    allDepartments={allDepartments}
                                                    isAllDepartmentsPending={isAllDepartmentsPending}
                                                    allDepartmentsRefetch={allDepartmentsRefetch}
                                                    allAssignedCoursesRefetch={allAssignedCoursesRefetch} />

                                                {/* Delete Course Assignment confirmation Modal */}
                                                {
                                                    user?.role === "super_admin" &&
                                                    <>
                                                        <button className="btn btn-ghost hover:bg-transparent border-0 group/delete-course-assignment"
                                                            onClick={() => {
                                                                setSelectedSubjectOffering(assignedCourse);
                                                                document.getElementById('delete_subject_offering_modal').
                                                                    // @ts-ignore
                                                                    showModal()
                                                            }}
                                                        >
                                                            <MdDelete className='group-hover/delete-course-assignment:text-red-700 text-lg' />
                                                        </button>
                                                    </>}
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                            {
                                allAssignedCourses?.length > 10 &&
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
                            }
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
                        Assigned <span className="text-info">{selectedSubjectOffering?.taught_by?.name || "N/A"}</span> from <span className="font-medium uppercase text-info">
                            {(selectedSubjectOffering?.taught_by && (selectedSubjectOffering?.taught_by?.department?.department_name)?.split(/\s*[-\u2013\u2014]\s*/)[0]) || "N/A"}
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
