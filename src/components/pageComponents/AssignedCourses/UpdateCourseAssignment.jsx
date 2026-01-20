import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";
import { useEffect, useState } from "react";
import { useDebounce } from "../../../hooks/useDebounce.jsx";
import errorMessageParser from "../../../utils/errorMessageParser/errorMessageParser.js";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { FaEdit, FaSearch } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const UpdateCourseAssignment = ({ assignedCourse, allDepartments, isAllDepartmentsPending, allDepartmentsRefetch, allAssignedCoursesRefetch }) => {
    const axiosSecure = useAxiosSecure();
    const modalId = `edit_assignment_modal_${assignedCourse?.id}`; // unique id for each row to avoid always showing the first data
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
        defaultValues: {
            updatedTeacherId: assignedCourse?.taught_by?.id || null,
            updatedSubjectId: assignedCourse?.subject?.id,
            updatedDepartmentId: assignedCourse?.department?.id
        }
    }
    );
    // Add a state to track if THIS specific modal is open
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Filter states for search
    const [teacherSearch, setTeacherSearch] = useState("");
    const [subjectSearch, setSubjectSearch] = useState("");

    // debounce the search string by 500ms(wait 500ms before making the request send after user stop typing)
    const debouncedSubjectSearch = useDebounce(subjectSearch, 500);
    const debouncedTeacherSearch = useDebounce(teacherSearch, 500);

    // Watching selected values to show labels
    const selectedTeacherId = watch("updatedTeacherId");
    const selectedSubjectId = watch("updatedSubjectId");
    const selectedDepartmentId = watch("updatedDepartmentId");

    // SYNC FORM WHEN PROP CHANGES (The "First row" fix)
    useEffect(() => {
        if (assignedCourse) {
            setValue("updatedDepartmentId", assignedCourse.department?.id);
            setValue("updatedTeacherId", assignedCourse.taught_by?.id || null);
            setValue("updatedSubjectId", assignedCourse.subject?.id);
            setTeacherSearch(assignedCourse.taught_by?.name || "");
            setSubjectSearch(`${assignedCourse.subject?.subject_code}: ${assignedCourse.subject?.subject_title}` || "");
        }
    }, [assignedCourse, setValue]);



    // Fetch Teachers - Only if the modal is open
    const {
        data: allTeachersForCourseAssignment,
        error: allTeachersForCourseAssignmentError,
        isError: isAllTeachersForCourseAssignmentError
    } = useQuery({
        queryKey: ['allTeachersForCourseAssignment', debouncedTeacherSearch],
        queryFn: async () => {
            if (!debouncedTeacherSearch) return [];

            const res = await axiosSecure.get(`/teachers/all/?search=${debouncedTeacherSearch}`);
            return res.data;
        },
        enabled: isOpen && debouncedTeacherSearch.length > 1
    });

    // Fetch Subjects - Only if the modal is open
    const { data: allSubjects, error: allSubjectsError, isError: isAllSubjectsError } = useQuery({
        queryKey: ['allSubjects', debouncedSubjectSearch],
        queryFn: async () => {
            if (!debouncedSubjectSearch) return [];

            const params = new URLSearchParams();
            if (debouncedSubjectSearch) params.append('search', debouncedSubjectSearch)
            const res = await axiosSecure(`/subjects/?${params.toString()}`);
            return res.data;
        },
        enabled: isOpen && debouncedSubjectSearch?.length > 1
    });


    useEffect(() => {
        if (isAllTeachersForCourseAssignmentError) {
            console.log(allTeachersForCourseAssignmentError);
            const message = errorMessageParser(allTeachersForCourseAssignmentError);
            toast.error(message || "Failed to fetch teachers data");
        }
    }, [isAllTeachersForCourseAssignmentError])


    useEffect(() => {
        if (isAllSubjectsError) {
            console.log(allSubjectsError);
            const message = errorMessageParser(allSubjectsError);
            toast.error(message || "Failed to fetch subjects data");
        }
    }, [isAllSubjectsError])

    // Get Department Name for Summary
    const currentDeptName = allDepartments?.find(dept => dept.id == selectedDepartmentId)?.department_name || "...";

    // ADD NEW Course Assignment Function
    const updateSubjectOffering = async (data) => {
        const update_data = {
            taught_by_id: null
        };

        if (data.updatedTeacherId && (parseInt(data.updatedTeacherId) !== parseInt(assignedCourse?.taught_by?.id))) update_data.taught_by_id = parseInt(data.updatedTeacherId);

        if (data.updatedSubjectId && (parseInt(data.updatedSubjectId) !== parseInt(assignedCourse?.subject?.id))) update_data.subject_id = parseInt(data.updatedSubjectId);

        if (data.updatedDepartmentId && (parseInt(data.updatedDepartmentId) !== parseInt(assignedCourse?.department?.id))) update_data.department_id = parseInt(data.updatedDepartmentId);

        if (Object.keys(update_data).length === 0) {
            // @ts-ignore
            document.getElementById(modalId).close();
            return toast.error("No changes made. Change at least one field to update.");
        }

        try {
            setIsLoading(true);
            const res = await axiosSecure.patch(`/subject_offering/${assignedCourse?.id}`, update_data);
            toast.success(res?.data?.message || 'Course assignment updated successfully');
            // @ts-ignore
            document.getElementById(modalId).close();
            reset();
            setTeacherSearch("");
            setSubjectSearch("");
        } catch (error) {
            console.log(error);
            // @ts-ignore
            document.getElementById(modalId).close();
            const message = errorMessageParser(error);
            toast.error(message || 'Failed to update assigned course');
        } finally {
            reset();
            setIsLoading(false);
            allAssignedCoursesRefetch();
            allDepartmentsRefetch();
        }
    };



    return (
        <div>
            <div>
                {/* Create New Course Assignment Modal */}
                <button className='btn btn-ghost hover:bg-transparent border-0 group/edit-courseAssignment' onClick={() => {
                    setIsOpen(true);
                    // @ts-ignore
                    document.getElementById(modalId).showModal()
                }}>
                    <FaEdit className='text-sm group-hover/edit-courseAssignment:text-success' />
                </button>

                <dialog id={modalId} onClose={() => setIsOpen(false)} className="modal">
                    <div className="modal-box max-w-3xl">
                        <h3 className="font-bold text-2xl mb-6 border-b pb-2">Edit Assign Course to Teacher</h3>

                        <form onSubmit={handleSubmit(updateSubjectOffering)} className="space-y-6">

                            {/* 1. Department Selection */}
                            <div className={`form-control`}>
                                <label className="label font-semibold mr-2">Assign Department: </label>
                                {isAllDepartmentsPending ?
                                    <div className="skeleton h-12 w-full"></div> :
                                    (
                                        <div className="inline">
                                            <select
                                                className="select select-bordered"
                                                {...register("updatedDepartmentId")}
                                            >
                                                {allDepartments?.map(dept => (
                                                    <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 2. Teacher Search & Select */}
                                <div className="form-control relative">
                                    <label className="label font-semibold">Select Teacher</label>
                                    <div className="join w-full">
                                        <input
                                            type="text"
                                            placeholder="Search name or dept..."
                                            className="input input-bordered join-item w-full"
                                            value={teacherSearch}
                                            onChange={(e) => {
                                                setTeacherSearch(e.target.value);
                                                // If the user changes the text, clear the ID to re-enable searching
                                                if (selectedTeacherId) {
                                                    setValue("updatedTeacherId", "");
                                                }
                                            }}
                                        />
                                    </div>
                                    {/* Results Dropdown */}
                                    {allTeachersForCourseAssignment?.length > 0 && !selectedTeacherId && (
                                        <ul className="absolute z-10 top-20 menu p-2 shadow bg-base-100 rounded-box w-full border border-base-300 max-h-48 overflow-y-auto">
                                            {allTeachersForCourseAssignment.map(t => (
                                                <li key={t.id}>
                                                    <a onClick={() => {
                                                        setValue("updatedTeacherId", t.id);
                                                        setTeacherSearch(t.name);
                                                    }}>
                                                        <div>
                                                            <div className="font-bold">{t.name}</div>
                                                            <div className="text-xs opacity-60">{t.department?.department_name}</div>
                                                        </div>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <input type="hidden" {...register("updatedTeacherId")} />
                                </div>

                                {/* 3. Subject Search & Select */}
                                <div className="form-control relative" >
                                    <label className="label font-semibold">Subject</label>
                                    <div className="join w-full">
                                        <input
                                            type="text"
                                            placeholder="Search title or code..."
                                            className="input input-bordered join-item w-full"
                                            value={subjectSearch}
                                            onChange={(e) => {
                                                setSubjectSearch(e.target.value);
                                                // If the user changes the text, clear the ID to re-enable searching
                                                if (selectedSubjectId) {
                                                    setValue("updatedSubjectId", "");
                                                }
                                            }}
                                        />
                                    </div>

                                    {/* Results Dropdown */}
                                    {allSubjects?.length > 0 && !selectedSubjectId && (
                                        <ul className={`absolute z-10 top-20 menu p-2 shadow bg-base-100 rounded-box w-full border border-base-300 max-h-60 overflow-y-auto`} >
                                            {allSubjects.map(subject => (
                                                <li key={subject.id}>
                                                    <a onClick={() => {
                                                        setValue("updatedSubjectId", subject.id);
                                                        setSubjectSearch(`${subject.subject_code.toUpperCase()}: ${subject.subject_title}`);
                                                    }}>
                                                        <div>
                                                            <div className="font-bold">{subject.subject_code.toUpperCase()} <span className='text-xs font-normal opacity-60'>(Semester: {subject.semester.semester_number})</span></div>
                                                            <div className="text-xs opacity-60">{subject.subject_title}</div>
                                                        </div>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <input type="hidden" {...register("updatedSubjectId")} />
                                </div>
                            </div>

                            {/* Summary Box */}
                            <div className="alert bg-base-200 border-none italic text-sm py-4">
                                <div>
                                    Ready to assign <span className="text-success font-bold">{subjectSearch || '...'}</span> to <span className="text-info font-bold">{teacherSearch || '...'}</span> for <span className="font-bold">{currentDeptName}</span>
                                </div>
                            </div>

                            {/* close modal and submit */}
                            <div className="modal-action flex items-center justify-end">
                                <button type="button" className="btn btn-ghost" onClick={() => {
                                    setIsOpen(false);
                                    setTeacherSearch(assignedCourse?.taught_by?.name || '');
                                    setSubjectSearch(assignedCourse?.subject?.subject_title);
                                    // @ts-ignore
                                    document.getElementById(modalId).close();
                                }}>Cancel</button>
                                <button className="btn btn-primary min-w-[120px]" disabled={isLoading}>
                                    {isLoading ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Confirm Assignment"}
                                </button>

                            </div>
                        </form>
                    </div>
                </dialog>
            </div>
        </div>
    );
};

export default UpdateCourseAssignment;