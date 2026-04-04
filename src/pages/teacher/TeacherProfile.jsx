import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth.jsx';
import useTheme from '../../hooks/useTheme.jsx';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { SingleUserDetailsSkeleton } from '../../components/ui/Skeletons.jsx';
import errorMessageParser from '../../utils/errorMessageParser/errorMessageParser.js';
// @ts-ignore
import defaultImage from "../../assets/blank-profile-picture.png"
import { toast } from 'react-hot-toast';
import { IoIosNotifications } from 'react-icons/io';
import { RiCheckDoubleLine } from 'react-icons/ri';
import SectionHeader from '../../utils/SectionHeader/SectionHeader.jsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { ImZoomIn } from 'react-icons/im';

const TeacherProfile = () => {
    const [theme] = useTheme();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { data: userProfileData, isPending, isError, error } = useQuery({
        queryKey: ['userProfileData'],
        queryFn: async () => {
            const res = await axiosSecure(`/teachers/${user?.id}`);
            return res.data;
        },
        enabled: !!user
    })

    const { data: notification, isPending: isNotificationPending, isError: isNotificationError, error: notificationError, refetch: notificationRefetch } = useQuery({
        queryKey: ['notification'],
        queryFn: async () => {
            const res = await axiosSecure(`/notifications/${user?.id}`);
            return res.data;
        },
        enabled: !!user
    })


    // skeleton
    if (isPending) {
        return <SingleUserDetailsSkeleton />;
    }

    // Error Message
    if (isError) {
        const message = errorMessageParser(error);
        return <h2 className="text-error text-2xl text-center">{message || 'User Details not found'}</h2>;
    }

    console.log(userProfileData);

    // user image
    const userImage = userProfileData?.user_data?.photo_url || defaultImage;

    const updatePassword = async (data) => {
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

    const show_indicator = notification?.some(n => n?.is_read === false);

    // mark notification as read
    const mark_notification_as_read = async (id) => {
        const update_data = {
            is_read: true
        }
        try {
            setIsFormLoading(true);
            const res = await axiosSecure.patch(`/notifications/${id}`, update_data);
            if (res?.status === 200) {
                toast.success("Notification marked as read");
            }
        } catch (error) {
            console.log(error);
            const message = errorMessageParser(error);
            toast.error(message || 'Failed to mark notification as read');
        } finally {
            setIsFormLoading(false);
            notificationRefetch();
        }

    }


    return (
        <div>
            {/* notification */}
            <div className=" flex justify-end my-2">
                <div className="dropdown dropdown-left">
                    <div tabIndex={0} role="button" className="btn border-0 hover:bg-transparent m-1">
                        <div className="indicator">
                            <span className={`indicator-item ${show_indicator && "status status-info animate-bounce"}`}></span>
                            <div className="cursor-pointer">
                                <IoIosNotifications className="text-xl" />
                            </div>
                        </div>
                    </div>
                    <div tabIndex={-1} className="dropdown-content bg-base-100 rounded-box z-1 p-2 min-w-64 shadow-sm">
                        {notification?.map((n, index) => (
                            <div key={n?.id} role="alert" className={`alert alert-info ${theme === "dark" && "alert-soft"} mb-2`}>
                                <span>{n?.message}</span>

                                {n?.is_read === false && (
                                    <button
                                        disabled={isFormLoading}
                                        onClick={() => mark_notification_as_read(n?.id)}
                                        data-tip="Dismiss"
                                        className={`btn btn-info ${theme === "dark" && "btn-soft"} btn-sm hover:tooltip hover:tooltip-top ${theme === "dark" ? "border-info" : "border-gray-500"}`}><RiCheckDoubleLine className="text-lg" /></button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            <div className="bg-base-100 p-4 rounded-xl">
                <div className="border-b border-base-300 flex justify-between items-center">
                    <SectionHeader section_title='Profile' />

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

                            <form onSubmit={handleSubmit(updatePassword)} className='space-y-2'>
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
                                        onClick={() => updatePassword}
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

                {/* user details */}
                < div className="flex flex-col sm:flex-row sm:gap-5 py-5">
                    {/* Picture left square */}
                    <div className="group/user-image mx-auto sm:mx-0">
                        <div className="sm:min-w-32 max-w-52 rounded-3xl relative">
                            <img className="rounded-3xl w-full" src={userImage || defaultImage} />


                            {/* Profile Picture */}
                            <div className="absolute bottom-0 left-0 flex justify-center gap-5 place-items-center bg-neutral opacity-55 w-full sm:min-w-32 max-w-52 h-12 rounded-b-3xl">
                                {/* Profile Picture Full View */}
                                <button className="btn btn-sm btn-circle btn-ghost hover:bg-primary-tint hover:text-primary hover:border border-primary shadow-none text-white"
                                    onClick={() => {
                                        // @ts-ignore
                                        document.getElementById('show_full_profile_picture_modal').showModal()
                                    }}
                                >
                                    <ImZoomIn />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Basic Details */}
                    <div className="sm:grow flex flex-col justify-center">
                        {/* Name & Status */}
                        <div className="flex items-center gap-2 mt-4 md:mt-0">
                            <h2 className="text-xl sm:text-3xl font-bold">
                                {userProfileData?.user_data?.name}
                            </h2>
                            <button className={`badge text-black rounded-full ${userProfileData?.user_data?.user?.is_active ? "bg-success" : "bg-error"}`}>{userProfileData?.user_data?.user?.is_active ? "Active" : "Disabled"}</button>
                        </div>


                        {/* username, email, mobile */}
                        <div className="mt-3 space-y-2">
                            <h4 className="text-gray-500">Username: <span className="font-semibold text-base-content">{userProfileData?.user_data?.user?.username}</span></h4>

                            <h4 className="text-gray-500">Email: <span className="font-semibold text-base-content">{userProfileData?.user_data?.user?.email}</span></h4>

                            <h4 className="text-gray-500">Mobile: <span className="font-semibold">{userProfileData?.user_data?.user?.mobile_number}</span></h4>
                        </div>
                    </div>
                </div>
            </div>


            {/* Role Specific details */}
            <div className="mt-10 bg-base-100 p-4 rounded-xl">
                <div className="border-b border-base-300 flex items-center mb-5 justify-between">
                    <SectionHeader section_title={"More Details"} />
                </div>

                <div className="md:text-lg">
                    <div className="grid sm:grid-cols-3 justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:gap-4">

                        <div>
                            <h4 className='text-gray-500'>Total Assigned Courses</h4>
                            <h4 className='font-medium'>

                                {userProfileData?.total_assigned_courses}
                            </h4>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <h4 className="text-gray-500">Date of Birth</h4>

                            <h4 className="font-medium">
                                {userProfileData?.user_data?.date_of_birth?.split("T")[0]}

                                {(userProfileData?.user_data?.date_of_birth === null) && <span className="text-error">N/A</span>}

                                <span className="text-sm italic ml-1">(YYYY-MM-DD)</span>
                            </h4>
                        </div>

                        <div className="sm:col-span-2">
                            {/* Department */}
                            <h4 className="text-gray-500">Department</h4>
                            <h4 className="font-medium">
                                {
                                    userProfileData?.user_data?.department?.department_name.toUpperCase()
                                }
                                {
                                    (userProfileData?.user_data?.department === null) && <span className="text-error">Not Assigned</span>
                                }
                            </h4>
                        </div>
                    </div>

                    <div className="mb-4">
                        {/* Present Address */}
                        <h4 className="text-gray-500">Present Address</h4>
                        <h4>
                            {userProfileData?.user_data?.present_address}
                            {userProfileData?.user_data?.present_address === "" && <span className="text-error">N/A</span>}
                        </h4>
                    </div>

                    <div>
                        {/* Permanent Address */}
                        <h4 className="text-gray-500">Permanent Address</h4>

                        <h4 className="font-medium">
                            {userProfileData?.user_data?.permanent_address}
                            {userProfileData?.user_data?.permanent_address === "" && <span className="text-error">N/A</span>}
                        </h4>
                    </div>
                </div>
            </div>

            {/* profile image show and update modal */}
            <dialog id="show_full_profile_picture_modal" className="modal">
                <div className="modal-box">
                    <div className="rounded">
                        <img src={userImage || defaultImage} />
                    </div>
                    <h3 className="font-bold text-lg text-center mt-3">{userProfileData.name}</h3>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

        </div >
    );
};

export default TeacherProfile;