import { useForm } from "react-hook-form";
import SectionHeader from "../../../utils/SectionHeader/SectionHeader.jsx";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";
import toast from "react-hot-toast";
import axios from "axios";
import CreateUserForm from "../../ui/CreateUserForm.jsx";


const CreateStudentTab = ({ allDepartments, isDepartmentsLoading, isDepartmentsError }) => {
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    // Load Cloudinary Cloud Name and Upload Preset from .env file
    const cloudinary_cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const cloudinary_upload_preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const [formLoading, setFormLoading] = useState(false);



    // fetch semesters
    const { data: allSemesters, isLoading: isSemesterLoading, isError: isSemesterError } = useQuery({
        queryKey: ['allSemesters'],
        queryFn: async () => {
            const res = await axiosSecure('/semesters/');
            return res.data;
        }
    })

    // Only runs when the error state actually changes (prevent Cannot update a component (`Fe`) error and show error toast)
    useEffect(() => {
        if (isDepartmentsError) {
            toast.error('Failed to fetch departments');
        }
    }, [isDepartmentsError]);

    useEffect(() => {
        if (isSemesterError) {
            toast.error('Failed to fetch semesters');
        }
    }, [isSemesterError]);


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

            // optional fields for student table
            department_id: parseInt(data.departmentId) || null,
            semester_id: parseInt(data.semesterId) || null,
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
        // send data to backend
        try {
            const res = await axiosSecure.post('/students/', create_student_payload);
            console.log(res);
            toast.success(res?.data?.message || "Student created successfully");
            reset();
        } catch (error) {
            console.log(error);
            const detail = error?.response?.data?.detail;
            const message = Array.isArray(detail) ? detail[0]?.msg : detail;
            toast.error(message || "Failed to create student. Please try again.");
        } finally {
            setFormLoading(false);
        }
    };



    return (
        <div className="text-center">
            <SectionHeader section_title='Student Registration' />

            <CreateUserForm
                allDepartments={allDepartments}
                errors={errors}
                formLoading={formLoading}
                handleSubmit={handleSubmit}
                isDepartmentsLoading={isDepartmentsLoading}
                register={register}
                role="student"
                userSpecificData={{
                    submitAction: createStudent,
                    isSemesterLoading,
                    allSemesters
                }} />
        </div>
    );
};

export default CreateStudentTab;