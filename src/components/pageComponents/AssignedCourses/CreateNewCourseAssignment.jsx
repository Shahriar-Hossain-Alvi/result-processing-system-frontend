import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure.jsx';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import errorMessageParser from '../../../utils/errorMessageParser/errorMessageParser.js';
import toast from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa6';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useDebounce } from '../../../hooks/useDebounce.jsx';
import { FaSearch } from 'react-icons/fa';

const CreateNewCourseAssignment = ({ allAssignedCoursesRefetch }) => {
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
    const [isLoading, setIsLoading] = useState(false);

    // Filter states for search
    const [teacherSearch, setTeacherSearch] = useState("");
    const [subjectSearch, setSubjectSearch] = useState("");

    // debounce the search string by 500ms(wait 500ms before making the request send after user stop typing)
    const debouncedSubjectSearch = useDebounce(subjectSearch, 500);
    const debouncedTeacherSearch = useDebounce(teacherSearch, 500);

    // Watching selected values to show labels
    const selectedTeacherId = watch("teacherId");
    const selectedSubjectId = watch("subjectId");

    // Departments fetch
    const { data: allDepartments, isPending: isAllDepartmentsPending, error: allDepartmentsError, isError: isAllDepartmentsError, refetch: allDepartmentsRefetch } = useQuery({
        queryKey: ['allDepartments'],
        queryFn: async () => {
            const res = await axiosSecure('/departments/');
            return res.data;
        }
    })

    useEffect(() => {
        if (isAllDepartmentsError) {
            console.log(allDepartmentsError);
            const message = errorMessageParser(allDepartmentsError);
            toast.error(message || "Failed to fetch departments");
        }
    }, [isAllDepartmentsError])


    // Fetch Teachers 
    const {
        data: allTeachersForCourseAssignment,
        isFetching: isAllTeachersForCourseAssignmentFetching,
        error: allTeachersForCourseAssignmentError,
        isError: isAllTeachersForCourseAssignmentError
    } = useQuery({
        queryKey: ['allTeachersForCourseAssignment', debouncedTeacherSearch],
        queryFn: async () => {
            if (!debouncedTeacherSearch) return [];

            const res = await axiosSecure.get(`/teachers/all/?search=${debouncedTeacherSearch}`);
            return res.data; // TODO: create api endpoint for this: [{id, name, department: {department_name}}]
        },
        enabled: debouncedTeacherSearch.length > 1
    });

    useEffect(() => {
        if (isAllTeachersForCourseAssignmentError) {
            console.log(allTeachersForCourseAssignmentError);
            const message = errorMessageParser(allTeachersForCourseAssignmentError);
            toast.error(message || "Failed to fetch teachers data");
        }
    }, [isAllTeachersForCourseAssignmentError])


    // Fetch Subjects
    const { data: allSubjects, isFetching: isAllSubjectsFetching, error: allSubjectsError, isError: isAllSubjectsError } = useQuery({
        queryKey: ['allSubjects', debouncedSubjectSearch],
        queryFn: async () => {
            if (!debouncedSubjectSearch) return [];

            const params = new URLSearchParams();
            if (debouncedSubjectSearch) params.append('search', debouncedSubjectSearch)
            const res = await axiosSecure(`/subjects/?${params.toString()}`);
            console.log(res);
            return res.data;
        },
        enabled: debouncedSubjectSearch?.length > 1
    });


    useEffect(() => {
        if (isAllSubjectsError) {
            console.log(allSubjectsError);
            const message = errorMessageParser(allSubjectsError);
            toast.error(message || "Failed to fetch subjects data");
        }
    }, [isAllSubjectsError])

    // ADD NEW Course Assignment Function
    const addNewSubjectOffering = async (data) => {
        try {
            setIsLoading(true);
            const payload = {
                taught_by_id: parseInt(data.teacherId),
                subject_id: parseInt(data.subjectId),
                department_id: parseInt(data.departmentId),
            };
            await axiosSecure.post('/subject_offering/', payload);
            toast.success('Course assigned successfully');
            allAssignedCoursesRefetch();
            // @ts-ignore
            document.getElementById('create_subject_offering_modal').close();
            reset();
            setTeacherSearch("");
            setSubjectSearch("");
        } catch (error) {
            console.log(error);
            // @ts-ignore
            document.getElementById('create_subject_offering_modal').close();
            const message = errorMessageParser(error);
            toast.error(message || 'Failed to assign course');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            <button className='btn btn-circle btn-ghost btn-sm border-2 border-dashed' onClick={() => document.getElementById('create_subject_offering_modal').
                // @ts-ignore
                showModal()}>
                <FaPlus />
            </button>

            <dialog id="create_subject_offering_modal" className="modal">
                <div className="modal-box max-w-3xl">
                    <h3 className="font-bold text-2xl mb-6 border-b pb-2">Assign Course to Teacher</h3>

                    <form onSubmit={handleSubmit(addNewSubjectOffering)} className="space-y-6">

                        {/* 1. Department Selection */}
                        <div className={`form-control`}>
                            <label className="label font-semibold mr-2">Select Department: </label>
                            {isAllDepartmentsPending ?
                                <div className="skeleton h-12 w-full"></div> :
                                (
                                    <div className={`${errors.departmentId && "tooltip tooltip-open tooltip-right tooltip-error"} inline`} data-tip={errors.departmentId && errors.departmentId.message}>
                                        <select
                                            className="select select-bordered"
                                            {...register("departmentId", { required: "Department is required" })}
                                        >
                                            <option value="">Select Department</option>
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
                                <label className="label font-semibold">Teacher</label>
                                <div className={`join w-full ${errors.teacherId && "tooltip tooltip-open tooltip-top tooltip-error"}`} data-tip={errors.teacherId && errors.teacherId.message}>
                                    <div className="join-item bg-base-200 flex items-center px-3 border border-r-0 border-base-content/20">
                                        {isAllTeachersForCourseAssignmentFetching ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSearch />}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search name or dept..."
                                        className="input input-bordered join-item w-full"
                                        value={teacherSearch}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setTeacherSearch(val);
                                            // If the user changes the text, clear the ID to re-enable searching
                                            if (selectedTeacherId) {
                                                setValue("teacherId", "");
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
                                                    setValue("teacherId", t.id);
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
                                <input type="hidden" {...register("teacherId", { required: "Teacher is required" })} />
                            </div>

                            {/* 3. Subject Search & Select */}
                            <div className="form-control relative" >
                                <label className="label font-semibold">Subject</label>
                                <div className={`join w-full ${errors.subjectId && "tooltip tooltip-open tooltip-top tooltip-error"}`} data-tip={errors.subjectId && errors.subjectId.message}>
                                    <div className="join-item bg-base-200 flex items-center px-3 border border-r-0 border-base-content/20">
                                        {isAllSubjectsFetching ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSearch />}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search title or code..."
                                        className="input input-bordered join-item w-full"
                                        value={subjectSearch}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setSubjectSearch(val);
                                            // If the user changes the text, clear the ID to re-enable searching
                                            if (selectedSubjectId) {
                                                setValue("subjectId", "");
                                            }
                                            // setSubjectSearch(e.target.value)
                                        }}
                                    />
                                </div>

                                {/* Results Dropdown */}
                                {allSubjects?.length > 0 && !selectedSubjectId && (
                                    <ul className={`absolute z-10 top-20 menu p-2 shadow bg-base-100 rounded-box w-full border border-base-300 max-h-60 overflow-y-auto`} >
                                        {allSubjects.map(subject => (
                                            <li key={subject.id}>
                                                <a onClick={() => {
                                                    setValue("subjectId", subject.id);
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
                                <input type="hidden" {...register("subjectId", { required: "Subject is required" })} />
                            </div>
                        </div>

                        {/* Summary Box */}
                        {(selectedTeacherId && teacherSearch) || (selectedSubjectId && subjectSearch) ? (
                            <div className="bg-base-200 p-3 rounded-lg text-sm italic">
                                Ready to assign <span className="font-bold text-success">{selectedSubjectId ? subjectSearch : '...'}</span> to <span className="font-bold text-info">{selectedTeacherId ? teacherSearch : '...'}</span>
                            </div>
                        ) : null}

                        <div className="modal-action flex items-center justify-between">
                            <p className="text-xs opacity-50">Fields are mandatory</p>
                            <div className="flex gap-2">
                                <button type="button" className="btn btn-ghost" onClick={() => {
                                    reset();
                                    setTeacherSearch("");
                                    setSubjectSearch("");
                                    // @ts-ignore
                                    document.getElementById('create_subject_offering_modal').close();
                                }}>Cancel</button>
                                <button className="btn btn-primary min-w-[120px]" disabled={isLoading}>
                                    {isLoading ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Confirm Assignment"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default CreateNewCourseAssignment;