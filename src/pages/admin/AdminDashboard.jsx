import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import AdminDashboardCards from '../../components/ui/AdminDashboardCards.jsx';
import SectionHeader from '../../utils/SectionHeader/SectionHeader.jsx';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import useTheme from '../../hooks/useTheme.jsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth.jsx';
import { toast } from 'react-hot-toast';
import errorMessageParser from '../../utils/errorMessageParser/errorMessageParser.js';

const AdminDashboard = () => {
    const [theme] = useTheme();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register, reset, handleSubmit, formState: { errors } } = useForm();

    const { data: dashboardCounts, isPending, isError, error } = useQuery({
        queryKey: ['dashboardCounts'],
        queryFn: async () => {
            const res = await axiosSecure('/adminDashboard/allTableDataCount');
            return res?.data;
        }
    })

    // console.log(dashboardCounts);

    const updateAdminPassword = async (data) => {
        const update_data = {
            username: user?.username
        };

        if (data.new_password !== data.confirm_password) {
            return toast.error("New password and confirm password do not match.");
        }

        if (data.current_password === data.new_password || data.current_password === data.confirm_password) {
            return toast.error("New password and current password cannot be same.");
        }

        if (data.current_password) update_data.current_password = data.current_password;
        if (data.new_password && data.confirm_password === data.new_password) update_data.new_password = data.new_password;


        try {
            setIsFormLoading(true);
            const res = await axiosSecure.patch(`/users/updatePassword/${user?.id}`, update_data);
            toast.success(res?.data?.message || 'Password updated');
            console.log(res);
            // @ts-ignore
            document.getElementById("change_password_modal").close();
        }
        catch (error) {
            console.log(error);
            // @ts-ignore
            document.getElementById("change_password_modal").close();
            const message = errorMessageParser(error);
            toast.error(message || 'Failed to update password');
        }
        finally {
            reset();
            setShowPassword(false);
            setIsFormLoading(false);
        }
    }



    return (
        <div className='min-h-screen'>
            <div className='flex justify-between items-center'>
                <SectionHeader section_title="Admin Dashboard" />
                <button className='btn btn-info btn-sm'
                    onClick={() => {
                        document.getElementById('change_password_modal').
                            // @ts-ignore
                            showModal()
                    }}
                >Change Password</button>

                {/* Modals */}
                {/* change password modal */}
                <dialog id="change_password_modal" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg text-error uppercase mb-2">Update Password</h3>

                        <form onSubmit={handleSubmit(updateAdminPassword)} className='space-y-2'>
                            <fieldset className={`fieldset ${errors.current_password && "tooltip tooltip-bottom tooltip-error"}`} data-tip={errors.current_password && errors.current_password.message}>
                                <label className='label'>Type Current Password</label>
                                <div className='relative'>
                                    <input
                                        className='input w-full'
                                        type={showPassword ? "text" : "password"}
                                        placeholder='Type current password'
                                        {...register("current_password", { required: "Current password is required" })}
                                    />
                                    <button type='button' className='btn  btn-xs btn-circle absolute right-3 top-1/2 transform -translate-y-1/2 z-20'
                                        onClick={() => setShowPassword(!showPassword)}
                                    >{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                                </div>
                            </fieldset>

                            <fieldset className={`fieldset ${errors.new_password && "tooltip tooltip-bottom tooltip-error"}`} data-tip={errors.new_password && errors.new_password.message}>
                                <label className='label'>Type Current Password</label>
                                <div className='relative'>
                                    <input
                                        className='input w-full'
                                        type={showPassword ? "text" : "password"}
                                        placeholder='Type new password'
                                        {...register("new_password", { required: "New password is required" })}
                                    />
                                    <button type='button' className='btn btn-circle btn-xs absolute right-3 top-1/2 transform -translate-y-1/2 z-20'
                                        onClick={() => setShowPassword(!showPassword)}
                                    >{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                                </div>
                            </fieldset>

                            <fieldset className={`fieldset ${errors.confirm_password && "tooltip tooltip-bottom tooltip-error"}`} data-tip={errors.confirm_password && errors.confirm_password.message}>
                                <label className='label'>Confirm New Password</label>
                                <div className='relative'>
                                    <input
                                        className='input w-full'
                                        type={showPassword ? "text" : "password"}
                                        placeholder='Confirm new password'
                                        {...register("confirm_password", { required: "Confirm password is required" })}
                                    />
                                    <button type='button' className='btn btn-circle btn-xs absolute right-3 top-1/2 transform -translate-y-1/2 z-20'
                                        onClick={() => setShowPassword(!showPassword)}
                                    >{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                                </div>
                            </fieldset>


                            <div className="modal-action">
                                <button
                                    onClick={() => updateAdminPassword}
                                    className={`btn ${isFormLoading ? "btn-disabled" : "btn-success"} ${theme === "dark" ? "text-black" : "text-white"}`}
                                >
                                    {isFormLoading ? <AiOutlineLoading3Quarters className='animate-spin' /> : "Update"}
                                </button>

                                <button className="btn"
                                    type='button'
                                    onClick={() => {
                                        reset();
                                        setShowPassword(false);
                                        // @ts-ignore
                                        document.getElementById("change_password_modal").close();
                                    }}
                                >Close</button>
                            </div>
                        </form>
                    </div>
                </dialog>
            </div>



            <div className='grid grid-cols-2 md:grid-cols-5 gap-2'>
                {
                    !isPending &&
                    Object.entries(dashboardCounts).map(([key, value]) =>
                        <AdminDashboardCards key={key} title={key} count={value} />
                    )
                }
            </div>

            {/* Future features */}
            {/* 
                Audit Log Summary: Today's Total Audit logs
                in which method/category most error(Critical Errors) happened
                User Status: * Active vs Inactive student/teacher (Pie Chart)।
                Recent Activities: last 5 audit logs in a table/list
                Course Distribution: department wise subject count (Bar Chart)।
            */}
        </div>
    );
};

export default AdminDashboard;