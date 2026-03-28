import React, { useEffect } from 'react';
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
    const { data: allResults, isPending, error, isError } = useQuery({
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


    return (
        <div>
            <SectionHeader section_title="Your Marks" />
            All result View: show all result based on semester <br />

            Challenge Initiation: give options to initiate challenge under 7 days <br />

            GPA/CGPA Calculation: Show GPA/CGPA after each semesters marks <br />

            <div>
                {isPending && <LoadingSpinner />}
                {allResults.length === 0 && <h2 className="text-xl font-semibold">No Published Results found</h2>}
                {
                    !isPending && allResults.length > 0 && allResults?.map((result, idx) => (
                        <div key={idx} className="mb-5">
                            <h2 className="uppercase text-center text-xl font-semibold">{result?.semester_name} Semester</h2>
                            {result.subject_name}

                            <div className="overflow-x-auto">
                                <table className="table">
                                    {/* head */}
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Subject</th>
                                            <th>Marks (categorized) </th>
                                            <th>Total</th>
                                            <th>GPA</th>
                                            <th>Result Status</th>
                                            <th>Challenged At</th>
                                            <th>Payment Status</th>
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

                                                <td>{mark?.total_mark}</td>
                                                <td>{mark?.GPA}</td>
                                                <td className='capitalize'>{mark?.result_status}</td>

                                                <td>{mark?.challenged_at}</td>
                                                <td>{mark?.result_challenge_payment_status || "N/A"}</td>
                                                {/* <th>challenge_resolved_at + payment time + result_challenge_payment_status</th> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default SingleStudentMarks;