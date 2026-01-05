import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure.jsx';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import SectionHeader from '../../../utils/SectionHeader/SectionHeader.jsx';
import CreateUserForm from '../../ui/CreateUserForm.jsx';
import errorMessageParser from '../../../utils/errorMessageParser/errorMessageParser.js';


const CreateTeacherTab = ({ allDepartments, isDepartmentsPending, isDepartmentsError, departmentsError }) => {
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    // Load Cloudinary Cloud Name and Upload Preset from .env file
    const cloudinary_cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const cloudinary_upload_preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const [formLoading, setFormLoading] = useState(false);

    // Only runs when the error state actually changes (prevent Cannot update a component (`Fe`) error and show error toast)
    useEffect(() => {
        if (isDepartmentsError) {
            const message = errorMessageParser(departmentsError);
            toast.error(message || 'Failed to fetch departments');
        }
    }, [isDepartmentsError]);


    const createTeacher = async (data) => {
        setFormLoading(true);
        let uploadedPhotoUrl = '';
        let public_id = '';
        console.log(data);

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

        // // create teacher object
        const create_teacher_payload = {
            // required fields for teacher table
            name: data.name,
            department_id: parseInt(data.departmentId) || null,

            // optional fields for student table
            photo_url: uploadedPhotoUrl || "",
            photo_public_id: public_id || "",
            present_address: data.present_address || "",
            permanent_address: data.permanent_address || "",
            date_of_birth: data.date_of_birth ? data.date_of_birth : null,

            // required fields for user table
            user: {
                username: data.email,
                email: data.email,
                role: "teacher",
                mobile_number: data.mobile_number || null,
                is_active: data.account_status !== "disable",
                password: data.password || "123456"
            }
        }
        console.log(create_teacher_payload);
        // // send data to backend
        try {
            const res = await axiosSecure.post('/teachers/', create_teacher_payload);
            console.log(res);
            toast.success(res?.data?.message || "Teacher created successfully");
            reset();
        } catch (error) {
            console.log(error);
            const message = errorMessageParser(error);
            toast.error(message || "Failed to create teacher. Please try again.");

        } finally {
            setFormLoading(false);
        }
    };


    return (
        <div>
            <div className="text-center">
                <SectionHeader section_title='Teacher Registration' />

                <CreateUserForm
                    allDepartments={allDepartments}
                    errors={errors}
                    formLoading={formLoading}
                    handleSubmit={handleSubmit}
                    isDepartmentsPending={isDepartmentsPending}
                    register={register}
                    role="teacher"
                    userSpecificData={{
                        submitAction: createTeacher
                    }} />
            </div>
        </div>
    );
};

export default CreateTeacherTab;