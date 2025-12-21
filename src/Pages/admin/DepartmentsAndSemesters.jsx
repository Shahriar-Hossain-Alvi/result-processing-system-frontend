import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import { DepartmentsSkeleton, SemestersSkeleton } from '../../components/ui/Skeletons.jsx';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa6';
import { useForm } from 'react-hook-form';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import toast from 'react-hot-toast';

const DepartmentsAndSemesters = () => {
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, formState: { errors, isLoading: formLoading } } = useForm();

    // DEPARTMENTS query
    const { data: allDepartments, isLoading, error, isError, refetch: allDepartmentsRefetch } = useQuery({
        queryKey: ['allDepartments'],
        queryFn: async () => {
            const res = await axiosSecure('/departments');
            return res.data;
        }
    })

    // SEMESTERS query
    const { data: totalSemesters, isLoading: isSemesterLoading, error: semesterError, isError: isSemesterError } = useQuery({
        queryKey: ['totalSemesters'],
        queryFn: async () => {
            const res = await axiosSecure('/semesters');
            return res.data;
        }
    })

    const addNewDepartment = async (data) => {
        try {
            const res = await axiosSecure.post('/departments', { department_name: data.departmentName });
            console.log(res);
            allDepartmentsRefetch();
            // @ts-ignore
            document.getElementById('my_modal_1').close();
            // @ts-ignore
            toast.success(res?.data?.message);
        } catch (error) {
            console.log(error);
            toast.error('Failed to add department');
        }
    }

    return (
        <div>
            {/* DEPARTMENTS */}
            <div>
                <div className='flex justify-between'>
                    <h1 className='text-3xl font-bold'>Departments</h1>

                    {/* Open the modal using document.getElementById('ID').showModal() method */}
                    <button className='btn btn-ghost btn-sm group/add-dept hover:bg-transparent border-0 tooltip tooltip-left' data-tip="Add New Department" onClick={() => document.getElementById('my_modal_1').
                        // @ts-ignore
                        showModal()}>
                        <FaPlus className='text-lg group-hover/add-dept:text-success' />
                    </button>
                    <dialog id="my_modal_1" className="modal">
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
                                    <button className={`${formLoading && "btn-disabled"} btn w-full btn-success`}>
                                        {formLoading ? <AiOutlineLoading3Quarters className='animate-spin' /> : "Create"}
                                    </button>
                                </form>

                                <form method="dialog" className='flex justify-between items-center'>
                                    <p className='text-base'>Press ESC key or click outside to close</p>
                                    {/* if there is a button in form, it will close the modal */}
                                    <button className="btn btn-error mt-3">Close</button>
                                </form>
                            </div>
                        </div>
                    </dialog>
                </div>

                {isLoading && <DepartmentsSkeleton />}
                {isError && <h4 className='text-error text-center text-lg'>An Error Occurred: {error?.message}</h4>}
                {
                    allDepartments?.length === 0 ?
                        <h4 className='text-error text-center text-lg'>No departments found</h4>
                        :
                        <div className="overflow-x-auto">
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Department Name</th>
                                        <th>Department ID</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* rows */}
                                    {
                                        allDepartments?.map((department, index) =>
                                            <tr key={department?.id}>
                                                <th>{index + 1}</th>
                                                <td>{department?.department_name.toUpperCase()}</td>
                                                <td>{department?.id}</td>
                                                <td>
                                                    <button className="btn btn-ghost hover:bg-transparent border-0 group/edit-dept">
                                                        <FaEdit className='group-hover/edit-dept:text-success' />
                                                    </button>
                                                    <button className="btn btn-ghost hover:bg-transparent border-0  group/delete-dept">
                                                        <MdDelete className='group-hover/delete-dept:text-red-700 text-lg' />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    }

                                </tbody>
                            </table>
                        </div>
                }
            </div>


            {/* SEMESTERS */}
            <div className='mt-10'>
                <h1 className='text-3xl font-bold'>Semesters</h1>

                {isSemesterLoading && <SemestersSkeleton />}
                {isSemesterError && <h4 className='text-error text-center text-lg'>An Error Occurred: {semesterError?.message}</h4>}
                {
                    totalSemesters?.length === 0 ?
                        <h4 className='text-error text-center text-lg'>No semesters found</h4>
                        :
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
                                                <td>{semester?.semester_name}</td>
                                                <td>{semester?.semester_number}</td>
                                                <td>{semester?.id}</td>
                                                <td>
                                                    <button className="btn btn-ghost hover:bg-transparent border-0 group/edit-semester">
                                                        <FaEdit className='group-hover/edit-semester:text-success' />
                                                    </button>
                                                    <button className="btn btn-ghost hover:bg-transparent border-0  group/delete-semester">
                                                        <MdDelete className='group-hover/delete-semester:text-red-700 text-lg' />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    }

                                </tbody>
                            </table>
                        </div>
                }
            </div>
        </div>
    );
};

export default DepartmentsAndSemesters;