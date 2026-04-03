import { useQuery } from '@tanstack/react-query';
import InsertMarks from '../../components/pageComponents/MarksPage/InsertMarks.jsx';
import SectionHeader from '../../utils/SectionHeader/SectionHeader.jsx';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import { useEffect, useState } from 'react';
import errorMessageParser from '../../utils/errorMessageParser/errorMessageParser.js';
import { toast } from 'react-hot-toast';
import useAuth from '../../hooks/useAuth.jsx';
import { MdDelete } from 'react-icons/md';
import useTheme from '../../hooks/useTheme.jsx';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import UpdateAStudentsSingleMark from '../../components/pageComponents/MarksPage/UpdateAStudentsSingleMark.jsx';
import { FaCheckCircle } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useDebounce } from '../../hooks/useDebounce.jsx';
import { Link } from 'react-router-dom';

const Marks = () => {
    const [theme] = useTheme();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [selectedMark, setSelectedMark] = useState(null);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [activeIndexForAccordion, setActiveIndexForAccordion] = useState(0);


    const result_status_with_color = {
        'published': `badge badge-sm ${theme === 'dark' && 'badge-soft'} badge-success`,
        'unpublished': `badge badge-sm ${theme === 'dark' && 'badge-soft'} badge-warning`,
    }

    const result_challenge_status_with_color = {
        'challenged': `badge badge-sm ${theme === 'dark' && 'badge-soft'} badge-error`,
        'resolved': `badge badge-sm ${theme === 'dark' && 'badge-soft'} badge-success`,
        'none': `badge badge-sm badge-neutral`,
    }

    const result_challenge_timeline_with_color = {
        'challenged': `success`,
        'resolved': `success`,
        'none': ``,
        true: `success`,
        false: `warning`,
        null: ``,
    }

    const gpa_with_color = {
        4.0: 'text-emerald-600',
        3.75: 'text-green-600',
        3.5: 'text-teal-600',
        3.25: 'text-cyan-600',
        3.0: 'text-sky-600',
        2.75: 'text-blue-600',
        2.5: 'text-yellow-600',
        2.25: 'text-amber-600',
        2.0: 'text-orange-600',
        0.0: 'text-red-600',
    }

    // Filter
    const [filters, setFilters] = useState({
        search: "",
        department_id: "",
        semester_id: "",
        result_status: localStorage.getItem("result_status") || "",
    });

    // debounce the search string by 500ms(wait 500ms before making the request send after user stop typing)
    const debouncedSearch = useDebounce(filters.search, 500);

    // Fetch All Marks
    const { data: allMarksWithFilters, isPending: isAllMarksPending, error: allMarksError, isError: isAllMarksError, refetch: allMarksWithFiltersRefetch } = useQuery({
        queryKey: ['allMarksWithFilters', filters.department_id, filters.semester_id, filters.result_status, debouncedSearch],
        queryFn: async () => {
            const params = new URLSearchParams();

            if (filters.department_id) params.append('department_id', filters.department_id);
            if (filters.semester_id) params.append('semester_id', filters.semester_id);
            if (filters.result_status) params.append('result_status', filters.result_status);

            // Use the debounced value for the API call
            if (debouncedSearch) params.append('session', debouncedSearch);

            const res = await axiosSecure(`/marks/get_all_marks_with_filters?${params.toString()}`);
            return res.data;
        },
        enabled: !!user
    })

    // Handler to update filters
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (isAllMarksError) {
            console.log(allMarksError);
            const message = errorMessageParser(allMarksError);
            toast.error(message || "Failed to fetch all marks data");
        }
    }, [isAllMarksError])


    // Fetch departments
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

    // Fetch SEMESTERS
    const { data: allSemesters, isPending: isSemesterPending, error: semesterError, isError: isSemesterError, refetch: totalSemestersRefetch } = useQuery({
        queryKey: ['totalSemesters'],
        queryFn: async () => {
            const res = await axiosSecure('/semesters/');
            return res.data;
        }
    })

    useEffect(() => {
        if (isSemesterError) {
            console.log(semesterError);
            const message = errorMessageParser(semesterError);
            toast.error(message || "Failed to fetch semesters");
        }
    }, [isSemesterError])

    // delete mark
    const deleteStudentsMarks = async (id) => {
        try {
            setIsFormLoading(true);
            const res = await axiosSecure.delete(`/marks/${id}`);
            // @ts-ignore
            document.getElementById('delete_a_mark_modal').close();
            allMarksWithFiltersRefetch();
            toast.success(res?.data?.message);
        } catch (error) {
            console.log(error);
            // @ts-ignore
            document.getElementById('delete_a_mark_modal').close();
            const message = errorMessageParser(error);
            toast.error(message || 'Failed to delete marks for this student');
        } finally {
            setIsFormLoading(false);
            setSelectedMark(null);
            allDepartmentsRefetch();
        }
    }

    // publish result in bulk
    const publish_result_bulk = async (department_id, semester_id, session) => {
        const update_data = {
            semester_id: semester_id,
            department_id: department_id,
            session: session
        }
        try {
            setIsFormLoading(true);
            const res = await axiosSecure.patch("/marks/batch_publish", update_data);
            allMarksWithFiltersRefetch();
            toast.success(res?.data?.message);
        } catch (error) {
            console.log(error);
            const message = errorMessageParser(error);
            toast.error(message || 'Failed to publish results');
        } finally {
            setIsFormLoading(false);
            allDepartmentsRefetch();
            totalSemestersRefetch();
            allMarksWithFiltersRefetch();
        }
    }

    return (
        <div className='bg-base-100 p-4 rounded-xl min-h-dvh'>
            <div className='flex justify-between'>
                <SectionHeader section_title="All Marks" />

                <InsertMarks
                    allMarksWithFiltersRefetch={allMarksWithFiltersRefetch}
                    allDepartmentsRefetch={allDepartmentsRefetch}
                    totalSemestersRefetch={totalSemestersRefetch}
                />
            </div>

            {/* Show all marks */}
            <div>
                {/* 3. Filter UI Section */}
                <div className="grid grid-cols-1 md:grid-cols-10 gap-4 mb-6">

                    {/* Department Select */}
                    <div className="form-control md:col-span-3">
                        <label className="label">Department</label>
                        <select
                            name="department_id"
                            className="select w-full uppercase"
                            disabled={isAllDepartmentsPending}
                            value={filters.department_id}
                            onChange={handleFilterChange}
                        >
                            <option value="">All</option>
                            {allDepartments?.map(department => (
                                <option key={department.id} value={department.id}>{department.department_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Semester Select */}
                    <div className="form-control md:col-span-2">
                        <label className="label">Semester</label>
                        <select
                            name="semester_id"
                            className="select w-full uppercase"
                            disabled={isSemesterPending}
                            value={filters.semester_id}
                            onChange={handleFilterChange}
                        >
                            <option value="">All</option>
                            {allSemesters?.map(semester => (
                                <option key={semester.id} value={semester.id}>{semester.semester_number}</option>
                            ))}
                        </select>
                    </div>

                    {/* Result Status */}
                    <div className="form-control md:col-span-2">
                        <label className="label">Status</label>
                        <select
                            name="result_status"
                            className="select w-full uppercase"
                            value={filters.result_status}
                            onChange={(e) => {
                                localStorage.setItem("result_status", e.target.value);
                                handleFilterChange(e);
                            }}
                        >
                            <option value="">All</option>
                            <option value="published">Published</option>
                            <option value="unpublished">Unpublished</option>
                        </select>
                    </div>

                    {/* Search by session */}
                    <div className="form-control md:col-span-2">
                        <label className="label">Session</label>
                        <input
                            type="text"
                            name="search"
                            placeholder="session.."
                            className="input input-bordered w-full"
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                    </div>

                    {/* Reset Button */}
                    <div className="md:col-span-1 md:place-self-center md:mt-5">
                        <button
                            className={`btn btn-error text-sm ${theme == "light" ? "text-white" : "text-black"}`}
                            onClick={() => {
                                setFilters({
                                    search: "",
                                    department_id: "",
                                    semester_id: "",
                                    result_status: "",
                                })
                                localStorage.removeItem("result_status")
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {isAllMarksPending && <p className='text-center text-xl font-semibold text-error'>Loading...</p>}

                {allMarksWithFilters?.length === 0 && <p className='text-center text-xl font-semibold text-error'>No marks found</p>}
                {
                    allMarksWithFilters?.length > 0 &&
                    allMarksWithFilters?.map((category, idx) =>
                        <div key={`${category.department_name}-${category.semester_name}-${category.session}`} className="collapse collapse-arrow bg-base-100 border border-base-300">
                            <input
                                type="radio"
                                name="my-accordion-2"
                                checked={activeIndexForAccordion === idx}
                                onChange={() => setActiveIndexForAccordion(idx)}
                            />

                            <div className="collapse-title font-semibold capitalize">
                                {category.department_name.split(" - ")[0].toUpperCase()} - {category.semester_name} Semester ({category.session})
                            </div>

                            <div className="collapse-content text-sm">
                                <div className='text-end'>
                                    <button onClick={() => publish_result_bulk(category.department_id, category.semester_id, category.session)} className="btn btn-sm btn-success" disabled={isFormLoading}>Publish Result</button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="table table-xs table-pin-cols">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Reg</th>
                                                <th>Subject</th>
                                                <th>Marks <br /> (categorized)</th>
                                                <th>Total</th>
                                                <th>GPA</th>
                                                <th className='text-center'>Status</th>
                                                <th>Challenged</th>
                                                <th>Entered</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(category?.marks?.length > 0) &&
                                                category?.marks?.map((mark, index) =>
                                                    <tr key={mark?.id}>
                                                        <th>{index + 1}</th>
                                                        <td>
                                                            <Link
                                                                className='link link-hover link-info'
                                                                target='_blank'
                                                                to={`/admin/user/${mark?.student?.user_id}`}>
                                                                {mark?.student?.name}
                                                            </Link>
                                                        </td>

                                                        <td className='text-center'>{mark?.student?.registration}</td>

                                                        <td>{mark?.subject?.subject_title}</td>

                                                        {/* marks categorized */}
                                                        <td>
                                                            <span className='block'>CT: {mark?.class_test_mark === null ? <button className='text-error  opacity-50'>N/A</button> : mark?.class_test_mark}</span>

                                                            <span className='block my-1'>Assignment: {mark?.assignment_mark === null ? <button className='text-error opacity-50'>N/A</button> : mark?.assignment_mark}</span>

                                                            <span className='block'>Mid: {mark?.midterm_mark === null ? <button className='text-error  opacity-50'>N/A</button> : mark?.midterm_mark}</span>

                                                            <span className='block mt-1'>Final Exam: {mark?.final_exam_mark === null ? <button className='text-error  opacity-50'>N/A</button> : mark?.final_exam_mark}</span>
                                                        </td>


                                                        {/* Total Mark */}
                                                        <td className='text-center'>{mark?.total_mark}</td>

                                                        {/* GPA */}
                                                        <td className={`text-center ${gpa_with_color[mark?.GPA]}`}>{mark?.GPA}</td>

                                                        {/* result status */}
                                                        <td className='text-center'>
                                                            <button className={`border capitalize ${result_status_with_color[mark?.result_status]}`}>
                                                                {mark?.result_status}
                                                            </button>
                                                        </td>

                                                        {/* challenged status */}
                                                        <td className='text-center'>
                                                            <div className='flex items-center justify-center'>
                                                                <button className={`border capitalize ${result_challenge_status_with_color[mark?.result_challenge_status]}`}>
                                                                    {mark?.result_challenge_status}
                                                                </button>

                                                                {/* add a dropdown to show challenged details */}
                                                                <button className={`${mark?.result_challenge_status === 'none' ? 'hidden' : ''} btn btn-xs btn-circle btn-ghost hover:bg-transparent border-none`} popoverTarget={`popover-${mark?.id}`} style={{ anchorName: `--anchor-${mark?.id}` } /* as React.CSSProperties */}>
                                                                    <IoMdArrowDropdown />
                                                                </button>
                                                            </div>

                                                            {/* TIMELINE */}
                                                            <div className='dropdown dropdown-end shadow-2xl bg-base-300 glass rounded-2xl p-1'
                                                                popover='auto'
                                                                id={`popover-${mark?.id}`}
                                                                style={{ positionAnchor: `--anchor-${mark?.id}` }}
                                                            >
                                                                <p className='text-base font-semibold uppercase'>Progress</p>
                                                                <ul className="timeline timeline-vertical">
                                                                    {/* Show status */}
                                                                    <li>
                                                                        <div className="timeline-start">Challenge Status</div>
                                                                        <div className="timeline-middle">
                                                                            {/* Color for the check mark based on the status */}
                                                                            <FaCheckCircle className={`text-${result_challenge_timeline_with_color[mark?.result_challenge_status]}`} />
                                                                        </div>
                                                                        <div className="timeline-end timeline-box border-none">{mark?.result_challenge_status}</div>

                                                                        {/* the line Color after the status check mark based on the status */}
                                                                        <hr className={`bg-${result_challenge_timeline_with_color[mark?.result_challenge_status]}`} />
                                                                    </li>

                                                                    {/* Show challenged date */}
                                                                    <li>
                                                                        {/* upper line Color for the status check mark based on the status */}
                                                                        <hr className={`bg-${result_challenge_timeline_with_color[mark?.result_challenge_status]}`} />
                                                                        <div className="timeline-start">Challenged At</div>
                                                                        <div className="timeline-middle">
                                                                            {/* Color for the check mark based on the status */}
                                                                            <FaCheckCircle className={`text-${result_challenge_timeline_with_color[mark?.result_challenge_status]}`} />
                                                                        </div>
                                                                        <div className="timeline-end timeline-box border-none">{mark?.challenged_at && mark?.challenged_at.split("T")[0] || "N/A"}</div>

                                                                        {/* the lower line Color of the challenged at check mark based on the payment status */}
                                                                        <hr className={`bg-${result_challenge_timeline_with_color[(mark?.result_challenge_status === 'challenged' && mark?.result_challenge_payment_status === null) ? false : mark?.result_challenge_payment_status]}`} />
                                                                    </li>

                                                                    {/* show payment status */}
                                                                    <li>
                                                                        {/* the upper line Color of the payment status check mark based on the payment status */}
                                                                        <hr className={`bg-${result_challenge_timeline_with_color[(mark?.result_challenge_status === 'challenged' && mark?.result_challenge_payment_status === null) ? false : mark?.result_challenge_payment_status]}`} />
                                                                        <div className="timeline-start">Payment Status</div>
                                                                        <div className="timeline-middle">
                                                                            {
                                                                                mark?.result_challenge_payment_status === true && <FaCheckCircle className={`text-${result_challenge_timeline_with_color[mark?.result_challenge_payment_status]}`} />
                                                                            }

                                                                            {
                                                                                mark?.result_challenge_payment_status === false && <FaCheckCircle className={`text-${result_challenge_timeline_with_color[mark?.result_challenge_payment_status]}`} />
                                                                            }

                                                                            {
                                                                                (mark?.result_challenge_status === 'challenged' && mark?.result_challenge_payment_status === null) && <FaCheckCircle className={`text-${result_challenge_timeline_with_color[(mark?.result_challenge_status === 'challenged' && mark?.result_challenge_payment_status === null) ? false : mark?.result_challenge_payment_status]}`} />
                                                                            }
                                                                        </div>
                                                                        <div className="timeline-end timeline-box border-none">
                                                                            {mark?.result_challenge_payment_status === true && "Paid"}
                                                                            {mark?.result_challenge_payment_status === false && "Not Paid"}
                                                                            {mark?.result_challenge_payment_status === null && "N/A"}
                                                                        </div>

                                                                        {/* the lower line Color of the payment status check mark based on the payment status */}
                                                                        <hr className={`bg-${result_challenge_timeline_with_color[(mark?.result_challenge_status === 'challenged' && mark?.result_challenge_payment_status === null) ? false : mark?.result_challenge_payment_status]}`} />
                                                                    </li>

                                                                    {/* show payment time */}
                                                                    <li>
                                                                        {/* the upper line Color of the payment time check mark based on the payment status */}
                                                                        <hr className={`bg-${result_challenge_timeline_with_color[(mark?.result_challenge_status === 'challenged' && mark?.result_challenge_payment_status === null) ? false : mark?.result_challenge_payment_status]}`} />

                                                                        <div className="timeline-start">Payment Time</div>
                                                                        <div className="timeline-middle">
                                                                            <FaCheckCircle className={`text-${result_challenge_timeline_with_color[(mark?.result_challenge_status === 'challenged' && mark?.result_challenge_payment_status === null) ? false : mark?.result_challenge_payment_status]}`} />
                                                                        </div>
                                                                        <div className="timeline-end timeline-box border-none">{mark?.challenge_payment_time !== null && mark?.challenge_payment_time.split("T")[0] || "Not Paid"}</div>

                                                                        {/* the lower line Color of the payment time check mark based on the payment status */}
                                                                        <hr className={`bg-${result_challenge_timeline_with_color[mark?.challenge_resolved_at && true || false]}`} />
                                                                    </li>

                                                                    {/* Challenged Resolved date */}
                                                                    <li>
                                                                        {/* the upper line Color of the resolved time check mark based on the payment status */}
                                                                        <hr className={`bg-${result_challenge_timeline_with_color[mark?.challenge_resolved_at && true || false]}`} />
                                                                        <div className="timeline-start">Resolved At</div>
                                                                        <div className="timeline-middle">
                                                                            <FaCheckCircle className={`text-${result_challenge_timeline_with_color[mark?.challenge_resolved_at && true || null]}`} />
                                                                        </div>
                                                                        <div className="timeline-end timeline-box border-none">{mark?.challenge_resolved_at && mark?.challenge_resolved_at.split("T")[0] || "Not Resolved"}</div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </td>

                                                        {/* created at */}
                                                        <td>{mark?.created_at?.split("T")[0]}</td>

                                                        {/* action */}
                                                        <td>
                                                            {/* update marks button */}
                                                            <UpdateAStudentsSingleMark
                                                                mark={mark}
                                                                allMarksWithFiltersRefetch={allMarksWithFiltersRefetch}
                                                            />

                                                            {/* Delete mark confirmation Modal */}
                                                            {
                                                                user?.role === "super_admin" &&
                                                                <>
                                                                    <button className="btn btn-ghost bg-transparent border-0 shadow-none btn-error hover:bg-error hover:text-white"
                                                                        onClick={() => {
                                                                            setSelectedMark(mark);
                                                                            document.getElementById('delete_a_mark_modal').
                                                                                // @ts-ignore
                                                                                showModal()
                                                                        }}
                                                                    >
                                                                        <MdDelete className='text-lg' />
                                                                    </button>
                                                                </>}
                                                        </td>
                                                    </tr>
                                                )}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Reg</th>
                                                <th>Subject</th>
                                                <th>Marks<br /> (categorized)</th>
                                                <th>Total</th>
                                                <th>GPA</th>
                                                <th className='text-center'>Status</th>
                                                <th>Challenged</th>
                                                <th>Entered</th>
                                                <th>Action</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>


            {/* Modals */}
            {/* delete subject mark modal */}
            <dialog id="delete_a_mark_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-error uppercase">Be Careful!!!</h3>
                    <p className="py-4">
                        <span className="font-semibold block mb-2">Are you sure you want to delete this students marks?</span>
                        <span className="font-bold block underline">Details:</span>
                        Name: <span className="text-info">{selectedMark?.student?.name || "N/A"}</span> <br />
                        Registration: <span className="font-medium text-info">{selectedMark?.student?.registration || "N/A"}</span> <br />
                        Session: <span className="font-medium text-info">{selectedMark?.student?.session || "N/A"}</span>
                        <br /> Department: <span className="font-medium uppercase text-info">
                            {(selectedMark?.student?.department && (selectedMark?.student?.department?.department_name)?.split(/\s*[-\u2013\u2014]\s*/)[0]) || "N/A"}
                        </span> <br /> Subject: <span className="font-medium capitalize text-info">{selectedMark?.subject?.subject_title}</span> <span className="text-sm text-info italic">({selectedMark?.subject?.subject_code})</span> <br />
                        Marks for <span className="font-medium capitalize text-info">{selectedMark?.semester?.semester_name} Semester</span>
                    </p>
                    <p className='text-warning text-sm font-semibold'>Once deleted, This can not be reversed!!</p>
                    <div className="modal-action">
                        <button
                            onClick={() => deleteStudentsMarks(selectedMark?.id)}
                            className={`btn ${isFormLoading ? "btn-disabled" : "btn-error"} ${theme === "dark" ? "text-black" : "text-white"}`}
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

export default Marks;