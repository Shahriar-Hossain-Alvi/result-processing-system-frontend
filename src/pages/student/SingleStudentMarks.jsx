import React, { useEffect, useState } from 'react';
import SectionHeader from '../../utils/SectionHeader/SectionHeader.jsx';
import useAuth from '../../hooks/useAuth.jsx';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import { useQuery } from '@tanstack/react-query';
import errorMessageParser from '../../utils/errorMessageParser/errorMessageParser.js';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

const SingleStudentMarks = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [selectedMarkForChallenge, setSelectedMarkForChallenge] = useState(null);

    const { data: allResults, isPending, error, isError, refetch } = useQuery({
        queryKey: ['allResults'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/marks/student/${user?.id}`)
            return res.data;
        },
        enabled: !!user
    })

    useEffect(() => {
        if (isError) {
            console.log(error);
            const message = errorMessageParser(error);
            toast.error(message || "Failed to fetch all results");
        }
    }, [isError])

    // calculate challenge period
    const calculateChallengePeriod = (date) => {
        const today = new Date();
        const result_creation_date = new Date(date);

        // Check if the date is actually valid before calculating
        if (isNaN(result_creation_date.getTime())) {
            return 99;
        }

        // Difference in milliseconds
        const diffInMs = today.getTime() - result_creation_date.getTime();

        // Convert milliseconds to full days
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        return diffInDays;
    }

    // challenge result
    const challengeResult = async () => {

        try {
            const res = await axiosSecure.patch(`/marks/${selectedMarkForChallenge?.id}`, { result_challenge_status: "challenged" });

            toast.success(res?.data?.message || 'Challenged successfully');
            // @ts-ignore
            document.getElementById('challenge_result_modal').close();
        } catch (error) {
            console.log(error);
            // @ts-ignore
            document.getElementById('challenge_result_modal').close();
            const message = errorMessageParser(error);
            toast.error(message || 'Failed to challenge the result');
        } finally {
            setSelectedMarkForChallenge(null);
            refetch();
        }
    }

    return (
        <div>
            <SectionHeader section_title="Your Marks" />

            <div className='bg-base-100 sm:p-4 rounded-xl py-5'>
                {isPending && <LoadingSpinner />}
                {allResults?.length === 0 && <h2 className="text-xl font-semibold text-center text-error">No Published Results found</h2>}
                {
                    !isPending && allResults?.length > 0 && allResults?.map((result, idx) => (
                        <div key={idx} className="mb-5">
                            <h2 className="uppercase text-center text-xl font-semibold underline">{result?.semester_name} Semester</h2>
                            {result.subject_name}

                            <div className="overflow-x-auto">
                                <table className="table table-xs sm:table-sm">
                                    {/* head */}
                                    <thead className='text-xs sm:text-sm'>
                                        <tr>
                                            <th>#</th>
                                            <th>Subject</th>
                                            <th>Marks (categorized) </th>
                                            <th className='text-center'>Total</th>
                                            <th className='text-center'>GPA</th>
                                            <th className='text-center'>Challenge Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-xs sm:text-base'>
                                        {result?.marks?.map((mark, number) => (
                                            <tr className="hover:bg-base-300" key={mark?.id}>
                                                <th>{number + 1}</th>

                                                <td className='space-y-1'>
                                                    <span className='block font-medium'>{mark?.subject?.subject_title}</span>
                                                    <span className='text-xs opacity-70 block'>Code: {mark?.subject?.subject_code}</span>
                                                    <span className='text-xs opacity-70'>Credits: {mark?.subject?.credits}</span>
                                                </td>

                                                <td className='space-y-1'>
                                                    <span className='block'>Assignment - {mark?.assignment_mark}</span>

                                                    <span className='block'>Class Test - {mark?.class_test_mark}</span>

                                                    <span className='block'>Midterm - {mark?.midterm_mark}</span>

                                                    <span className='block'>Final Exam - {mark?.final_exam_mark}</span>
                                                </td>

                                                <td className='text-center'>{mark?.total_mark}</td>

                                                <td className='text-center'>{mark?.GPA}</td>

                                                {
                                                    mark?.result_challenge_status === "none" &&
                                                    <td className='text-center'>
                                                        <span className='text-xs block'>Not Challenged</span>
                                                        {
                                                            calculateChallengePeriod(mark?.created_at) <= 10 &&
                                                            <button
                                                                className={`btn btn-xs btn-error mt-1`} onClick={() => {
                                                                    document.getElementById('challenge_result_modal').
                                                                        // @ts-ignore
                                                                        showModal()
                                                                    setSelectedMarkForChallenge(mark)
                                                                }}>Challenge?</button>}
                                                    </td>

                                                }
                                                {
                                                    mark?.result_challenge_status !== "none" &&
                                                    <td className='space-y-1'>
                                                        <span className='block capitalize'>Status: {mark?.result_challenge_status}</span>

                                                        <span className='block my-1'>Challenged At: {mark?.challenged_at?.split("T")[0]}</span>

                                                        <span className='block'>Payment Status: {mark?.result_challenge_payment_status === true ? <span className='text-success'>Paid</span> : <span className='text-error'>Not paid</span>}</span>

                                                        <span className='block my-1'>Payment Time: {mark?.challenge_payment_time?.split("T")[0] || <span className='text-error'>Not paid</span>}</span>

                                                        <span className='block'>Resolved At: {mark?.challenge_resolved_at?.split("T")[0] || <span className='text-error'>Not Resolved</span>}</span>
                                                    </td>
                                                }
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className='flex py-5 bg-base-300 justify-between px-5'>
                                <h2 className='capitalize text-center text-success text-lg'>{result?.semester_name} Semester GPA: {result?.semester_gpa}</h2>
                                <h2 className='capitalize text-center text-success text-lg '>CGPA upto this semester: {result?.cgpa_up_to_this_semester}</h2>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* challenge result modal */}
            <dialog id="challenge_result_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-xl text-error">Challenge Result?</h3>

                    <h3 className='text-info text-lg mt-3'>Subject: {selectedMarkForChallenge?.subject?.subject_title}</h3>
                    <h3 className='text-sm opacity-70'>Code: {selectedMarkForChallenge?.subject?.subject_code}</h3>
                    <h3 className='mt-3 font-semibold text-lg underline text-info'>Marks</h3>
                    <div className='grid grid-cols-2 md:grid-cols-3'>
                        <p>Mid: {selectedMarkForChallenge?.midterm_mark}</p>
                        <p>CT: {selectedMarkForChallenge?.class_test_mark}</p>
                        <p>Assignment: {selectedMarkForChallenge?.assignment_mark}</p>
                        <p>Final Exam: {selectedMarkForChallenge?.final_exam_mark}</p>
                        <p>Total: {selectedMarkForChallenge?.total_mark}</p>
                        <p>GPA: {selectedMarkForChallenge?.GPA}</p>
                    </div>

                    <h4 className='text-warning mt-3'>Note:</h4>
                    <p className="pb-4 text-sm">You'll need to pay a fee to complete the challenge process. The evaluation will be started after the payment is completed.</p>

                    <p className='text-sm'>After challenging the result, contact the office and complete the payment process. Otherwise the result will not be evaluated.</p>
                    <div className="modal-action">
                        <button
                            onClick={() => challengeResult()}
                            className='btn btn-success'>Challenge the result</button>
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>


        </div>
    );
};

export default SingleStudentMarks;