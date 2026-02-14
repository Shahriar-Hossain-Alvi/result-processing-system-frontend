import { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure.jsx';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa6';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import errorMessageParser from '../../../utils/errorMessageParser/errorMessageParser.js';
import useTheme from '../../../hooks/useTheme.jsx';

const CreateSemester = ({ totalSemestersRefetch }) => {
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [isLoading, setIsLoading] = useState(false);

    // ADD NEW SEMESTER Function
    const addNewSemester = async (data) => {
        const semester_name = data.semesterName;
        const semester_number = parseInt(data.semesterNumber);

        try {
            setIsLoading(true);
            const res = await axiosSecure.post('/semesters/', {
                semester_name, semester_number
            });
            totalSemestersRefetch();

            // @ts-ignore
            document.getElementById('create_semester_modal').close();
            // @ts-ignore
            toast.success(res?.data?.message);
        } catch (error) {
            // @ts-ignore
            document.getElementById('create_semester_modal').close();
            const message = errorMessageParser(error);
            toast.error(message || 'Failed to add new semester');
        } finally {
            setIsLoading(false);
            reset();
        }
    }


    return (
        <div>
            {/* create department modal */}
            <button className='btn btn-ghost btn-sm group/add-dept hover:bg-transparent border-0 tooltip tooltip-left' data-tip="Add New Department" onClick={() => {
                reset(); document.getElementById('create_semester_modal').
                    // @ts-ignore
                    showModal()
            }}>
                <FaPlus className='text-lg group-hover/add-dept:text-success' />
            </button>

            <dialog id="create_semester_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Add New Department</h3>

                    <div className="modal-action flex-col">
                        {/* FORM to add new department */}
                        <form className='space-y-4' onSubmit={handleSubmit(addNewSemester)}>
                            <div className={`${errors.semesterName && "tooltip tooltip-open tooltip-bottom tooltip-error"} w-full`} data-tip={errors.semesterName && errors.semesterName.message}>
                                <label>Semester Name</label>
                                <input
                                    type="text"
                                    placeholder="Semester Name"
                                    className="input input-bordered w-full mt-2"
                                    {...register("semesterName", { required: "Semester name is required" })}
                                />
                            </div>
                            <div className={`${errors.semesterNumber && "tooltip tooltip-open tooltip-bottom tooltip-error"} w-full`} data-tip={errors.semesterNumber && errors.semesterNumber.message}>
                                <label>Semester Number</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={16}
                                    placeholder="Semester Number"
                                    className="input input-bordered w-full mt-2"
                                    {...register("semesterNumber", { required: "Semester number is required" })}
                                />
                            </div>
                            <button className={`${isLoading && "btn-disabled"} btn w-full btn-success`}>
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

export default CreateSemester;