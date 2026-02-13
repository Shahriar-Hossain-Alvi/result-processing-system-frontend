import { useParams } from "react-router-dom";
import SectionHeader from "../../utils/SectionHeader/SectionHeader.jsx";
import { FaEdit, FaUserEdit } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure.jsx";
import { SingleUserDetailsSkeleton } from "../../components/ui/Skeletons.jsx";
import errorMessageParser from "../../utils/errorMessageParser/errorMessageParser.js";
import UpdateUserAuthDetailsByAdminModal from "../../components/pageComponents/SingleUserDetailsPage/UpdateUserAuthDetailsByAdminModal.jsx";
import UpdateUsersAllDetailsModal from "../../components/pageComponents/SingleUserDetailsPage/UpdateUsersAllDetailsModal.jsx";
// @ts-ignore
import defaultImage from "../../assets/blank-profile-picture.png";
import { ImZoomIn } from "react-icons/im";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaCalendar } from "react-icons/fa6";


const SingleUserDetails = () => {
    // Load Cloudinary Cloud Name and Upload Preset from .env file
    const cloudinary_cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const cloudinary_upload_preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const [formLoading, setFormLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    // Get the user details using the id
    const { data: singleUserDetails, isPending, isError, error, refetch: singleUserDetailsRefetch } = useQuery({
        queryKey: ['user', id],
        queryFn: async () => {
            const res = await axiosSecure(`/users/${id}`);
            return res.data;
        },
        enabled: !!id, // Enable the query only when the id is available
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

    // Destructure the user details
    const { email, role, student, teacher, username, is_active, mobile_number, created_at } = singleUserDetails;

    // user image
    const userImage = student && student.photo_url || teacher && teacher.photo_url;

    // update profile picture
    const updateProfilePicture = async (data) => {
        const user_photo_update_data = {};
        setFormLoading(true);
        let uploadedPhotoUrl = '';
        let public_id = '';

        // if profile picture is uploaded
        if (data.updated_profile_picture && data.updated_profile_picture.length > 0) {
            const picture = data.updated_profile_picture[0];

            // Image type check
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            if (!allowedTypes.includes(picture.type)) {
                setFormLoading(false);
                return toast.error('Invalid image type. Please upload a JPEG, PNG, or JPG image.');
            }

            const formData = new FormData();
            formData.append("file", picture);
            formData.append("upload_preset", cloudinary_upload_preset);

            try {
                const cloudinaryRes = await axios.post(`https://api.cloudinary.com/v1_1/${cloudinary_cloud_name}/image/upload`, formData);
                console.log(cloudinaryRes);
                uploadedPhotoUrl = cloudinaryRes.data.secure_url;
                public_id = cloudinaryRes.data.public_id;
                toast.success('Image uploaded successfully');
            } catch (error) {
                console.log(error);
                setFormLoading(false);
                return toast.error('Failed to upload image. Please try again.');
            }
        }

        if (uploadedPhotoUrl !== '' && public_id !== '') {
            user_photo_update_data.photo_url = uploadedPhotoUrl;
            user_photo_update_data.photo_public_id = public_id;
        }


        if (Object.keys(user_photo_update_data).length === 0) {
            return toast.error('No image uploaded.');
        }

        // send data to backend
        try {
            let requestUrl = "";
            setFormLoading(true);
            if (student && role === 'student') requestUrl = `/students/updateByAdmin/${student.id}`;
            if (teacher && role === 'teacher') requestUrl = `/teachers/updateByAdmin/${teacher.id}`;

            const res = await axiosSecure.patch(`${requestUrl}`, user_photo_update_data);
            console.log(res);
            toast.success(res?.data?.message || "Profile picture updated");
            reset();
            singleUserDetailsRefetch();
            // @ts-ignore
            document.getElementById("update_profile_picture_modal").close();
        } catch (error) {
            console.log(error);
            // @ts-ignore
            document.getElementById("update_profile_picture_modal").close();
            const message = errorMessageParser(error);
            toast.error(message || "Failed to update profile picture. Please try again.");
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div>
            <div className="w-11/12 my-5 bg-white p-4 mx-auto rounded-xl">
                <div className="border-b border-base-300 flex items-center justify-between">
                    <SectionHeader section_title='User Profile' />


                    {/* User Details Edit Button */}
                    <div className="sm:tooltip sm:tooltip-left" data-tip="Edit basic User Details">
                        <button
                            onClick={() => {
                                // @ts-ignore
                                document.getElementById('update_user_details_modal').showModal()
                            }}
                            className="btn btn-sm sm:btn-md btn-primary">
                            <FaEdit /> Edit
                        </button>
                    </div>
                </div>

                {/* user details */}
                < div className="flex flex-col sm:flex-row sm:gap-5 py-5">
                    {/* Picture left square */}
                    <div className="group/user-image mx-auto sm:mx-0">
                        <div className="sm:min-w-32 max-w-52 rounded-3xl relative">
                            <img className="rounded-3xl w-full" src={userImage || defaultImage} />


                            {/* Update Profile Picture */}
                            <div className="absolute bottom-0 left-0 flex justify-center gap-5 place-items-center bg-neutral opacity-55 w-full sm:min-w-32 max-w-52 h-12 rounded-b-3xl">
                                {/* Profile Picture Full View */}
                                <div>
                                    <button className="btn btn-sm btn-circle btn-ghost hover:bg-primary-tint hover:text-primary hover:border border-primary shadow-none text-white"
                                        onClick={() => {
                                            // @ts-ignore
                                            document.getElementById('show_full_profile_picture_modal').showModal()
                                        }}
                                    >
                                        <ImZoomIn />
                                    </button>
                                </div>

                                <div>
                                    <button
                                        className="btn btn-sm btn-circle btn-ghost hover:bg-primary-tint hover:text-primary hover:border border-primary shadow-none text-white"
                                        onClick={() => {
                                            // @ts-ignore
                                            document.getElementById('update_profile_picture_modal').showModal()
                                        }}
                                    >
                                        <FaEdit />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Basic Details */}
                    <div className="sm:grow">
                        {/* Name & Status */}
                        <div className="flex items-center gap-2 mt-4 md:mt-0">
                            <h2 className="text-xl sm:text-3xl font-bold">
                                {student && student.name || teacher && teacher.name}
                            </h2>
                            <button className={`badge rounded-full ${is_active ? "bg-success" : "bg-error"}`}>{is_active ? "Active" : "Disabled"}</button>
                        </div>


                        <div>
                            {/* Role */}
                            <h4 className="font-medium mb-4"><FaUserEdit className="inline text-primary" /> {role.toUpperCase()}</h4>

                            {/* User ID, created at */}
                            <div className="text-sm flex flex-col sm:flex-row sm:items-center max-w-80 border-b-2 sm:border-0 border-base-300 pb-2 sm:pb-0 mb-2 sm:mb-0">
                                <h4 className="uppercase w-28">User ID: {singleUserDetails?.id}</h4>

                                <div className="divider divider-vertical sm:divider-horizontal my-1 sm:mx-1"></div>

                                <h4 className="w-44"><FaCalendar className="inline text-primary" /> Created at: {created_at.split('T')[0]}</h4>
                            </div>

                            {/* Role ID, created at */}
                            <div className="text-sm flex flex-col sm:flex-row sm:items-center max-w-80">
                                <h4 className="w-28">{role.toUpperCase()} ID: {student && student.id || teacher && teacher.id}</h4>

                                <div className="divider divider-vertical sm:divider-horizontal my-1 sm:mx-1"></div>

                                <h4 className="w-44"><FaCalendar className="inline text-primary" /> Created at: {student && student.created_at.split('T')[0] || teacher && teacher.created_at.split('T')[0]}</h4>
                            </div>


                            {/* username, email, mobile */}
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 space-y-2 sm:space-y-0">
                                <div>
                                    <h4 className="text-gray-500">Username</h4>
                                    <h4 className="font-semibold">{username}</h4>
                                </div>

                                <div>
                                    <h4 className="text-gray-500">Email</h4>
                                    <h4 className="font-semibold">{email}</h4>
                                </div>

                                <div>
                                    <h4 className="text-gray-500">Mobile</h4>
                                    <h4 className="font-semibold">{mobile_number}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Role Specific details */}
            <div className="mt-10 w-11/12 bg-white p-4 mx-auto rounded-xl">
                <div className="border-b border-base-300 flex items-center mb-5 justify-between">
                    <SectionHeader section_title={`${role} Details`} />

                    <div className="sm:tooltip sm:tooltip-left" data-tip={`Edit ${role} Details`}>
                        <button
                            // @ts-ignore
                            onClick={() => document.getElementById("update_users_other_details_modal").showModal()}
                            className="btn btn-sm sm:btn-md btn-primary"
                        >
                            <FaEdit /> Edit
                        </button>
                    </div>
                </div>


                {/* Student Specific Data */}
                {
                    student && (
                        <div className="grid sm:grid-cols-3 justify-between items-center md:text-lg mb-4 space-y-4 sm:space-y-0 sm:gap-4">
                            {/* Registration Number */}
                            <div>
                                <h4 className="text-gray-500">Registration Number</h4>
                                <h4 className="font-semibold">{student?.registration}</h4>
                            </div>

                            {/* Current Semester */}
                            <div className="capitalize">
                                <h4 className="text-gray-500">Current Semester</h4>
                                <h4 className="font-semibold">{
                                    student?.semester?.semester_number
                                    ||
                                    <span className="text-error">N/A</span>
                                }(
                                    {student?.semester?.semester_name
                                        ||
                                        <span className="text-error">N/A</span>
                                    })</h4>
                            </div>

                            {/* Session */}
                            <div>
                                <h4 className="text-gray-500">Session</h4>
                                <h4 className="font-medium">{student?.session || <span className="text-error">N/A</span>}</h4>
                            </div>
                        </div>
                    )
                }

                <div className="md:text-lg">
                    <div className="grid sm:grid-cols-3 justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:gap-4">
                        {/* Date of Birth */}
                        <div>
                            <h4 className="text-gray-500">Date of Birth</h4>

                            <h4 className="font-medium">
                                {(student && student.date_of_birth) && student?.date_of_birth?.split("T")[0]}

                                {(student && student.date_of_birth === null) && <span className="text-error">N/A</span>}

                                {(teacher && teacher.date_of_birth) && teacher?.date_of_birth?.split("T")[0]}

                                {(teacher && teacher.date_of_birth === null) && <span className="text-error">N/A</span>}
                                <span className="text-sm italic ml-1">(YYYY-MM-DD)</span>
                            </h4>
                        </div>

                        <div className="sm:col-span-2">
                            {/* Department */}
                            <h4 className="text-gray-500">Department</h4>
                            <h4 className="font-medium">
                                {
                                    (student && student.department) && student?.department?.department_name.toUpperCase()
                                }
                                {
                                    (teacher && teacher.department) && teacher.department.department_name.toUpperCase()
                                }
                                {
                                    (student && student.department === null) && <span className="text-error">Not Assigned</span>
                                }
                                {
                                    (teacher && teacher.department === null) && <span className="text-error">Not Assigned</span>
                                }
                            </h4>
                        </div>
                    </div>

                    <div className="mb-4">
                        {/* Present Address */}
                        <h4 className="text-gray-500">Present Address</h4>
                        <h4>
                            {(student && student.present_address) && student.present_address}
                            {student && student.present_address === "" && <span className="text-error">N/A</span>}

                            {(teacher && teacher.present_address) && teacher.present_address}
                            {teacher && teacher.present_address === "" && <span className="text-error">N/A</span>}
                        </h4>
                    </div>

                    <div>
                        {/* Permanent Address */}
                        <h4 className="text-gray-500">Permanent Address</h4>

                        <h4 className="font-medium">
                            {student && student.permanent_address}
                            {student && student.permanent_address === "" && <span className="text-error">N/A</span>}

                            {teacher && teacher.permanent_address}
                            {teacher && teacher.permanent_address === "" && <span className="text-error">N/A</span>}
                        </h4>
                    </div>
                </div>
            </div>







            {/* User data Update Modal (Email, Account Status) */}
            <dialog id="update_user_details_modal" className="modal">
                <UpdateUserAuthDetailsByAdminModal
                    singleUserDetails={singleUserDetails}
                    singleUserDetailsRefetch={singleUserDetailsRefetch}
                    user_id={id}
                />
            </dialog>

            {/* Other data (Teacher/Student Tables data) update Modal  */}
            <dialog id="update_users_other_details_modal" className="modal">
                <UpdateUsersAllDetailsModal
                    singleUserDetails={singleUserDetails}
                    singleUserDetailsRefetch={singleUserDetailsRefetch}
                    user_specific_table_id={student && student.id || teacher && teacher.id}
                />
            </dialog>

            {/* profile image show and update modal */}
            <dialog id="show_full_profile_picture_modal" className="modal">
                <div className="modal-box">
                    <div className="rounded">
                        <img src={userImage || defaultImage} />
                    </div>
                    <h3 className="font-bold text-lg text-center mt-3">{singleUserDetails?.student && singleUserDetails?.student.name || singleUserDetails?.teacher && singleUserDetails?.teacher.name}</h3>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <dialog id="update_profile_picture_modal" className="modal">
                <div className="modal-box">
                    <h2>Update Profile Picture</h2>
                    <form className="mt-3"
                        onSubmit={handleSubmit(updateProfilePicture)}>
                        <label className="label">Upload a new profile picture</label>
                        <p className="my-2">(Only <span className="text-info text-xs italic font-medium">JPG, JPEG, PNG</span> are allowed)</p>

                        <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                            <input type="file" accept=".jpg, .jpeg, .png" className="file-input w-full"
                                {...register("updated_profile_picture")}
                            />

                            <button className={`btn ${formLoading && "btn-disabled"} btn-success mt-2 md:mt-0`} type='submit' disabled={formLoading}>
                                {formLoading ? <AiOutlineLoading3Quarters className='animate-spin' /> : "Update"}
                            </button>
                        </div>

                    </form>

                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div >
    );
};

export default SingleUserDetails;