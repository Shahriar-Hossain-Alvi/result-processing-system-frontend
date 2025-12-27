import { useQuery } from '@tanstack/react-query';
import SectionHeader from '../../utils/SectionHeader/SectionHeader.jsx';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import CreateStudentTab from '../../components/pageComponents/AddUserPage/CreateStudentTab.jsx';
import CreateTeacherTab from '../../components/pageComponents/AddUserPage/CreateTeacherTab.jsx';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';

const AddUser = () => {
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [formLoading, setFormLoading] = useState(false);
    // fetch departments
    const { data: allDepartments, isLoading: isDepartmentsLoading, isError: isDepartmentsError } = useQuery({
        queryKey: ['allDepartments'],
        queryFn: async () => {
            const res = await axiosSecure('/departments/');
            return res.data;
        }
    })


    // create admin form
    const createAdmin = async (data) => {
        setFormLoading(true);
        const create_admin_payload = {
            username: data.email,
            email: data.email,
            password: data.password,
            role: 'admin',
            is_active: data.account_status !== "disable",
        }

        // send data to backend
        try {
            const res = await axiosSecure.post('/users/register', create_admin_payload);
            console.log(res);
            toast.success(res?.data?.message || "New Admin created successfully");
            reset();
        } catch (error) {
            console.log(error);
            const detail = error?.response?.data?.detail;
            const message = Array.isArray(detail) ? detail[0]?.msg : detail;
            toast.error(message || "Failed to create admin. Please try again.");
        } finally {
            setFormLoading(false);
        }
    }


    return (
        <div>
            <div className='place-self-center'>
                <SectionHeader section_title='User Registration' />
            </div>

            {/* name of each tab group should be unique */}
            <div className="tabs tabs-box place-self-center">
                {/* Student Tab */}
                <input type="radio" name="registration_tab" className="tab checked:font-bold checked:text-primary" aria-label="Student" defaultChecked />
                <div className="tab-content bg-base-100 border-base-300 md:p-6">
                    <CreateStudentTab allDepartments={allDepartments} isDepartmentsLoading={isDepartmentsLoading} isDepartmentsError={isDepartmentsError} />
                </div>

                {/* Teacher Tab */}
                <input type="radio" name="registration_tab" className="tab checked:text-primary checked:font-bold" aria-label="Teacher" />
                <div className="tab-content bg-base-100 border-base-300 md:p-6">
                    <CreateTeacherTab allDepartments={allDepartments} isDepartmentsLoading={isDepartmentsLoading} isDepartmentsError={isDepartmentsError} />
                </div>

                {/* Admin Tab */}
                <input type="radio" name="registration_tab" className="tab checked:font-bold checked:text-primary" aria-label="Admin" />
                <div className="tab-content bg-base-100 border-base-300 md:p-6">

                    <div className='place-self-center'>
                        <SectionHeader section_title='Admin Registration' />
                    </div>

                    {/* Admin Form */}
                    <form
                        onSubmit={handleSubmit(createAdmin)}
                        className='max-w-xs place-self-center'>
                        <fieldset className="fieldset text-left bg-base-200 border-base-300 rounded-box  border p-1 sm:p-4">

                            {/* Email (Username) */}
                            <div className={`w-full ${errors.email && "tooltip tooltip-open tooltip-top tooltip-error"}`} data-tip={errors.email && errors.email.message}>
                                <label className="label">Email<span className="text-red-600">*</span></label>
                                <input
                                    type="email" placeholder="Email"
                                    className="input"
                                    {...register("email", { required: "Email is required" })}
                                />
                            </div>

                            {/* Role */}
                            <div className="w-full">
                                <label className="label">Role<span className="text-red-600">*</span></label>
                                <input type="text" className="input" disabled placeholder="admin" />
                            </div>

                            {/* Default Password */}
                            <div className={`w-full ${errors.password && "tooltip tooltip-open tooltip-top tooltip-error"}`} data-tip={errors.password && errors.password.message}>
                                <label className="label">Password<span className="text-red-600">*</span></label>
                                <input type="text" className="input" placeholder="Password"
                                    {...register("password", { required: "Password is required" })}
                                />
                            </div>


                            {/* Account Status (Active by default) */}
                            <label className="label">Active Account<span className="text-red-600">*</span></label>
                            <select className="select" {...register("account_status")} defaultValue="active">
                                <option value="active">Active</option>
                                <option value="disable">Disable</option>
                            </select>

                            {/* Submit Button */}
                            <button className={`btn ${formLoading ? "btn-disabled" : "btn-success"} mt-4`}>
                                {
                                    formLoading ?
                                        <span className="loading loading-spinner"></span>
                                        :
                                        "Submit"
                                }
                            </button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUser;