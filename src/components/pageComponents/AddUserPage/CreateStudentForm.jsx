import { useForm } from "react-hook-form";
import SectionHeader from "../../../utils/SectionHeader/SectionHeader.jsx";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { GrFormNextLink } from "react-icons/gr";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";
import toast from "react-hot-toast";
import axios from "axios";


const CreateStudentForm = ({ allDepartments, isDepartmentsLoading, isDepartmentsError }) => {
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    // Load Cloudinary Cloud Name and Upload Preset from .env file
    const cloudinary_cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const cloudinary_upload_preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const [showNextForm, setShowNextForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);



    // fetch semesters
    const { data: allSemesters, isLoading: isSemesterLoading, isError: isSemesterError } = useQuery({
        queryKey: ['allSemesters'],
        queryFn: async () => {
            const res = await axiosSecure('/semesters');
            return res.data;
        }
    })

    if (isDepartmentsError) {
        toast.error('Failed to fetch departments');
    }

    if (isSemesterError) {
        toast.error('Failed to fetch semesters');
    }


    const createStudent = async (data) => {
        setFormLoading(true);
        let uploadedPhotoUrl = '';
        let public_id = '';

        // if profile picture is uploaded
        if (data.profile_picture && data.profile_picture.length > 0) {
            const picture = data.profile_picture[0];
            console.log(picture);
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

        // create student object
        const create_student_payload = {
            // required fields for student table
            name: data.name,
            registration: data.registration_number,
            session: data.session,
            department_id: parseInt(data.departmentId),
            semester_id: parseInt(data.semesterId),

            // optional fields for student table
            photo_url: uploadedPhotoUrl || "",
            photo_public_id: public_id || "",
            present_address: data.present_address || "",
            permanent_address: data.permanent_address || "",
            mobile_number: data.mobile_number || "",
            date_of_birth: data.date_of_birth ? new Date(data.date_of_birth).toISOString() : null,

            // required fields for user table
            user: {
                username: data.email,
                email: data.email,
                role: "student",
                is_active: data.account_status !== "disable",
                password: data.password || "123456"
            }
        }
        // console.log(create_student_payload);
        // send data to backend
        try {
            const res = await axiosSecure.post('/students', create_student_payload);
            console.log(res);
            toast.success(res?.data?.message || "Student created successfully");
            reset();
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.detail || 'Failed to create student. Please try again.');
        } finally {
            setFormLoading(false);
        }
    };



    return (
        <div className="text-center">
            <SectionHeader section_title='Student Registration' />
            <form
                className="flex flex-col md:flex-row justify-center items-center mt-5"
                onSubmit={handleSubmit(createStudent)}
            >
                {/* User Table Fieldset */}
                <fieldset className="fieldset text-left bg-base-200 border-base-300 rounded-box w-xs border p-4">

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
                        <input type="text" className="input" disabled placeholder="student" />
                    </div>

                    {/* Default Password */}
                    <div className={`w-full ${errors.password && "tooltip tooltip-open tooltip-top tooltip-error"}`} data-tip={errors.password && errors.password.message}>
                        <label className="label">Password<span className="text-red-600">*</span></label>
                        <input type="text" className="input" placeholder="Password" defaultValue="123456"
                            {...register("password", { required: "Password is required" })}
                        />
                    </div>


                    {/* Account Status (Active by default) */}
                    <label className="label">Active Account<span className="text-red-600">*</span></label>
                    <select className="select" {...register("account_status")} defaultValue="active">
                        <option value="active">Active</option>
                        <option value="disable">Disable</option>
                    </select>

                    {/* Next fields button */}
                    {
                        showNextForm ?
                            <button type="button" onClick={() => setShowNextForm(false)} className="btn btn-error mt-4">Close <IoMdClose /></button>
                            :
                            <button type="button" onClick={() => setShowNextForm(true)} className="btn btn-success mt-4">Next <GrFormNextLink /></button>
                    }
                </fieldset>

                {/* Student Table Fieldset */}
                <fieldset className={`${showNextForm ? 'w-xs mt-3 md:ml-3' : 'hidden'} fieldset bg-base-200 border-base-300 rounded-box border p-4 text-left`}>

                    {/* Name */}
                    <div className={`w-full ${errors.name && "tooltip tooltip-open tooltip-top tooltip-error"}`} data-tip={errors.name && errors.name.message}>
                        <label className="label">Name<span className="text-red-600">*</span></label>
                        <input type="text" className="input" placeholder="Full Name"
                            {...register("name", { required: "Name is required" })}
                        />
                    </div>

                    <div className={`w-full ${errors.registration_number && "tooltip tooltip-open tooltip-top tooltip-error"}`} data-tip={errors.registration_number && errors.registration_number.message}>
                        <label className="label">Registration Number<span className="text-red-600">*</span></label>
                        <input type="text" className="input" placeholder="Registration Number"
                            {...register("registration_number", { required: "Registration Number is required" })}
                        />
                    </div>

                    <div className={`w-full ${errors.session && "tooltip tooltip-open tooltip-top tooltip-error"}`} data-tip={errors.session && errors.session.message}>
                        <label className="label">Session<span className="text-red-600">*</span></label>
                        <input type="text" className="input" placeholder="Session"
                            {...register("session", { required: "Session is required" })}
                        />
                    </div>


                    {/* Departments */}
                    <div className={`w-full ${errors.department && "tooltip tooltip-open tooltip-top tooltip-error"}`} data-tip={errors.department && errors.department.message}>
                        <label className="label">Select Department<span className="text-red-600">*</span></label>
                        {
                            isDepartmentsLoading ?
                                <div className="skeleton h-10"></div>
                                :
                                <select
                                    {...register("departmentId", { required: "Department is required" })}
                                    defaultValue=""
                                    className="select select-bordered w-full max-w-xs">
                                    <option disabled value="">Choose a Department</option>
                                    {
                                        allDepartments?.map(dept => <option
                                            key={dept.id} value={dept.id}

                                        >{dept.department_name}</option>)
                                    }
                                </select>}
                    </div>

                    {/* Semesters */}
                    <div className={`w-full ${errors.semester && "tooltip tooltip-open tooltip-top tooltip-error"}`} data-tip={errors.semester && errors.semester.message}>
                        <label className="label">Select Semester<span className="text-red-600">*</span></label>
                        {
                            isSemesterLoading ?
                                <div className="skeleton h-10"></div>
                                :
                                <select
                                    {...register("semesterId", { required: "Semester is required" })}
                                    defaultValue=""
                                    className="select select-bordered w-full max-w-xs">
                                    <option disabled value="">Choose a Semester</option>
                                    {
                                        allSemesters?.map(semester => <option
                                            key={semester.id} value={semester.id}

                                        >{semester.semester_number}</option>)
                                    }
                                </select>}
                    </div>

                    <label className="label">Present Address</label>
                    <input type="text" className="input" placeholder="Present Address"
                        {...register("present_address")}
                    />

                    <label className="label">Permanent Address</label>
                    <input type="text" className="input" placeholder="Permanent Address"
                        {...register("permanent_address")}
                    />

                    <label className="label">Mobile Number: </label>
                    <input type="text" className="input" placeholder="Mobile Number"
                        {...register("mobile_number")}
                    />

                    <label className="label">Date of Birth</label>
                    <input type="date" className="input" placeholder="Date of Birth"
                        max={new Date().toISOString().split("T")[0]}
                        {...register("date_of_birth")}
                    />


                    <label className="label">Profile Picture</label>
                    <input type="file" className="file-input"
                        {...register("profile_picture")}
                    />

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
    );
};

export default CreateStudentForm;