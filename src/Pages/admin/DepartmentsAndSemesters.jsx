import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import { DepartmentsSkeleton, SemestersSkeleton } from '../../components/ui/Skeletons.jsx';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import toast from 'react-hot-toast';
import { useState } from 'react';
import CreateDepartment from '../../components/pageComponents/DepartmentPage/CreateDepartment.jsx';
import CreateSemester from '../../components/pageComponents/DepartmentPage/CreateSemester.jsx';

const DepartmentsAndSemesters = () => {
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, formState: { errors, isLoading: formLoading }, reset } = useForm();
    const [selectedDept, setSelectedDept] = useState(null); // state for editing

    const openUpdateModal = (dept) => {
        setSelectedDept(dept);
        reset({ updatedDepartmentName: dept.department_name }); // This fills the form
        // @ts-ignore
        document.getElementById('update_dept_modal').showModal();
    }


    // DEPARTMENTS query
    const { data: allDepartments, isLoading, error, isError, refetch: allDepartmentsRefetch } = useQuery({
        queryKey: ['allDepartments'],
        queryFn: async () => {
            const res = await axiosSecure('/departments');
            return res.data;
        }
    })

    // SEMESTERS query
    const { data: totalSemesters, isLoading: isSemesterLoading, error: semesterError, isError: isSemesterError, refetch: totalSemestersRefetch } = useQuery({
        queryKey: ['totalSemesters'],
        queryFn: async () => {
            const res = await axiosSecure('/semesters');
            return res.data;
        }
    })


    // const Delete Department
    const deleteDepartment = async (id) => {
        try {
            // @ts-ignore
            document.getElementById('delete_dept_modal').close();
            const res = await axiosSecure.delete(`/departments/${id}`);
            console.log(res);
            allDepartmentsRefetch();
            // @ts-ignore
            toast.success(res?.data?.message);
        } catch (error) {
            console.log(error);
            // @ts-ignore
            document.getElementById('delete_dept_modal').close();
            toast.error(error?.response?.data?.detail || 'Failed to delete department');
        }
    }


    // update department name
    const updateDepartment = async (data) => {
        const updated_name = data.updatedDepartmentName;
        const updated_dept_id = selectedDept.id;

        console.log("ID: ", updated_dept_id, "Changed Name: ", updated_name);
        try {
            // @ts-ignore
            document.getElementById('update_dept_modal').close();
            const res = await axiosSecure.patch(`/departments/${updated_dept_id}`, { department_name: updated_name });
            console.log(res);
            allDepartmentsRefetch();
            // @ts-ignore
            toast.success(res?.data?.message);
        } catch (error) {
            console.log(error);
            // @ts-ignore
            document.getElementById('update_dept_modal').close();
            toast.error(error?.response?.data?.detail || 'Failed to delete department');
        } finally {
            reset();
        }
    }


    return (
        <div>
            {/* DEPARTMENTS */}
            <div>
                <div className='flex justify-between'>
                    <h1 className='text-3xl font-bold'>Departments</h1>

                    <CreateDepartment allDepartmentsRefetch={allDepartmentsRefetch} />
                </div>

                {isLoading && <DepartmentsSkeleton />}
                {isError && <h4 className='text-error text-center text-lg'>An Error Occurred: {error?.message}</h4>}


                {/* departments table */}
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
                                                <td className='flex gap-2'>
                                                    {/* update department Modal trigger */}
                                                    <button
                                                        onClick={() => openUpdateModal(department)}
                                                        className="btn btn-ghost hover:bg-transparent border-0 group/edit-dept">
                                                        <FaEdit className='group-hover/edit-dept:text-success'
                                                        />
                                                    </button>


                                                    {/* Delete Department confirmation Modal */}
                                                    <div>
                                                        <button className="btn btn-ghost hover:bg-transparent border-0 group/delete-dept"
                                                            onClick={() => {
                                                                setSelectedDept(department);
                                                                document.getElementById('delete_dept_modal').
                                                                    // @ts-ignore
                                                                    showModal()
                                                            }}
                                                        >
                                                            <MdDelete className='group-hover/delete-dept:text-red-700 text-lg' />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }

                                </tbody>
                            </table>
                        </div>
                }
            </div>

            {/* Update department modal */}
            <dialog id="update_dept_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-warning">Edit Department</h3>
                    <form className='space-y-3 mt-4' onSubmit={handleSubmit(updateDepartment)}>
                        <div className={`${errors.updatedDepartmentName && "tooltip tooltip-open tooltip-bottom tooltip-error"} w-full`} data-tip={errors.updatedDepartmentName && errors.updatedDepartmentName.message}>
                            <label>New Department Name</label>
                            <input
                                type="text"
                                className="input input-bordered w-full mt-2"
                                {...register("updatedDepartmentName", { required: "Department name is required" })}
                            />
                        </div>
                        <button className="btn btn-success w-full" type='submit' disabled={isLoading}>
                            {isLoading ? <AiOutlineLoading3Quarters className='animate-spin' /> : "Update"}
                        </button>
                    </form>
                    <div className="modal-action">
                        <form method="dialog"><button className="btn btn-error">Cancel</button></form>
                    </div>
                </div>
            </dialog>

            <dialog id="delete_dept_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-error uppercase">Confirm!!!</h3>
                    <p className="py-4">Are you sure you want to delete "{selectedDept?.department_name.toUpperCase()}" department?</p>

                    <div className="modal-action">
                        <button onClick={() => deleteDepartment(selectedDept?.id)} className="btn btn-error">
                            Yes, delete it
                        </button>
                        <form method="dialog"
                        >
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>


            {/* SEMESTERS */}
            <div className='mt-10'>

                <div className='flex justify-between'>
                    <h1 className='text-3xl font-bold'>Semesters</h1>

                    <CreateSemester totalSemestersRefetch={totalSemestersRefetch} />
                </div>

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
                                                <td className='capitalize'>{semester?.semester_name}</td>
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
        </div >
    );
};

export default DepartmentsAndSemesters;