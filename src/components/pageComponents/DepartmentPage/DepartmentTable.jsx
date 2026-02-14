import React, { useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import useAxiosSecure from '../../../hooks/useAxiosSecure.jsx';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import errorMessageParser from '../../../utils/errorMessageParser/errorMessageParser.js';
import useAuth from '../../../hooks/useAuth.jsx';
import useTheme from '../../../hooks/useTheme.jsx';

const DepartmentTable = ({ allDepartments, allDepartmentsRefetch }) => {
    const [theme] = useTheme();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [selectedDept, setSelectedDept] = useState(null); // state for editing
    const [isFormLoading, setIsFormLoading] = useState(false);

    // open update department modal
    const openUpdateDepartmentModal = (dept) => {
        setSelectedDept(dept);
        reset({ updatedDepartmentName: dept.department_name }); // This fills the form
        // @ts-ignore
        document.getElementById('update_dept_modal').showModal();
    }

    // update department name
    const updateDepartment = async (data) => {
        const updated_name = data.updatedDepartmentName;
        const updated_dept_id = selectedDept.id;

        console.log("ID: ", updated_dept_id, "Changed Name: ", updated_name);
        try {
            setIsFormLoading(true);
            const res = await axiosSecure.patch(`/departments/${updated_dept_id}`, { department_name: updated_name });
            console.log(res);
            // @ts-ignore
            document.getElementById('update_dept_modal').close();
            allDepartmentsRefetch();
            // @ts-ignore
            toast.success(res?.data?.message);
        } catch (error) {
            console.log(error);
            // @ts-ignore
            document.getElementById('update_dept_modal').close();
            const message = errorMessageParser(error);
            toast.error(message || 'Failed to update department');
        } finally {
            setIsFormLoading(false);
            reset();
        }
    }


    // const Delete Department
    const deleteDepartment = async (id) => {
        try {
            setIsFormLoading(true);
            const res = await axiosSecure.delete(`/departments/${id}`);
            console.log(res);
            // @ts-ignore
            document.getElementById('delete_dept_modal').close();
            allDepartmentsRefetch();
            // @ts-ignore
            toast.success(res?.data?.message);
        } catch (error) {
            console.log(error);
            // @ts-ignore
            document.getElementById('delete_dept_modal').close();
            const message = errorMessageParser(error);
            toast.error(message || 'Failed to delete department');
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
                            <th>Department Name</th>
                            <th>Department ID</th>
                            <th className='text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* rows */}
                        {
                            allDepartments?.map((department, index) =>
                                <tr key={department?.id}>
                                    <th>{index + 1}</th>
                                    <td>{department?.department_name.toUpperCase()}</td>
                                    <td className='text-center'>{department?.id}</td>
                                    <td className='flex gap-2'>
                                        {/* update department Modal trigger */}
                                        <button
                                            onClick={() => openUpdateDepartmentModal(department)}
                                            className="btn btn-ghost hover:btn-primary hover:text-white text-primary border-0">
                                            <FaEdit />
                                        </button>


                                        {/* Delete Department confirmation Modal */}
                                        {
                                            user?.role === "super_admin" &&
                                            <div>
                                                <button className="btn btn-ghost hover:btn-error hover:text-white text-error border-0 "
                                                    onClick={() => {
                                                        setSelectedDept(department);
                                                        document.getElementById('delete_dept_modal').
                                                            // @ts-ignore
                                                            showModal()
                                                    }}
                                                >
                                                    <MdDelete className='text-lg' />
                                                </button>
                                            </div>}
                                    </td>
                                </tr>
                            )
                        }

                    </tbody>
                </table>
            </div>


            {/* Update department modal */}
            <dialog id="update_dept_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-warning">Edit Department</h3>
                    <form className='space-y-3 mt-4' onSubmit={handleSubmit(updateDepartment)}>
                        <div className={`${errors.updatedDepartmentName && "tooltip tooltip-open tooltip-bottom tooltip-error"} w-full`} data-tip={errors.updatedDepartmentName && errors.updatedDepartmentName.message}>
                            <label>Write the Updated Department Name</label>
                            <input
                                type="text"
                                className="input input-bordered w-full mt-2"
                                {...register("updatedDepartmentName", { required: "Department name is required" })}
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

            {/* delete department modal */}
            <dialog id="delete_dept_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-error uppercase">Be Careful!!!</h3>
                    <p className="py-4">Are you sure you want to delete "{selectedDept?.department_name.toUpperCase()}" department?</p>
                    <p className='text-warning'>The department is connected with other data such as Subject, Teachers, Students etc. Deleting it may create errors and failures in the system!!! Try Editing instead</p>
                    <div className="modal-action">
                        <button onClick={() => deleteDepartment(selectedDept?.id)} className={`btn ${isFormLoading ? "btn-disabled" : "btn-error"}`} >
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

export default DepartmentTable;