import { FaPlus } from 'react-icons/fa6';
import useAxiosSecure from '../../../hooks/useAxiosSecure.jsx';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useState } from 'react';
import errorMessageParser from '../../../utils/errorMessageParser/errorMessageParser.js';

const CreateDepartment = ({ allDepartmentsRefetch }) => {
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [isLoading, setIsLoading] = useState(false);

    // ADD NEW DEPARTMENT Function
    const addNewDepartment = async (data) => {
        console.log(data);
        try {
            setIsLoading(true);
            const res = await axiosSecure.post('/departments/', { department_name: data.departmentName });
            console.log(res);
            allDepartmentsRefetch();
            // @ts-ignore
            document.getElementById('create_dept_modal').close();
            // @ts-ignore
            toast.success(res?.data?.message);
        } catch (error) {
            console.log(error);
            // @ts-ignore
            document.getElementById('create_dept_modal').close();
            const message = errorMessageParser(error);
            toast.error(message || 'Failed to add new department');
        } finally {
            setIsLoading(false);
            reset();
        }
    }

    return (
        <div>
            {/* create department modal */}
            <button className='btn btn-ghost btn-sm group/add-dept hover:bg-transparent border-0 tooltip tooltip-left' data-tip="Add New Department" onClick={() => {
                reset(); document.getElementById('create_dept_modal').
                    // @ts-ignore
                    showModal()
            }}>
                <FaPlus className='text-lg group-hover/add-dept:text-success' />
            </button>

            <dialog id="create_dept_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Add New Department</h3>

                    <div className="modal-action flex-col">
                        {/* FORM to add new department */}
                        <form className='space-y-4' onSubmit={handleSubmit(addNewDepartment)}>
                            <div className={`${errors.departmentName && "tooltip tooltip-open tooltip-bottom tooltip-error"} w-full`} data-tip={errors.departmentName && errors.departmentName.message}>
                                <label>Department Name</label>
                                <input
                                    type="text"
                                    placeholder="Department Name"
                                    className="input input-bordered w-full mt-2"
                                    {...register("departmentName", { required: "Department name is required" })}
                                />
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

export default CreateDepartment;