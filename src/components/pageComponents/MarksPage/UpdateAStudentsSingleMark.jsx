// @ts-nocheck
import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure.jsx';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaEdit } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import errorMessageParser from '../../../utils/errorMessageParser/errorMessageParser.js';

const UpdateAStudentsSingleMark = ({ mark, allMarksWithFiltersRefetch }) => {
    const axiosSecure = useAxiosSecure();
    const modalId = `update_mark_modal_${mark?.id}`; // unique id for each row to avoid always showing the first data
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
        defaultValues: {
            // Autofill marks
            updatedAssignmentMark: mark?.assignment_mark,
            updatedClassTestMark: mark?.class_test_mark,
            updatedMidtermMark: mark?.midterm_mark,
            updatedFinalExamMark: mark?.final_exam_mark,

            // Autofill result status
            updatedResultStatus: mark?.result_status || "unpublished", // published or unpublished

            // Autofill result challenge status
            updatedResultChallengeStatus: mark?.result_challenge_status || "none", // challenged, resolved or none
            updatedResultChallengePaymentStatus: mark?.result_challenge_payment_status !== null ? mark?.result_challenge_payment_status.toString() : "false", // paid or not (true, false or null)
        }
    });

    // Add a state to track if THIS specific modal is open
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    console.log(mark);


    // Update Mark Function
    const updateStudentsMark = async (data) => {
        console.log(data);
        //     const update_data = {
        //         taught_by_id: null
        //     };

        //     if (Object.keys(update_data).length === 0) {
        //         // @ts-ignore
        //         document.getElementById(modalId).close();
        //         return toast.error("No changes made. Change at least one field to update.");
        //     }

        //     try {
        //         setIsLoading(true);
        //         const res = await axiosSecure.patch(`/subject_offering/${assignedCourse?.id}`, update_data);
        //         toast.success(res?.data?.message || 'Course assignment updated successfully');
        //         // @ts-ignore
        //         document.getElementById(modalId).close();
        //         reset();
        //     } catch (error) {
        //         console.log(error);
        //         // @ts-ignore
        //         document.getElementById(modalId).close();
        //         const message = errorMessageParser(error);
        //         toast.error(message || 'Failed to update mark');
        //     } finally {
        //         reset();
        //         setIsLoading(false);
        //         allMarksWithFiltersRefetch();
        //     }
    };

    // console.log(mark);

    return (
        <div>
            <div>
                {/* Create New Course Assignment Modal */}
                <button className='btn btn-ghost bg-transparent border-0 shadow-none btn-primary hover:bg-primary hover:text-white' onClick={() => {
                    setIsOpen(true);
                    // @ts-ignore
                    document.getElementById(modalId).showModal()
                }}>
                    <FaEdit className='text-sm' />
                </button>

                <dialog id={modalId} onClose={() => setIsOpen(false)} className="modal">
                    <div className="modal-box max-w-3xl">
                        <div className='mb-6 border-b pb-2'>
                            <h3 className="font-bold text-2xl mb-2">Update Mark & Result Status</h3>
                            <h3 className='text-lg'>Name: {mark?.student?.name || ""}</h3>

                            <div className='flex gap-2'>
                                <h3 className='text-lg'>Registration: {mark?.student?.registration || ""}</h3>
                                <div className='divider divider-horizontal'></div>
                                <h3 className='text-lg'>Session: {mark?.student?.session || ""}</h3>
                            </div>

                        </div>

                        <form onSubmit={handleSubmit(updateStudentsMark)} className="space-y-6">

                            <div className='grid grid-cols-2 gap-3'>
                                {/* Class Test */}
                                <fieldset className="space-y-1 fieldset"
                                >
                                    <label className="label font-semibold">Class Test</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        {...register("updatedClassTestMark", {
                                            valueAsNumber: true,
                                            min: {
                                                value: 0,
                                                message: "Must be greater than 0"
                                            },
                                            max: {
                                                value: 20,
                                                message: "Must be less than or equal to 20"
                                            }
                                        })}
                                        placeholder="Enter Class Test Mark"
                                        className="input input-bordered w-full"
                                    />
                                    {errors.updatedClassTestMark ? <span className='text-error text-xs'>{errors?.updatedClassTestMark?.message}</span> : <span className='text-xs text-warning'>Range: 0 - 20</span>}
                                </fieldset>

                                {/* Assignment Mark */}
                                <fieldset className="space-y-1 fieldset"
                                >
                                    <label className="label font-semibold">Assignment</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        {...register("updatedAssignmentMark", {
                                            valueAsNumber: true,
                                            min: {
                                                value: 0,
                                                message: "Must be greater than 0"
                                            },
                                            max: {
                                                value: 20,
                                                message: "Must be less than or equal to 20"
                                            }
                                        })}
                                        placeholder="Enter Assignment Mark"
                                        className="input input-bordered w-full"
                                    />
                                    {errors.updatedAssignmentMark ? <span className='text-error text-xs'>{errors?.updatedAssignmentMark?.message}</span> : <span className='text-xs text-warning'>Range: 0 - 20</span>}
                                </fieldset>

                                {/* Midterm Mark */}
                                <fieldset className="space-y-1 fieldset"
                                >
                                    <label className="label font-semibold">Midterm</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        {...register("updatedMidtermMark", {
                                            valueAsNumber: true,
                                            min: {
                                                value: 0,
                                                message: "Must be greater than 0"
                                            },
                                            max: {
                                                value: 20,
                                                message: "Must be less than or equal to 20"
                                            }
                                        })}
                                        placeholder="Enter Midterm Mark"
                                        className="input input-bordered w-full"
                                    />
                                    {errors.updatedMidtermMark ? <span className='text-error text-xs'>{errors?.updatedMidtermMark?.message}</span> : <span className='text-xs text-warning'>Range: 0 - 20</span>}
                                </fieldset>

                                {/* Final Exam Mark */}
                                <fieldset className="space-y-1 fieldset">
                                    <label className="label font-semibold">Final Exam</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        {...register("updatedFinalExamMark", {
                                            valueAsNumber: true,
                                            min: {
                                                value: 0,
                                                message: "Must be greater than 0"
                                            },
                                            max: {
                                                value: 80,
                                                message: "Must be less than or equal to 80"
                                            }
                                        })}
                                        placeholder="Enter Final Exam Mark"
                                        className="input input-bordered w-full"
                                    />
                                    {errors.updatedFinalExamMark ? <span className='text-error text-xs'>{errors?.updatedFinalExamMark?.message}</span> : <span className='text-xs text-warning'>Range: 0 - 80</span>}
                                </fieldset>

                                {/* Result Status */}
                                <fieldset className="space-y-1 fieldset">
                                    <label className="label font-semibold">Result Status</label>
                                    <select
                                        {...register("updatedResultStatus")}
                                        className="select select-bordered w-full max-w-xs">
                                        <option value="published">Published</option>
                                        <option value="unpublished">Unpublished</option>
                                    </select>
                                </fieldset>

                                {/* result challenge status is not "none" */}
                                {
                                    mark?.result_challenge_status !== "none" &&
                                    (
                                        <>
                                            {/* Result Challenge Status */}
                                            <fieldset className="space-y-1 fieldset">
                                                <label className="label font-semibold">Challenge Status</label>
                                                <select
                                                    {...register("updatedResultChallengeStatus")}
                                                    className={`select select-bordered w-full max-w-xs ${mark?.result_challenge_status === "resolved" && "border-success"} ${mark?.result_challenge_status === "challenged" && "border-error"}`}>
                                                    <option disabled value="none">Not Challenged</option>
                                                    <option value="challenged">Challenged</option>
                                                    <option value="resolved">Resolved</option>
                                                </select>
                                            </fieldset>

                                            {/* Challenge Payment Status */}
                                            <fieldset className="space-y-1 fieldset">
                                                <label className="label font-semibold">Challenge payment Status</label>
                                                <select
                                                    {...register("updatedResultChallengePaymentStatus")}
                                                    className={`select select-bordered w-full max-w-xs ${mark?.result_challenge_payment_status === false && "border-error"} ${mark?.result_challenge_payment_status === true && "border-success"}`}>
                                                    <option value="true">Paid</option>
                                                    <option value="false">Not Paid</option>
                                                </select>
                                                <span className='text-xs text-warning'>Update after receiving payment receipts</span>
                                            </fieldset>
                                        </>
                                    )}
                            </div>


                            {/* close modal and submit */}
                            <div className="modal-action flex items-center justify-end">
                                <button type="button" className="btn btn-ghost" onClick={() => {
                                    setIsOpen(false);
                                    // @ts-ignore
                                    document.getElementById(modalId).close();
                                    reset();
                                    allMarksWithFiltersRefetch();
                                }}>Cancel</button>
                                <button className="btn btn-primary min-w-[120px]" disabled={isLoading}>
                                    {isLoading ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            </div >
        </div >
    );
};

export default UpdateAStudentsSingleMark;