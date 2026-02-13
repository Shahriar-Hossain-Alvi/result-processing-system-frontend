import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure.jsx';
import { useForm } from 'react-hook-form';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useQuery } from '@tanstack/react-query';
import errorMessageParser from '../../../utils/errorMessageParser/errorMessageParser.js';
import toast from 'react-hot-toast';

const UpdateUsersAllDetailsModal = ({ singleUserDetails, singleUserDetailsRefetch, user_specific_table_id }) => {
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset } = useForm();
    const [formLoading, setFormLoading] = useState(false);

    // destructure singleUserDetails
    const { role, student, teacher } = singleUserDetails;

    console.log(singleUserDetails);

    // DEPARTMENTS query
    const { data: allDepartments, isPending, error, isError, refetch: allDepartmentsRefetch } = useQuery({
        queryKey: ['allDepartments'],
        queryFn: async () => {
            const res = await axiosSecure('/departments/');
            return res.data;
        }
    })

    // SEMESTERS query
    const { data: allSemesters, isPending: isSemesterPending, error: semesterError, isError: isSemesterError, refetch: totalSemestersRefetch } = useQuery({
        queryKey: ['totalSemesters'],
        queryFn: async () => {
            const res = await axiosSecure('/semesters/');
            return res.data;
        }
    })

    // Only runs when the error state actually changes (prevent Cannot update a component (`Fe`) error and show error toast)
    useEffect(() => {
        if (isError) {
            console.log(error);
            const message = errorMessageParser(error);
            toast.error(message || 'Failed to fetch departments');
        }
    }, [isError])

    useEffect(() => {
        if (isSemesterError) {
            console.log(semesterError);
            const message = errorMessageParser(semesterError);
            toast.error(message || 'Failed to fetch semesters');
        }
    }, [isSemesterError])

    // force-reset form when data changes(select options change, etc.)
    useEffect(() => {
        if (singleUserDetails) {
            // student and teacher can be null
            reset({
                updatedName: student?.name || teacher?.name,

                updatedRegistrationNumber: student?.registration,
                updatedSession: student?.session,
                updatedSemester: student?.semester?.id || "",

                updatedDateOfBirth: (student?.date_of_birth || teacher?.date_of_birth) || "",

                updatedDepartment: ((student?.department?.id || teacher?.department?.id) || ""),

                updatedPresentAddress: student?.present_address || teacher?.present_address,

                updatedPermanentAddress: student?.permanent_address || teacher?.permanent_address,
            });
        }
    }, [singleUserDetails, reset])


    const updateUserDetails = async (data) => {
        const updatedData = {}

        // updated name
        const currentName = student?.name || teacher?.name;
        if (data.updatedName && data.updatedName !== currentName) {
            updatedData.name = data.updatedName;
        }

        // updated registration number
        if (student && (data.updatedRegistrationNumber && data.updatedRegistrationNumber !== student.registration)) updatedData.registration = data.updatedRegistrationNumber;

        // updated session
        if (student && (data.updatedSession && data.updatedSession !== student.session)) updatedData.session = data.updatedSession;

        // updated semester
        if (data.updatedSemester !== "") {
            const selectedSemesterId = (data.updatedSemester === "none") ? null : parseInt(data.updatedSemester); // convert to null or integer
            const currentSemesterId = student?.semester?.id || null; // get current id or null
            if (student && selectedSemesterId !== currentSemesterId) updatedData.semester_id = selectedSemesterId;
        }

        // updated department
        if (data.updatedDepartment !== "") {
            const selectedDepartmentId = (data.updatedDepartment === "none") ? null : parseInt(data.updatedDepartment); // convert to null or integer
            const currentDepartmentId = (student && student?.department?.id) || (teacher && teacher?.department?.id) || null; // get current id or null

            if (selectedDepartmentId !== currentDepartmentId) updatedData.department_id = selectedDepartmentId;
        }

        // updated date of birth
        const currentDateOfBirth = (student && student.date_of_birth) || (teacher && teacher.date_of_birth) || null;
        const updatedDateOfBirth = data.updatedDateOfBirth === "" ? null : data.updatedDateOfBirth; // convert to null or date string
        if (updatedDateOfBirth !== currentDateOfBirth) {
            if (updatedDateOfBirth == null) {
                updatedData.date_of_birth = updatedDateOfBirth;
            } else {
                const selectedDate = new Date(updatedDateOfBirth);
                const today = new Date();
                if (selectedDate <= today) {
                    updatedData.date_of_birth = updatedDateOfBirth;
                } else {
                    // @ts-ignore
                    document.getElementById('update_users_other_details_modal').close();
                    return toast.error('Date of birth cannot be in the future.');
                }
            }
        }

        // updated present address
        const currentPresentAddress = (student && student.present_address) || (teacher && teacher.present_address) || "";
        if (data.updatedPresentAddress !== currentPresentAddress) updatedData.present_address = data.updatedPresentAddress;

        // updated permanent address
        const currentPermanentAddress = (student && student.permanent_address) || (teacher && teacher.permanent_address) || "";
        if (data.updatedPermanentAddress !== currentPermanentAddress) updatedData.permanent_address = data.updatedPermanentAddress;

        console.log(updatedData);
        // check if updated data is empty, if not, update user details
        if (Object.keys(updatedData).length === 0) {
            // @ts-ignore
            document.getElementById('update_users_other_details_modal').close();
            return toast.error('No changes detected.');
        }


        // send data to backend
        try {
            console.log(updatedData);
            let requestUrl = "";
            setFormLoading(true);
            if (role === 'student') requestUrl = '/students';
            if (role === 'teacher') requestUrl = '/teachers';

            const res = await axiosSecure.patch(`${requestUrl}/updateByAdmin/${user_specific_table_id}`, updatedData);
            console.log(res);
            // @ts-ignore
            document.getElementById('update_users_other_details_modal').close();
            toast.success(res?.data?.message || `${role.toUpperCase()} details updated successfully`);
            reset();
            singleUserDetailsRefetch();
        } catch (error) {
            console.log(error);
            const message = errorMessageParser(error);
            // @ts-ignore
            document.getElementById('update_users_other_details_modal').close();
            toast.error(message || `Failed to update ${role}. Please try again.`);
        } finally {
            reset();
            setFormLoading(false);
            allDepartmentsRefetch();
            totalSemestersRefetch();
        }
    }


    return (
        // <dialog id="update_users_other_details_modal" className="modal">
        <div className="modal-box">
            <h3 className="font-bold text-lg text-warning">Edit Other Details</h3>


            <form className='space-y-3 mt-4' onSubmit={handleSubmit(updateUserDetails)}>
                {/* name */}
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        className="input input-bordered w-full mt-2"
                        // defaultValue={student && student.name || teacher && teacher.name}
                        {...register("updatedName")}
                    />
                </div>

                {/* Student Specific Data (Registration Number, Semester, Session) */}
                {
                    student && (
                        <div className='space-y-4'>
                            {/* registration number */}
                            <div>
                                <label>Registration Number</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full mt-2"
                                    // defaultValue={student && student.registration}
                                    {...register("updatedRegistrationNumber")}
                                />
                            </div>

                            {/* Session */}
                            <div>
                                <label>Session <span className='text-primary-dark text-xs'>(eg: 2022-2023)</span></label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full mt-2"
                                    // defaultValue={student && student.session}
                                    {...register("updatedSession")}
                                />
                            </div>

                            {/* Semester */}
                            <div>
                                <label className="label mr-2">Semester</label>
                                {isSemesterPending && <input disabled placeholder='Loading...' />}
                                {
                                    !isSemesterPending && <select className="select"
                                        // defaultValue={(student?.semester?.id) ? student.semester.id : ""}
                                        {...register("updatedSemester")} >
                                        <option disabled value="">Pick a semester</option>
                                        {
                                            allSemesters?.map((semester) =>
                                                <option key={semester.id} value={semester.id}>
                                                    {semester.semester_number} - {semester.semester_name.toUpperCase()}
                                                </option>)
                                        }
                                        <option value="none">Student Passed / Clear Semester</option>
                                    </select>}
                            </div>
                        </div>
                    )
                }

                {/* Department */}
                <div>
                    <label className="label mr-2">Department</label>
                    {isPending && <input disabled placeholder='Loading...' />}
                    {
                        !isPending && <select className="select w-full mt-2"
                            // defaultValue={((student?.department?.id) ? student.department.id : "") || ((teacher?.department?.id) ? teacher.department.id : "")}
                            {...register("updatedDepartment")} >
                            <option disabled value="">Pick a department</option>
                            {
                                allDepartments?.map((department) =>
                                    <option key={department.id} value={department.id}>
                                        {department.department_name.toUpperCase()}
                                    </option>)
                            }
                            <option value="none">No Department</option>
                        </select>}
                </div>


                {/* Date of Birth */}
                <div>
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        className="input input-bordered w-full mt-2"
                        // defaultValue={(student?.date_of_birth || teacher?.date_of_birth) ? (student?.date_of_birth || teacher?.date_of_birth) : ""}
                        {...register("updatedDateOfBirth")}
                    />
                </div>


                {/* Present Address */}
                <div>
                    <label>Present Address <span className='text-primary-dark text-xs'>(Write Full Address- eg: House No, Road No, Area, City - City Code)</span></label>
                    <input
                        type="text"
                        className="input input-bordered w-full mt-2"
                        // defaultValue={student && student.present_address || teacher && teacher.present_address || ""}
                        {...register("updatedPresentAddress")}
                    />
                </div>

                {/* Present Address */}
                <div>
                    <label>Permanent Address <span className='text-primary-dark text-xs'>(Write Full Address- eg: House No, Road No, Area, City - City Code)</span></label>
                    <input
                        type="text"
                        className="input input-bordered w-full mt-2"
                        // defaultValue={student && student.permanent_address || teacher && teacher.permanent_address || ""}
                        {...register("updatedPermanentAddress")}
                    />
                </div>

                <button className={`btn ${formLoading && "btn-disabled"} btn-success w-full`} type='submit' disabled={formLoading}>
                    {formLoading ? <AiOutlineLoading3Quarters className='animate-spin' /> : "Update"}
                </button>
            </form>

            <div className="modal-action">
                <form method="dialog"><button className="btn btn-error text-white">Cancel</button></form>
            </div>
        </div>
        //</dialog>
    );
};

export default UpdateUsersAllDetailsModal;