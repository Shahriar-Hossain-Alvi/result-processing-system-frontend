import React, { useState } from 'react';
import { GrFormNextLink } from 'react-icons/gr';
import { IoMdClose } from 'react-icons/io';

const CreateUserForm = ({
    handleSubmit,
    errors, register,
    formLoading, allDepartments,
    isDepartmentsLoading,
    role, userSpecificData = {}
}) => {
    const [showNextForm, setShowNextForm] = useState(false);

    // Destructure user-specific data from student object
    // @ts-ignore
    const { submitAction, isSemesterLoading, allSemesters } = userSpecificData;


    return (
        <form
            className="flex flex-col md:flex-row justify-center items-center mt-5 mx-auto"
            onSubmit={handleSubmit(submitAction || ((data) => console.log(data)))}
        >
            {/* User Table Fieldset */}
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
                    <input type="text" className="input" disabled placeholder={role} />
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

            {/* Student/Teacher Table Fieldset */}
            <fieldset className={`${showNextForm ? 'max-w-xs mt-3 md:ml-3' : 'hidden'} fieldset bg-base-200 border-base-300 rounded-box border p-1 sm:p-4 text-left`}>

                {/* Name */}
                <div className={`w-full ${errors.name && "tooltip tooltip-open tooltip-top tooltip-error"}`} data-tip={errors.name && errors.name.message}>
                    <label className="label">Name<span className="text-red-600">*</span></label>
                    <input type="text" className="input" placeholder="Full Name"
                        {...register("name", { required: "Name is required" })}
                    />
                </div>

                {
                    role === "student" && (<div className={`w-full ${errors.registration_number && "tooltip tooltip-open tooltip-top tooltip-error"}`} data-tip={errors.registration_number && errors.registration_number.message}>
                        <label className="label">Registration Number<span className="text-red-600">*</span></label>
                        <input type="text" className="input" placeholder="Registration Number"
                            {...register("registration_number", { required: "Registration Number is required" })}
                        />
                    </div>)
                }

                {
                    role === "student" && (<div className={`w-full ${errors.session && "tooltip tooltip-open tooltip-top tooltip-error"}`} data-tip={errors.session && errors.session.message}>
                        <label className="label">Session<span className="text-red-600">*</span></label>
                        <input type="text" className="input" placeholder="Session"
                            {...register("session", { required: "Session is required" })}
                        />
                    </div>)
                }


                {/* Departments */}
                <div className={`w-full`}>
                    <label className="label">Select Department</label>
                    {
                        isDepartmentsLoading ?
                            <div className="skeleton h-10"></div>
                            :
                            <select
                                {...register("departmentId")}
                                defaultValue={null}
                                className="select select-bordered w-full max-w-xs">
                                <option value={null}>Choose a Department</option>
                                {
                                    allDepartments?.map(dept => <option
                                        key={dept.id} value={dept.id}

                                    >{dept.department_name}</option>)
                                }
                            </select>}
                </div>

                {/* Semesters */}
                {
                    role === "student" && (
                        <div className={`w-full`}>
                            <label className="label">Select Semester</label>
                            {
                                isSemesterLoading ?
                                    <div className="skeleton h-10"></div>
                                    :
                                    <select
                                        {...register("semesterId")}
                                        defaultValue={null}
                                        className="select select-bordered w-full max-w-xs">
                                        <option value={null}>Choose a Semester</option>
                                        {
                                            allSemesters?.map(semester => <option
                                                key={semester.id} value={semester.id}

                                            >{semester.semester_number}</option>)
                                        }
                                    </select>}
                        </div>
                    )
                }

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
    );
};

export default CreateUserForm;