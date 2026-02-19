import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure.jsx';
import { set, useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import errorMessageParser from '../../../utils/errorMessageParser/errorMessageParser.js';
import toast from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa6';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useDebounce } from '../../../hooks/useDebounce.jsx';
import { FaSearch } from 'react-icons/fa';

const InsertMarks = ({ allMarksWithFiltersRefetch }) => {
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
    const [isLoading, setIsLoading] = useState(false);

    // Add a state to track if THIS specific modal is open
    const [isOpen, setIsOpen] = useState(false);

    // Filter states for search
    const [studentSearch, setStudentSearch] = useState("");
    const [selectedSubjectForMarking, setSelectedSubjectForMarking] = useState(null);

    // debounce the search string by 500ms(wait 500ms before making the request send after user stop typing)
    const debouncedStudentSearch = useDebounce(studentSearch, 500);

    // Watching selected values to show labels
    const selectedStudentId = watch("studentId");
    const selectedSubjectId = watch("subjectId");

    // Fetch students 
    const {
        data: allStudentsForMarks,
        isFetching: isAllStudentsForMarksFetching,
        error: allStudentsForMarksError,
        isError: isAllStudentsForMarksError
    } = useQuery({
        queryKey: ['allStudentsForMarks', debouncedStudentSearch],
        queryFn: async () => {
            if (!debouncedStudentSearch) return [];

            const res = await axiosSecure.get(`/students/allStudentMinimal/?search=${debouncedStudentSearch}`);
            return res?.data;
        },
        enabled: debouncedStudentSearch.length > 1
    });

    useEffect(() => {
        if (isAllStudentsForMarksError) {
            console.log(allStudentsForMarksError);
            const message = errorMessageParser(allStudentsForMarksError);
            toast.error(message || "Failed to fetch students data for marking");
        }
    }, [isAllStudentsForMarksError])


    // Fetch Subjects based on students department and current semester. 
    const { data: subjectsForMarking,
        isPending: isSubjectsForMarkingPending,
        error: subjectsForMarkingError,
        isError: isSubjectsForMarkingError } = useQuery({
            queryKey: ['subjectsForMarking'],
            queryFn: async () => {
                const student = allStudentsForMarks[0];
                // const students_current_semester_id = allStudentsForMarks[0]?.semester_id
                // const students_department_id = allStudentsForMarks[0]?.department_id

                const params = new URLSearchParams({
                    students_current_semester_id: student.semester_id,
                    students_department_id: student.department_id
                });
                // if (students_current_semester_id) params.append('students_current_semester_id', students_current_semester_id);
                // if (students_department_id) params.append('students_department_id', students_department_id);
                // TODO: add teachers id if teacher inserts the marks

                const res = await axiosSecure(`/subject_offering/offered_subject_lists_for_marking/?${params.toString()}`);
                console.log(res?.data);
                return res?.data;
            },
            enabled: !!selectedStudentId && isOpen && allStudentsForMarks?.length === 1
        });

    useEffect(() => {
        if (isSubjectsForMarkingError) {
            console.log(subjectsForMarkingError);
            const message = errorMessageParser(subjectsForMarkingError);
            toast.error(message || "Failed to fetch subjects data");
        }
    }, [isSubjectsForMarkingError])

    // 3. Handle Subject Selection (Replaces onClick on <option>)
    useEffect(() => {
        if (selectedSubjectId && subjectsForMarking) {
            const subject = subjectsForMarking.find(s => s.subject_id === parseInt(selectedSubjectId));
            setSelectedSubjectForMarking(subject);
        }
    }, [selectedSubjectId, subjectsForMarking]);

    // INSERT Marks Function
    const insertNewMark = async (data) => {
        const payload = {
            student_id: parseInt(data.studentId),
            semester_id: parseInt(data.semesterId),
            subject_id: parseInt(data.subjectId),
        };
        if (data.assignmentMarks !== undefined && data.assignmentMarks !== "") payload.assignment_mark = parseFloat(data.assignmentMarks);
        if (data.classTestMarks !== undefined && data.classTestMarks !== "") payload.class_test_mark = parseFloat(data.classTestMarks);
        if (data.midtermMarks !== undefined && data.midtermMarks !== "") payload.midterm_mark = parseFloat(data.midtermMarks);
        if (data.finalExamMarks !== undefined && data.finalExamMarks !== "") payload.final_exam_mark = parseFloat(data.finalExamMarks);
        console.log(payload);

        if (Object.keys(payload).length < 4) {
            // @ts-ignore
            document.getElementById('insert_marks_modal').close();
            return toast.error('Minimum one mark is required to insert marks.');
        }

        try {
            setIsLoading(true);

            const res = await axiosSecure.post('/marks/', payload);
            toast.success(res?.data?.message || 'Marks inserted');
            // @ts-ignore
            document.getElementById('insert_marks_modal').close();
            reset();
        } catch (error) {
            console.log(error);
            // @ts-ignore
            document.getElementById('insert_marks_modal').close();
            const message = errorMessageParser(error);
            toast.error(message || 'Failed to insert marks');
        } finally {
            setStudentSearch("");
            setSelectedSubjectForMarking(null);
            setIsLoading(false);
            allMarksWithFiltersRefetch();
        }
    };


    return (
        <div>
            {/* Insert marks Modal */}
            <button className='btn btn-ghost btn-sm group/insertMarks hover:bg-transparent border-0 tooltip tooltip-left' data-tip="Insert Marks" onClick={() => {
                setIsOpen(true);
                // @ts-ignore
                document.getElementById('insert_marks_modal').showModal()
            }}>
                <FaPlus className='text-lg group-hover/insertMarks:text-success' />
            </button>

            {/* Insert Marks Modal */}
            <dialog id="insert_marks_modal" className="modal">
                <div className="modal-box max-w-3xl">
                    <h3 className="font-bold text-2xl mb-6 border-b pb-2">Insert Marks</h3>

                    <form onSubmit={handleSubmit(insertNewMark)} className="grid xs:grid-cols-1 md:grid-cols-2 gap-3">

                        {/* Student Search & Select */}
                        <div className="relative w-full">
                            <label className={`label font-semibold ${errors.studentId && "tooltip tooltip-open tooltip-right tooltip-error"}`}
                                data-tip={errors.studentId && errors.studentId.message}
                            >Student</label>
                            <div className="join w-full" >
                                <div className="join-item bg-base-200 flex items-center px-3 border border-r-0 border-base-content/20">
                                    {isAllStudentsForMarksFetching ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSearch />}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search using name, reg or dept..."
                                    className="input join-item w-full"
                                    value={studentSearch}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setStudentSearch(val);
                                        // If the user changes the text, clear the ID to re-enable searching
                                        if (selectedStudentId) {
                                            setValue("studentId", "");
                                        }
                                    }}
                                />
                            </div>
                            {/* Results Dropdown */}
                            {allStudentsForMarks?.length > 0 && !selectedStudentId && (
                                <ul className="absolute z-10 top-20 menu p-2 shadow bg-base-100 rounded-box w-full border border-base-300 max-h-72 overflow-y-auto">
                                    {allStudentsForMarks.map(st => (
                                        <li key={st.id}>
                                            <a onClick={() => {
                                                setValue("studentId", st.id);
                                                setStudentSearch(st.name);
                                                setValue("semesterId", st.semester_id);
                                            }}>
                                                <div>
                                                    <div className="font-bold">{st.name}</div>
                                                    <div className='text-xs opacity-70'>Reg: {st.registration}</div>
                                                    <div className="text-xs opacity-60">{st.department?.department_name?.split(" ")[0]?.toUpperCase()} ({st.session})</div>
                                                </div>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <input type="hidden" {...register("studentId", { required: "Required" })} />
                        </div>

                        {/* 3. Subject Select */}
                        <div className="w-full" >
                            <label
                                className={`label font-semibold ${errors.subjectId && "tooltip tooltip-open tooltip-right tooltip-error"}`}
                                data-tip={errors.subjectId && errors.subjectId.message}
                            >Select Subject</label>
                            <select
                                {...register("subjectId", { required: "Required" })}
                                className='select w-full'
                                defaultValue=""
                                disabled={!selectedStudentId || isSubjectsForMarkingPending}
                            >
                                <option disabled value="">Select a subject</option>

                                {subjectsForMarking?.map((subjectOffering) => (
                                    <option
                                        className='border-b my-0.5'
                                        key={subjectOffering.id}
                                        value={subjectOffering?.subject_id}
                                    >
                                        {`${subjectOffering.subject.subject_title} ----- Taught By: ${subjectOffering.taught_by?.name} ----- Assigned to: ${subjectOffering.department?.department_name.split(/\s*[-\u2013\u2014]\s*/)[0]?.toUpperCase()} department`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Assignment Marks */}
                        <div className={`${errors.assignmentMarks && "tooltip tooltip-open tooltip-top tooltip-error mt-5"} space-y-1 w-full`} data-tip={errors.assignmentMarks && errors.assignmentMarks.message}>
                            <label className="label font-semibold"

                            >Assignment Mark</label>
                            <input
                                type="number"
                                step="0.1"
                                className='input w-full'
                                placeholder='Assignment Marks (0-20)'
                                {...register(
                                    "assignmentMarks",
                                    {
                                        min: {
                                            value: 0,
                                            message: "Must be greater than 0"
                                        },
                                        max: {
                                            value: 20,
                                            message: "Must be less than or equal to 20"
                                        }
                                    })}
                            />
                        </div>

                        {/* Class Test Marks */}
                        <div className={`${errors.classTestMarks && "tooltip tooltip-open tooltip-top mt-5 tooltip-error"} space-y-1 w-full`} data-tip={errors.classTestMarks && errors.classTestMarks.message}>
                            <label className="label font-semibold"
                            >Class Test Mark</label>
                            <input
                                type="number"
                                step="0.1"
                                className='input w-full'
                                placeholder='Class Test Marks (0-20)'
                                {...register(
                                    "classTestMarks",
                                    {
                                        min: {
                                            value: 0,
                                            message: "Must be greater than 0"
                                        }
                                        ,
                                        max: {
                                            value: 20,
                                            message: "Must be less than or equal to 20"
                                        }
                                    })}
                            />
                        </div>

                        {/* Midterm Marks */}
                        <div className={`space-y-1 w-full ${errors.midtermMarks && "tooltip tooltip-open tooltip-top mt-5 tooltip-error"}`} data-tip={errors.midtermMarks && errors.midtermMarks.message}>
                            <label className="label font-semibold"

                            >Midterm Mark</label>
                            <input
                                type="number"
                                step="0.1"
                                className='input w-full'
                                placeholder='Midterm Marks (0-20)'
                                {...register(
                                    "midtermMarks",
                                    {
                                        min: {
                                            value: 0,
                                            message: "Must be greater than 0"
                                        },
                                        max: {
                                            value: 20,
                                            message: "Must be less than or equal to 20"
                                        }
                                    })}
                            />
                        </div>

                        {/* Final Exam Marks */}
                        <div className={`${errors.finalExamMarks && "tooltip tooltip-open tooltip-top mt-5 tooltip-error"} space-y-1 w-full`} data-tip={errors.finalExamMarks && errors.finalExamMarks.message}>
                            <label className="label font-semibold"
                            >Final Exam Mark</label>
                            <input
                                type="number"
                                step="0.1"
                                className='input w-full'
                                placeholder='Final Exam Marks (0-80)'
                                {...register(
                                    "finalExamMarks",
                                    {
                                        min: {
                                            value: 0,
                                            message: "Must be greater than 0"
                                        },
                                        max: {
                                            value: 80,
                                            message: "Must be less than or equal to 80"
                                        }
                                    })}
                            />
                        </div>

                        {/* Summary Box */}
                        {(selectedStudentId && studentSearch) || (selectedSubjectId && selectedSubjectForMarking) ? (
                            <div className="bg-base-200 p-3 rounded-lg text-sm italic w-full md:col-span-2">
                                Mark will be inserted for <span className="font-bold text-info">{selectedStudentId ? studentSearch : '...'}</span> of <span className='text-accent font-bold uppercase'>{allStudentsForMarks && allStudentsForMarks?.length === 1 ? allStudentsForMarks[0]?.department?.department_name : '...'}</span> for <span className="font-bold text-success">{selectedSubjectId ? `${selectedSubjectForMarking?.subject?.subject_title} (${selectedSubjectForMarking?.subject?.subject_code})` : '...'}</span> Subject
                            </div>
                        ) : null}

                        <div className="modal-action flex items-center justify-end md:col-span-2">
                            <div className="flex gap-2">
                                <button type="button" className="btn btn-ghost" onClick={() => {
                                    reset();
                                    setStudentSearch("");
                                    setSelectedSubjectForMarking(null);
                                    setValue("studentId", "");
                                    setIsOpen(false);
                                    // @ts-ignore
                                    document.getElementById('insert_marks_modal').close();
                                }}>Cancel</button>
                                <button type="submit" className="btn btn-primary min-w-[120px]" disabled={isLoading}>
                                    {isLoading ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Insert Marks"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default InsertMarks;