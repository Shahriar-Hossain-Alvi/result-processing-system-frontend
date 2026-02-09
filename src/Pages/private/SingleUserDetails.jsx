import { useParams } from "react-router-dom";
import SectionHeader from "../../utils/SectionHeader/SectionHeader.jsx";
import { FaEdit } from "react-icons/fa";
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
    const { email, role, student, teacher, username, is_active, mobile_number } = singleUserDetails;

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
        <div className="bg-white border w-11/12 mx-auto my-5">
            <div className="border-b border-base-300 flex items-center justify-between mb-5">
                <SectionHeader section_title='User Profile' />


                {/* User Details Edit Button */}
                <div className="sm:tooltip" data-tip="Edit USER Details">
                    <button
                        onClick={() => {
                            // @ts-ignore
                            document.getElementById('update_user_details_modal').showModal()
                        }}
                        className="btn btn-primary ">
                        <FaEdit /> Edit
                    </button>
                </div>
            </div>

            <div>
                {/* user details */}
                < div className="flex flex-col sm:flex-row sm:gap-5 place-self-center">

                    {/* Picture left square */}
                    <div className="group/user-image">
                        <div className="mx-auto w-full sm:min-w-32 max-w-52 rounded-3xl relative">
                            <div className="rounded">
                                <img src={userImage || defaultImage} />
                            </div>

                            {/* Update Profile Picture */}
                            <div className="absolute bottom-0 left-0 group-hover/user-image:flex justify-center gap-5 place-items-center bg-neutral opacity-55 w-full sm:min-w-32 max-w-52 group-hover/user-image:h-12 hidden">
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

                    {/* Id, Name, email, Role, username */}
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* ID */}
                                <tr className="text-lg hover:bg-base-300">
                                    <th>
                                        <p className="font-bold">User ID & {role.toUpperCase()} ID:</p>
                                    </th>
                                    <td>
                                        {singleUserDetails?.id} & {student && student.id || teacher && teacher.id}
                                    </td>
                                </tr>

                                {/* Role */}
                                <tr className="text-lg hover:bg-base-300capitalize">
                                    <th>
                                        <p className="font-bold">Role:</p>
                                    </th>
                                    <td className="capitalize">
                                        {role}
                                    </td>
                                </tr>

                                {/* Username */}
                                <tr className="text-lg hover:bg-base-300">
                                    <th>
                                        <p className="font-bold">Username:</p>
                                    </th>
                                    <td>
                                        {username}
                                    </td>
                                </tr>

                                {/* Email */}
                                <tr className="text-lg hover:bg-base-300">
                                    <th>
                                        <p className="font-bold">Email:</p>
                                    </th>
                                    <td>
                                        {email}
                                    </td>
                                </tr>

                                {/* Mobile */}
                                <tr className="text-lg hover:bg-base-300">
                                    <th>
                                        <p className="font-bold">Mobile:</p>
                                    </th>
                                    <td>
                                        {mobile_number || <span className="text-error">N/A</span>}
                                    </td>
                                </tr>

                                {/* Account Status */}
                                <tr className="text-lg hover:bg-base-300">
                                    <th>
                                        <p className="font-bold">Account Status:</p>
                                    </th>
                                    <td>
                                        <button className={`badge text-black ${is_active ? "bg-success" : "bg-error"}`}>{is_active ? "Active" : "Disabled"}</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Other details */}
                <div className="place-self-center mt-10">
                    <div className="place-self-center relative">
                        <SectionHeader section_title='Other Details' />

                        <div className="sm:tooltip absolute -right-9 -top-2" data-tip={`Edit ${role.toUpperCase()} Details`}>
                            <button
                                // @ts-ignore
                                onClick={() => document.getElementById("update_users_other_details_modal").showModal()}
                                className="btn btn-sm btn-ghost hover:bg-transparent border-0 shadow-none  hover:text-success ">
                                <FaEdit />
                            </button>
                        </div>
                    </div>

                    {/* name */}
                    <h2 className="text-xl place-self-center mb-5">
                        <span className="font-bold mr-1 underline underline-offset-2">Name:</span>
                        {student && student.name || teacher && teacher.name}
                    </h2>

                    {/* Student Specific Data */}
                    {
                        student && (
                            <div className="grid sm:grid-cols-3 max-w-4xl justify-between items-center md:text-lg mb-2 space-y-1 sm:space-y-0 gap-5">
                                {/* Registration Number */}
                                <h2>
                                    <span className="font-bold mr-1 underline underline-offset-2">Registration Number:</span>
                                    {student?.registration}
                                </h2>

                                {/* Current Semester */}
                                <h2 className="capitalize">
                                    <span className="font-bold mr-1 underline underline-offset-2">Current Semester:</span>
                                    {
                                        student?.semester?.semester_number
                                        ||
                                        <span className="text-error">N/A</span>
                                    }(
                                    {student?.semester?.semester_name
                                        ||
                                        <span className="text-error">N/A</span>
                                    })
                                </h2>

                                {/* Session */}
                                <h2>
                                    <span className="font-bold mr-1 underline underline-offset-2">Session:</span>
                                    {student?.session || <span className="text-error">N/A</span>}
                                </h2>
                            </div>
                        )
                    }
                    <div className="md:text-lg max-w-4xl">
                        <div className="grid sm:grid-cols-3 justify-between items-center max-w-4xl mb-2 space-y-1 sm:space-y-0 gap-5">
                            {/* Date of Birth */}
                            <h2 className="sm:col-span-2">
                                <span className="font-bold mr-1 underline underline-offset-2">Date of Birth:</span>
                                {(student && student.date_of_birth) && student?.date_of_birth?.split("T")[0]}

                                {(student && student.date_of_birth === null) && <span className="text-error">N/A</span>}

                                {(teacher && teacher.date_of_birth) && teacher?.date_of_birth?.split("T")[0]}

                                {(teacher && teacher.date_of_birth === null) && <span className="text-error">N/A</span>}
                                <span className="text-sm italic ml-1">(YYYY-MM-DD)</span>
                            </h2>
                        </div>


                        {/* Department */}
                        <h2 className="">
                            <span className="font-bold mr-1 underline underline-offset-2">Department:</span>
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
                        </h2>


                        {/* Permanent Address */}
                        <h2 className="my-2">
                            <span className="font-bold mr-1 underline underline-offset-2">Permanent Address:</span>
                            {student && student.permanent_address}
                            {student && student.permanent_address === "" && <span className="text-error">N/A</span>}

                            {teacher && teacher.permanent_address}
                            {teacher && teacher.permanent_address === "" && <span className="text-error">N/A</span>}
                        </h2>

                        {/* Present Address */}
                        <h2>
                            <span className="font-bold mr-1 underline underline-offset-2">Present Address:</span>
                            {(student && student.present_address) && student.present_address}
                            {student && student.present_address === "" && <span className="text-error">N/A</span>}

                            {(teacher && teacher.present_address) && teacher.present_address}
                            {teacher && teacher.present_address === "" && <span className="text-error">N/A</span>}
                        </h2>
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