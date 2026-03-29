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

    console.log(allResults);

    useEffect(() => {
        if (isError) {
            console.log(error);
            const message = errorMessageParser(error);
            toast.error(message || "Failed to fetch all results");
        }
    }, [isError])

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
            Challenge Initiation: give options to initiate challenge under 7 days <br />

            GPA/CGPA Calculation: Show GPA/CGPA after each semesters marks <br />
            <SectionHeader section_title="Your Marks" />

            <div>
                {isPending && <LoadingSpinner />}
                {allResults?.length === 0 && <h2 className="text-xl font-semibold">No Published Results found</h2>}
                {
                    !isPending && allResults?.length > 0 && allResults?.map((result, idx) => (
                        <div key={idx} className="mb-5">
                            <h2 className="uppercase text-center text-xl font-semibold underline">{result?.semester_name} Semester</h2>
                            {result.subject_name}

                            <div className="overflow-x-auto">
                                <table className="table">
                                    {/* head */}
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Subject</th>
                                            <th>Marks (categorized) </th>
                                            <th className='text-center'>Total</th>
                                            <th className='text-center'>GPA</th>
                                            <th className='text-center'>Challenge Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result?.marks?.map((mark, number) => (
                                            <tr className="hover:bg-base-300" key={mark?.id}>
                                                <th>{number + 1}</th>
                                                <td>
                                                    <span className='block font-medium'>{mark?.subject?.subject_title}</span>
                                                    <span className='text-xs opacity-70 block'>Code: {mark?.subject?.subject_code}</span>
                                                    <span className='text-xs opacity-70'>Credits: {mark?.subject?.credits}</span>
                                                </td>

                                                <td>
                                                    <span>Assignment - {mark?.assignment_mark}</span> <br />
                                                    <span>Class Test - {mark?.class_test_mark}</span> <br />
                                                    <span>Midterm - {mark?.midterm_mark}</span> <br />
                                                    <span>Final Exam - {mark?.final_exam_mark}</span>
                                                </td>

                                                <td className='text-center'>{mark?.total_mark}</td>
                                                <td className='text-center'>{mark?.GPA}</td>

                                                {
                                                    mark?.result_challenge_status === "none" &&
                                                    <td className='text-center'>
                                                        <span className='text-xs block'>Not Challenged</span>
                                                        <button className="btn btn-xs btn-error mt-1" onClick={() => {
                                                            document.getElementById('challenge_result_modal').
                                                                // @ts-ignore
                                                                showModal()
                                                            setSelectedMarkForChallenge(mark)
                                                        }}>Challenge?</button>
                                                    </td>

                                                }
                                                {
                                                    mark?.result_challenge_status !== "none" &&
                                                    <td>
                                                        <span className='block capitalize'>Status: {mark?.result_challenge_status}</span>

                                                        <span className='block my-1'>Challenged At: {mark?.challenged_at?.split("T")[0]}</span>

                                                        <span className='block'>Payment Status: {mark?.result_challenge_payment_status || <span className='text-error'>Not paid</span>}</span>

                                                        <span className='block my-1'>Payment Time: {mark?.challenge_payment_time || <span className='text-error'>Not paid</span>}</span>

                                                        <span className='block'>Resolved At: {mark?.challenge_resolved_at?.split["T"][0] || <span className='text-error'>Not Resolved</span>}</span>
                                                    </td>
                                                }
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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