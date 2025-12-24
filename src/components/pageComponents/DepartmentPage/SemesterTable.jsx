import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure.jsx';
import { set, useForm } from 'react-hook-form';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import toast from 'react-hot-toast';

const SemesterTable = ({ totalSemesters, totalSemestersRefetch }) => {
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [selectedSemester, setSelectedSemester] = useState(null); // state for editing
    const [isFormLoading, setIsFormLoading] = useState(false);

    // open update semester modal
    const openUpdateSemesterModal = (sem) => {
        setSelectedSemester(sem);
        reset({ updatedSemesterName: sem.semester_name, updatedSemesterNumber: sem.semester_number }); // This fills the form
        // @ts-ignore
        document.getElementById('update_semester_modal').showModal();
    }


    // update semester 
    const updateSemester = async (data) => {
        const updated_data = {}

        const updated_semester_id = selectedSemester.id

        if (data.updatedSemesterName && data.updatedSemesterName !== selectedSemester.semester_name) updated_data.semester_name = data.updatedSemesterName;

        if (data.updatedSemesterNumber && data.updatedSemesterNumber !== selectedSemester.semester_number) updated_data.semester_number = parseInt(data.updatedSemesterNumber);

        if (Object.keys(updated_data).length === 0) return toast.error('No data to update');

        console.log(`Updating Id: ${selectedSemester.id} and updated data: `, updated_data);

        try {
            setIsFormLoading(true);
            const res = await axiosSecure.patch(`/semesters/${updated_semester_id}`, updated_data);
            console.log(res);
            // @ts-ignore
            document.getElementById('update_semester_modal').close();
            totalSemestersRefetch();
            // @ts-ignore
            toast.success(res?.data?.message);
        } catch (error) {
            console.error(error);
            // @ts-ignore
            document.getElementById('update_semester_modal').close();
            toast.error(error?.response?.data?.detail || 'Failed to update semester');
        } finally {
            setIsFormLoading(false);
            reset();
        }
    }

    // delete semester
    const deleteSemester = async (id) => {
        try {
            setIsFormLoading(true);
            const res = await axiosSecure.delete(`/semesters/${id}`);
            console.log(res);
            // @ts-ignore
            document.getElementById('delete_semester_modal').close();
            totalSemestersRefetch();
            // @ts-ignore
            toast.success(res?.data?.message);
        } catch (error) {
            console.log(error);
            // @ts-ignore
            document.getElementById('delete_semester_modal').close();
            toast.error(error?.response?.data?.detail || 'Failed to delete semester');
        } finally {
            setIsFormLoading(false);
        }
    }


    return (
        <div>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Semester Name</th>
                            <th>Semester Number</th>
                            <th>Semester ID</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* rows */}
                        {
                            totalSemesters?.map((semester, index) =>
                                <tr key={semester?.id}>
                                    <th>{index + 1}</th>
                                    <td className='capitalize'>{semester?.semester_name}</td>
                                    <td>{semester?.semester_number}</td>
                                    <td>{semester?.id}</td>
                                    <td className='flex gap-2'>

                                        {/* update semester Modal trigger */}
                                        <button
                                            onClick={() => openUpdateSemesterModal(semester)}
                                            className="btn btn-ghost hover:bg-transparent border-0 group/edit-semester">
                                            <FaEdit className='group-hover/edit-semester:text-success'
                                            />
                                        </button>


                                        {/* Delete semester confirmation Modal */}
                                        <div>
                                            <button className="btn btn-ghost hover:bg-transparent border-0 group/delete-semester"
                                                onClick={() => {
                                                    setSelectedSemester(semester);
                                                    document.getElementById('delete_semester_modal').
                                                        // @ts-ignore
                                                        showModal()
                                                }}
                                            >
                                                <MdDelete className='group-hover/delete-semester:text-red-700 text-lg' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }

                    </tbody>
                </table>
            </div>

            {/* update semester modal */}
            <dialog id="update_semester_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-warning">Edit Semester</h3>
                    <form className='space-y-3 mt-4' onSubmit={handleSubmit(updateSemester)}>
                        <div className={`${errors.updatedSemesterName && "tooltip tooltip-open tooltip-bottom tooltip-error"} w-full`} data-tip={errors.updatedSemesterName && errors.updatedSemesterName.message}>
                            <label>Write the Updated Semester Name</label>
                            <input
                                type="text"
                                className="input input-bordered w-full mt-2"
                                {...register("updatedSemesterName")}
                            />
                        </div>
                        <div className={`${errors.updatedSemesterNumber && "tooltip tooltip-open tooltip-bottom tooltip-error"} w-full`} data-tip={errors.updatedSemesterNumber && errors.updatedSemesterNumber.message}>
                            <label>Write the Updated Semester Number</label>
                            <input
                                type="text"
                                className="input input-bordered w-full mt-2"
                                {...register("updatedSemesterNumber")}
                            />
                        </div>
                        <button className={`btn ${isFormLoading && "btn-disabled"} btn-success w-full`} type='submit' disabled={isFormLoading}>
                            {isFormLoading ? <AiOutlineLoading3Quarters className='animate-spin' /> : "Update"}
                        </button>
                    </form>
                    <div className="modal-action">
                        <form method="dialog"><button className="btn btn-error">Cancel</button></form>
                    </div>
                </div>
            </dialog>


            {/* delete semester modal */}
            <dialog id="delete_semester_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-error uppercase">Confirm!!!</h3>
                    <p className="py-4">Are you sure you want to delete "{selectedSemester?.semester_name.toUpperCase()}" Semester?</p>
                    <p className='text-warning'>The semester is connected with other data such as Marks, Subjects, Students etc. Deleting it will create errors and failures in the system!!! Try Editing instead</p>
                    <div className="modal-action">
                        <button onClick={() => deleteSemester(selectedSemester?.id)} className={`btn ${isFormLoading && "btn-disabled"} btn-error`}>
                            {isFormLoading ? <AiOutlineLoading3Quarters className='animate-spin' /> : " Yes, delete it"}
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

export default SemesterTable;