import { useLocation, useParams } from "react-router-dom";

// @ts-ignore
import defaultImage from "../../assets/blank-profile-picture.png";
import SectionHeader from "../../utils/SectionHeader/SectionHeader.jsx";


const SingleUserDetails = () => {
    const { id } = useParams();
    const location = useLocation();

    // retrieve user details from the state
    const userDetails = location.state?.userData;
    console.log(userDetails);
    const { email, role, student, teacher, username, is_active } = userDetails;


    if (!userDetails || (userDetails?.id).toString() !== (id)) {
        return <h2 className="text-error text-2xl text-center">User Not Matched. Go Back.</h2>;
    }

    const userImage = student && student.photo_url || teacher && teacher.photo_url;

    return (
        <div>
            <div className="place-self-center">
                <SectionHeader section_title='User Details' />
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-5 place-self-center">
                {/* Picture left square */}
                <div className="avatar w-full sm:min-w-60 max-w-72 border p-2 rounded">
                    <div className="rounded">
                        <img src={userImage || defaultImage} />
                    </div>
                </div>

                {/* Id, Name, email, Role, Department, username right */}
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
                                    <p className="font-bold">ID:</p>
                                </th>
                                <td>
                                    {student && student.id || teacher && teacher.id}
                                </td>
                            </tr>

                            {/* Name */}
                            <tr className="text-lg hover:bg-base-300 capitalize">
                                <th>
                                    <p className="font-bold">Name:</p>
                                </th>
                                <td>
                                    {student && student.name || teacher && teacher.name}
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

                            {/* Account Status */}
                            <tr className="text-lg hover:bg-base-300">
                                <th>
                                    <p className="font-bold">Account Status:</p>
                                </th>
                                <td>
                                    <button className={`badge text-black ${is_active ? "bg-success" : "bg-error"}`}>{is_active ? "Active" : "Disabled"}</button>
                                </td>
                            </tr>

                            {/* Department */}
                            <tr className="text-lg hover:bg-base-300">
                                <th>
                                    <p className="font-bold">Department:</p>
                                </th>
                                <td>
                                    {
                                        (student && student.department) && student?.department?.department_name.toUpperCase()
                                    }
                                    {
                                        (teacher && teacher.department) && teacher.department.department_name.toUpperCase()
                                    }
                                    {
                                        (!student && !teacher) && <p className="text-error">Not Assigned</p>
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Other details */}
            <div className="place-self-center mt-10">
                <div className="place-self-center">
                    <SectionHeader section_title='Other Details' />
                </div>
                {
                    student && (
                        <div className="grid sm:grid-cols-3 max-w-4xl justify-between items-center md:text-lg mb-2 space-y-1 sm:space-y-0 gap-2">
                            <h2>
                                <span className="font-bold mr-1 underline underline-offset-2">Registration Number:</span>
                                {student?.registration}
                            </h2>
                            <h2 className="capitalize">
                                <span className="font-bold mr-1 underline underline-offset-2">Current Semester:</span>
                                {student?.semester?.semester_number}({student?.semester?.semester_name})</h2>
                            <h2>
                                <span className="font-bold mr-1 underline underline-offset-2">Session:</span>
                                {student?.session}
                            </h2>
                        </div>
                    )
                }
                <div className="md:text-lg max-w-4xl">
                    <div className="grid sm:grid-cols-3 justify-between items-center max-w-4xl mb-2 space-y-1 sm:space-y-0 gap-2">
                        <h2>
                            <span className="font-bold mr-1 underline underline-offset-2">Mobile:</span>
                            {(student && student.mobile_number) && student.mobile_number}
                            {(student && (student.mobile_number === null || student.mobile_number === undefined || student.mobile_number === "")) && <span className="text-error">N/A</span>}

                            {(teacher && teacher.mobile_number) && teacher.mobile_number}
                            {(teacher && (teacher.mobile_number === null || teacher.mobile_number === undefined || teacher.mobile_number === "")) && <span className="text-error">N/A</span>}
                        </h2>

                        <h2 className="sm:col-span-2">
                            <span className="font-bold mr-1 underline underline-offset-2">Date of Birth:</span>
                            {(student && student.date_of_birth) && student?.date_of_birth?.split("T")[0]}

                            {(student && (student.date_of_birth === null || student.date_of_birth === undefined || student.date_of_birth === "")) && <span className="text-error">N/A</span>}

                            {(teacher && teacher.date_of_birth) && teacher?.date_of_birth?.split("T")[0]}
                            {(teacher && (teacher.date_of_birth === null || teacher.date_of_birth === undefined || teacher.date_of_birth === "")) && <span className="text-error">N/A</span>}
                            (YYYY-MM-DD)
                        </h2>
                    </div>

                    <h2 className="mb-2">
                        <span className="font-bold mr-1 underline underline-offset-2">Permanent Address:</span>
                        {student && student.permanent_address}
                        {student && (student.permanent_address === null || student.permanent_address === undefined || student.permanent_address === "") && <span className="text-error">N/A</span>}

                        {teacher && teacher.permanent_address}
                        {teacher && (teacher.permanent_address === null || teacher.permanent_address === undefined || teacher.permanent_address === "") && <span className="text-error">N/A</span>}
                    </h2>
                    <h2>
                        <span className="font-bold mr-1 underline underline-offset-2">Present Address:</span>
                        {(student && student.present_address) && student.present_address}
                        {student && (student.present_address === null || student.present_address === undefined || student.present_address === "") && <span className="text-error">N/A</span>}

                        {(teacher && teacher.present_address) && teacher.present_address}
                        {teacher && (teacher.present_address === null || teacher.present_address === undefined || teacher.present_address === "") && <span className="text-error">N/A</span>}
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default SingleUserDetails;