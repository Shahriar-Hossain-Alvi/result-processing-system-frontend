import { useQuery } from '@tanstack/react-query';
import InsertMarks from '../../components/pageComponents/MarksPage/InsertMarks.jsx';
import SectionHeader from '../../utils/SectionHeader/SectionHeader.jsx';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import { useEffect } from 'react';
import errorMessageParser from '../../utils/errorMessageParser/errorMessageParser.js';
import toast from 'react-hot-toast';

const Marks = () => {
    const axiosSecure = useAxiosSecure();

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
        <div>
            <div className='flex justify-between'>
                <SectionHeader section_title="Insert & Update Marks" />

                <InsertMarks allMarksWithFiltersRefetch={allMarksWithFiltersRefetch} />
            </div>

            {/* Show all marks */}
            <div>
                <h2>All Marks</h2>
                {
                    allMarksWithFilters?.length > 0 &&
                    allMarksWithFilters?.map((category) =>
                        <div key={`${category.department_name}-${category.semester_name}-${category.session}`} className="collapse collapse-arrow bg-base-100 border border-base-300">
                            <input type="radio" name="my-accordion-2" />
                            <div className="collapse-title font-semibold capitalize">{category.department_name.split(" - ")[0].toUpperCase()} - {category.semester_name} Semester ({category.session})</div>
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
                                                <th>Challenged(if yes show the date)</th>
                                                <th>Entered</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {category?.marks?.length === 0 && <tr><td colSpan={15} className="text-center">No marks found</td></tr>}
                                            {category?.marks?.length > 0 && category?.marks?.map((mark, index) =>
                                                <tr key={mark?._id}>
                                                    <th>{index + 1}</th>
                                                    <td>{mark?.student?.name}</td>

                                                    <td className='text-center'>{mark?.student?.registration}</td>

                                                    <td>{mark?.subject?.subject_title}</td>

                                                    {/* Class Test Mark */}
                                                    <td className='text-center'>{mark?.class_test_mark === null ? <button className='text-error'>N/A</button> : mark?.class_test_mark}</td>

                                                    {/* Assignment Mark */}
                                                    <td className='text-center'>{mark?.assignment_mark === null ? <button className='text-error'>N/A</button> : mark?.assignment_mark}</td>

                                                    {/* Midterm Mark */}
                                                    <td className='text-center'>{mark?.midterm_mark === null ? <button className='text-error'>N/A</button> : mark?.midterm_mark}</td>

                                                    {/* Final Mark */}
                                                    <td className='text-center'>{mark?.final_exam_mark === null ? <button className='text-error'>N/A</button> : mark?.final_exam_mark}</td>

                                                    {/* Total Mark */}
                                                    <td className='text-center'>{mark?.total_mark}</td>

                                                    {/* GPA */}
                                                    <td className='text-center'>{mark?.GPA}</td>
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
                                                <th>Challenged(if yes show the date)</th>
                                                <th>Entered</th>
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