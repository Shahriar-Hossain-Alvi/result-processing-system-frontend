import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure.jsx';
import { useForm } from 'react-hook-form';
import errorMessageParser from '../../../utils/errorMessageParser/errorMessageParser.js';
import { FaPlus } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useQuery } from '@tanstack/react-query';

const CreateSubject = ({ allSubjectsRefetch }) => {
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [isLoading, setIsLoading] = useState(false);

    // SEMESTERS query
    const { data: allSemesters, isPending: isSemesterPending, error: semesterError, isError: isSemesterError, refetch: totalSemestersRefetch } = useQuery({
        queryKey: ['totalSemesters'],
        queryFn: async () => {
            const res = await axiosSecure('/semesters/');
            return res.data;
        }
    })

    // semester error toast
    useEffect(() => {
        if (isSemesterError) {
            console.log(semesterError);
            const message = errorMessageParser(semesterError);
            toast.error(message || "Failed to fetch semesters");
        }
    }, [isSemesterError]);

    // ADD NEW SUBJECT Function
    const addNewSubject = async (data) => {

        const subject_data = {
            subject_title: data.subjectTitle,
            subject_code: data.subjectCode,
            credits: parseFloat(data.subjectCredit),
            semester_id: parseInt(data.semesterId),
            is_general: data.isGeneral === "no" ? false : true
        }

        try {
            setIsLoading(true);
            const res = await axiosSecure.post('/subjects/', subject_data);
            console.log(res);
            allSubjectsRefetch();
            // @ts-ignore
            document.getElementById('create_subject_modal').close();
            // @ts-ignore
            toast.success(res?.data?.message || 'New subject added successfully');
        } catch (error) {
            console.log(error);
            // @ts-ignore
            document.getElementById('create_subject_modal').close();
            const message = errorMessageParser(error);
            toast.error(message || 'Failed to add subject');
        } finally {
            setIsLoading(false);
            reset();
        }
    }


    return (
        <div>
            {/* create department modal */}
            <button className='btn btn-ghost btn-sm group/add-dept hover:bg-transparent border-0 tooltip tooltip-left' data-tip="Add New Subject" onClick={() => {
                reset(); document.getElementById('create_subject_modal').
                    // @ts-ignore
                    showModal()
            }}>
                <FaPlus className='text-lg group-hover/add-dept:text-success' />
            </button>

            <dialog id="create_subject_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Add New Subject</h3>

                    <div className="modal-action flex-col">
                        {/* FORM to add new subject */}
                        <form className='space-y-4' onSubmit={handleSubmit(addNewSubject)}>
                            {/* Subject Title */}
                            <div className={`${errors.subjectTitle && "tooltip tooltip-open tooltip-bottom tooltip-error"} w-full`} data-tip={errors.subjectTitle && errors.subjectTitle.message}>
                                <label>Subject Title<span className='text-red-600'>*</span></label>
                                <input
                                    type="text"
                                    placeholder="Subject Title"
                                    className="input input-bordered w-full mt-2"
                                    {...register("subjectTitle", { required: "Subject title is required" })}
                                />
                            </div>

                            {/* Subject Code */}
                            <div className={`${errors.subjectCode && "tooltip tooltip-open tooltip-bottom tooltip-error"} w-full`} data-tip={errors.subjectCode && errors.subjectCode.message}>
                                <label>Subject Code<span className='text-red-600'>*</span></label>
                                <p className='text-xs text-warning'>Format: Letter(3 to 5)-Number(3 to 6) EG: CSE-123, SWE-123456</p>
                                <input
                                    type="text"
                                    placeholder="Subject Code"
                                    className="input input-bordered w-full mt-2"
                                    {...register("subjectCode", { required: "Subject code is required" })}
                                />
                            </div>

                            {/* subject credits */}
                            <div className={`${errors.subjectCredit && "tooltip tooltip-open tooltip-bottom tooltip-error"} w-full`} data-tip={errors.subjectCredit && errors.subjectCredit.message}>
                                <label>Subject Credit<span className='text-red-600'>*</span></label>
                                <p className='text-xs text-warning'>Format: 3.0, 1.5 (Floating value)</p>
                                <input
                                    type="text"
                                    placeholder="Subject Credit"
                                    className="input input-bordered w-full mt-2"
                                    {...register("subjectCredit", { required: "Subject credit is required" })}
                                />
                            </div>

                            {/* Subject Semester */}
                            {
                                <div className={`${errors.semesterId && "tooltip tooltip-open tooltip-bottom tooltip-error"} w-full`} data-tip={errors.semesterId && errors.semesterId.message}>
                                    <label className="label block">Select Semester</label>
                                    {
                                        isSemesterPending ?
                                            <div className="skeleton h-10"></div>
                                            :
                                            <select
                                                {...register("semesterId", { required: "Semester is required" })}
                                                defaultValue=""
                                                className="select select-bordered w-full">
                                                <option value="" disabled>Choose a Semester</option>
                                                {
                                                    allSemesters?.map(semester => <option
                                                        key={semester.id} value={semester.id}

                                                    >{semester.semester_number}</option>)
                                                }
                                            </select>}
                                </div>
                            }

                            {/* Is General Subject */}

                            <div className={`${errors.isGeneral && "tooltip tooltip-open tooltip-bottom tooltip-error"} w-full`} data-tip={errors.isGeneral && errors.isGeneral.message}>
                                <label className="label block">Is this a General Subject?</label>
                                <select
                                    {...register("isGeneral")}
                                    defaultValue="no"
                                    className="select select-bordered w-full">
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>

                                </select>
                            </div>


                            <button className={`btn w-full ${isLoading ? "btn-disabled" : "btn-success"}`}>
                                {isLoading ? <AiOutlineLoading3Quarters className='animate-spin' /> : "Create"}
                            </button>
                        </form>

                        <form method="dialog" className='flex justify-between items-center'>
                            <p className='text-base'>Press ESC key or click outside to close</p>

                            <button className="btn btn-error mt-3">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default CreateSubject;