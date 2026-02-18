import { useQuery } from '@tanstack/react-query';
import InsertMarks from '../../components/pageComponents/MarksPage/InsertMarks.jsx';
import SectionHeader from '../../utils/SectionHeader/SectionHeader.jsx';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import { useEffect } from 'react';
import errorMessageParser from '../../utils/errorMessageParser/errorMessageParser.js';
import toast from 'react-hot-toast';
import { FaEye } from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth.jsx';
import { MdDelete } from 'react-icons/md';
import useTheme from '../../hooks/useTheme.jsx';

const Marks = () => {
    const [theme] = useTheme();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const result_status_with_color = {
        'published': `badge badge-sm ${theme === 'dark' && 'badge-soft'} badge-success`,
        'challedged': `badge badge-sm ${theme === 'dark' && 'badge-soft'} badge-error`, // TODO: Fix this spelling after fixing from backend
        'unpublished': `badge badge-sm ${theme === 'dark' && 'badge-soft'} badge-warning`,
        'resolved': `badge badge-sm ${theme === 'dark' && 'badge-soft'} badge-success`
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

    // Fetch All Marks
    const { data: allMarksWithFilters, isPending: isAllMarksPending, error: allMarksError, isError: isAllMarksError, refetch: allMarksWithFiltersRefetch } = useQuery({
        queryKey: ['allMarksWithFilters'],
        queryFn: async () => {
            const res = await axiosSecure('/marks/get_all_marks_with_filters');
            return res.data;
        }
    })

    console.log(allMarksWithFilters);

    useEffect(() => {
        if (isAllMarksError) {
            console.log(allMarksError);
            const message = errorMessageParser(allMarksError);
            toast.error(message || "Failed to fetch all marks data");
        }
    }, [isAllMarksError])

    return (
        <div className='bg-base-100 p-4 rounded-xl min-h-dvh'>
            <div className='flex justify-between'>
                <SectionHeader section_title="All Marks" />

                <InsertMarks allMarksWithFiltersRefetch={allMarksWithFiltersRefetch} />
            </div>

            {/* Show all marks */}
            <div>
                {
                    allMarksWithFilters?.length > 0 &&
                    allMarksWithFilters?.map((category) =>
                        <div key={`${category.department_name}-${category.semester_name}-${category.session}`} className="collapse collapse-arrow bg-base-100 border border-base-300">
                            <input type="radio" name="my-accordion-2" defaultChecked />
                            <div className="collapse-title font-semibold capitalize">{category.department_name.split(" - ")[0].toUpperCase()} - {category.semester_name} Semester ({category.session})</div>
                            {category?.marks?.length === 0 && <div className="text-center">No marks found</div>}
                            <div className="collapse-content text-sm">
                                <div className="overflow-x-auto">
                                    <table className="table table-xs">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Registration</th>
                                                <th>Subject</th>
                                                <th>Class Test</th>
                                                <th>Assignment</th>
                                                <th>Midterm</th>
                                                <th>Final</th>
                                                <th>Total</th>
                                                <th>GPA</th>
                                                <th>Status</th>
                                                <th>Entered</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(category?.marks?.length > 0) &&
                                                category?.marks?.map((mark, index) =>
                                                    <tr key={mark?.id}>
                                                        <th>{index + 1}</th>
                                                        <td>{mark?.student?.name}</td>

                                                        <td className='text-center'>{mark?.student?.registration}</td>

                                                        <td>{mark?.subject?.subject_title}</td>

                                                        {/* Class Test Mark */}
                                                        <td className='text-center'>{mark?.class_test_mark === null ? <button className='text-error  opacity-50'>N/A</button> : mark?.class_test_mark}</td>

                                                        {/* Assignment Mark */}
                                                        <td className='text-center'>{mark?.assignment_mark === null ? <button className='text-error opacity-50'>N/A</button> : mark?.assignment_mark}</td>

                                                        {/* Midterm Mark */}
                                                        <td className='text-center'>{mark?.midterm_mark === null ? <button className='text-error  opacity-50'>N/A</button> : mark?.midterm_mark}</td>

                                                        {/* Final Mark */}
                                                        <td className='text-center'>{mark?.final_exam_mark === null ? <button className='text-error  opacity-50'>N/A</button> : mark?.final_exam_mark}</td>

                                                        {/* Total Mark */}
                                                        <td className='text-center'>{mark?.total_mark}</td>

                                                        {/* GPA */}
                                                        <td className={`text-center ${gpa_with_color[mark?.GPA]}`}>{mark?.GPA}</td>

                                                        {/* result status with challenged */}
                                                        <td className=''>
                                                            <button className={`border capitalize ${result_status_with_color[mark?.result_status]}`}>
                                                                {mark?.result_status}
                                                            </button>
                                                            {mark?.challenged_at && mark?.challenged_at.split("T")[0]}
                                                        </td>

                                                        {mark?.challenged_at &&
                                                            <td className={`${mark?.result_challenge_payment_status === true ? "text-success" : "text-error"}`}>
                                                                {mark?.result_challenge_payment_status ? "Paid" : "Not Paid"}
                                                            </td>}

                                                        {/* created at */}
                                                        <td>{mark?.created_at?.split("T")[0]}</td>

                                                        {/* action */}
                                                        <td>
                                                            {/* update marks button */}
                                                            <button className='btn btn-ghost bg-transparent border-0 shadow-none btn-primary hover:bg-primary hover:text-white' onClick={() => {

                                                            }}>
                                                                <FaEdit className='text-sm' />
                                                            </button>

                                                            {/* Delete Course Assignment confirmation Modal */}
                                                            {
                                                                user?.role === "super_admin" &&
                                                                <>
                                                                    <button className="btn btn-ghost bg-transparent border-0 shadow-none btn-error hover:bg-error hover:text-white"
                                                                        onClick={() => {
                                                                            // setSelectedSubjectOffering(assignedCourse);
                                                                            // document.getElementById('delete_subject_offering_modal').
                                                                            // @ts-ignore
                                                                            // showModal()
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
                                                <th>Registration</th>
                                                <th>Subject</th>
                                                <th>Class Test</th>
                                                <th>Assignment</th>
                                                <th>Midterm</th>
                                                <th>Final</th>
                                                <th>Total</th>
                                                <th>GPA</th>
                                                <th>Created</th>
                                                <th>Status</th>
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
        </div>
    );
};

export default Marks;