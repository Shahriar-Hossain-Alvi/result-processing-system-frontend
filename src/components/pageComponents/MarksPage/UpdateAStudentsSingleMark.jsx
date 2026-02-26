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
            updatedAssignmentMark: mark?.assignment_mark,
            updatedClassTestMark: mark?.class_test_mark,
            updatedMidtermMark: mark?.midterm_mark,
            updatedFinalExamMark: mark?.final_exam_mark,
            updatedResultChallengePaymentStatus: mark?.result_challenge_payment_status,
            updatedResultStatus: mark?.result_status,
        }
    });

    // Add a state to track if THIS specific modal is open
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    // Watching selected values to show labels
    // const selectedTeacherId = watch("updatedTeacherId");
    // const selectedSubjectId = watch("updatedSubjectId");
    // const selectedDepartmentId = watch("updatedDepartmentId");

    // SYNC FORM WHEN PROP CHANGES (The "First row" fix)
    // useEffect(() => {
    //     if (assignedCourse) {
    //         setValue("updatedDepartmentId", assignedCourse.department?.id);
    //         setValue("updatedTeacherId", assignedCourse.taught_by?.id || null);
    //         setValue("updatedSubjectId", assignedCourse.subject?.id);
    //         setTeacherSearch(assignedCourse.taught_by?.name || "");
    //         setSubjectSearch(`${assignedCourse.subject?.subject_code}: ${assignedCourse.subject?.subject_title}` || "");
    //     }
    // }, [assignedCourse, setValue]);


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
                        <h3 className="font-bold text-2xl mb-6 border-b pb-2">Update Mark</h3>

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
                            </div>

                            {/* close modal and submit */}
                            <div className="modal-action flex items-center justify-end">
                                <button type="button" className="btn btn-ghost" onClick={() => {
                                    setIsOpen(false);
                                    // @ts-ignore
                                    document.getElementById(modalId).close();
                                }}>Cancel</button>
                                <button className="btn btn-primary min-w-[120px]" disabled={isLoading}>
                                    {isLoading ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Update"}
                                </button>

                            </div>
                        </form>
                    </div>
                </dialog>
            </div>
        </div>
    );
};

export default UpdateAStudentsSingleMark;