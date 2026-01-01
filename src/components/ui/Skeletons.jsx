// @ts-ignore
import defaultImage from "../../assets/blank-profile-picture.png";

export const DepartmentsSkeleton = () => {
    return <div>
        <table className="table">
            {/* head */}
            <thead>
                <tr>
                    <th className="w-3">#</th>
                    <th className="w-16">Department Name</th>
                    <th className="w-16">Department ID</th>
                </tr>
            </thead>
            <tbody>
                {/* row 1 */}
                <tr>
                    <th className="skeleton h-5 w-3"></th>
                    <td className="skeleton h-5 w-16"></td>
                    <td className="skeleton h-5 w-16"></td>
                </tr>
                {/* row 2 */}
                <tr>
                    <th className="skeleton h-5 w-3"></th>
                    <td className="skeleton h-5 w-16"></td>
                    <td className="skeleton h-5 w-16"></td>
                </tr>
                {/* row 3 */}
                <tr>
                    <th className="skeleton h-5 w-3"></th>
                    <td className="skeleton h-5 w-16"></td>
                    <td className="skeleton h-5 w-16"></td>
                </tr>
            </tbody>
        </table>
    </div>
};


export const SemestersSkeleton = () => {
    return <div>
        <table className="table">
            {/* head */}
            <thead>
                <tr>
                    <th className="w-3">#</th>
                    <th className="w-16">Semester Name</th>
                    <th className="w-16">Semester Number</th>
                    <th className="w-16">Semester ID</th>
                </tr>
            </thead>
            <tbody>
                {/* row 1 */}
                <tr>
                    <th className="skeleton h-5 w-3"></th>
                    <td className="skeleton h-5 w-16"></td>
                    <td className="skeleton h-5 w-16"></td>
                    <td className="skeleton h-5 w-16"></td>
                </tr>
                {/* row 2 */}
                <tr>
                    <th className="skeleton h-5 w-3"></th>
                    <td className="skeleton h-5 w-16"></td>
                    <td className="skeleton h-5 w-16"></td>
                    <td className="skeleton h-5 w-16"></td>
                </tr>
                {/* row 3 */}
                <tr>
                    <th className="skeleton h-5 w-3"></th>
                    <td className="skeleton h-5 w-16"></td>
                    <td className="skeleton h-5 w-16"></td>
                    <td className="skeleton h-5 w-16"></td>
                </tr>
            </tbody>
        </table>
    </div>
};

export const AllUserTableSkeleton = () => {
    return <table className="table">
        {/* head */}
        <thead>
            <tr>
                <th>#</th>
                <th>Username/Email</th>
                <th>Role</th>
                <th>Account</th>
                <th>Name</th>
                <th>Department</th>
                <th>Photo</th>
                <th>Details</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td className="skeleton h-5 w-3"></td>
                <td className="skeleton h-5 w-3"></td>
                <td className="skeleton h-5 w-3"></td>
                <td className="skeleton h-5 w-3"></td>
                <td className="skeleton h-5 w-3"></td>
                <td className="skeleton h-5 w-3"></td>
                <td>
                    <div className="mask mask-squircle h-10 w-10">
                        <img
                            src={defaultImage}
                            alt="User Photo" />
                    </div>
                </td>
                <td>
                    <button className="btn skeleton w-16"></button>
                </td>
            </tr>
            <tr>
                <td className="skeleton h-5 w-3"></td>
                <td className="skeleton h-5 w-3"></td>
                <td className="skeleton h-5 w-3"></td>
                <td className="skeleton h-5 w-3"></td>
                <td className="skeleton h-5 w-3"></td>
                <td className="skeleton h-5 w-3"></td>
                <td>
                    <div className="mask mask-squircle h-10 w-10">
                        <img
                            src={defaultImage}
                            alt="User Photo" />
                    </div>
                </td>
                <td>
                    <button className="btn skeleton w-16"></button>
                </td>
            </tr>
            <tr>
                <td className="skeleton h-5 w-3"></td>
                <td className="skeleton h-5 w-3"></td>
                <td className="skeleton h-5 w-3"></td>
                <td className="skeleton h-5 w-3"></td>
                <td className="skeleton h-5 w-3"></td>
                <td className="skeleton h-5 w-3"></td>
                <td>
                    <div className="mask mask-squircle h-10 w-10">
                        <img
                            src={defaultImage}
                            alt="User Photo" />
                    </div>
                </td>
                <td>
                    <button className="btn skeleton w-16"></button>
                </td>
            </tr>

        </tbody>
    </table>
}


export const SingleUserDetailsSkeleton = () => {
    return <div className="flex flex-col sm:flex-row sm:gap-5 place-self-center">
        {/* Picture left square */}
        <div className="avatar mx-auto w-full sm:min-w-60 max-w-72 border p-2 rounded">
            <div className="rounded">
                <img src={defaultImage} />
            </div>
        </div>

        {/* Id, Name, email, Role, Department, username right */}
        <div className="overflow-x-auto w-full">
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
                            <span className="skeleton skeleton-text">fetching...</span>
                        </td>
                    </tr>

                    {/* Role */}
                    <tr className="text-lg hover:bg-base-300capitalize">
                        <th>
                            <p className="font-bold">Role:</p>
                        </th>
                        <td className="capitalize">
                            <span className="skeleton skeleton-text">fetching...</span>
                        </td>
                    </tr>

                    {/* Username */}
                    <tr className="text-lg hover:bg-base-300">
                        <th>
                            <p className="font-bold">Username:</p>
                        </th>
                        <td>
                            <span className="skeleton skeleton-text">fetching...</span>
                        </td>
                    </tr>

                    {/* Email */}
                    <tr className="text-lg hover:bg-base-300">
                        <th>
                            <p className="font-bold">Email:</p>
                        </th>
                        <td>
                            <span className="skeleton skeleton-text">fetching...</span>
                        </td>
                    </tr>

                    {/* Account Status */}
                    <tr className="text-lg hover:bg-base-300">
                        <th>
                            <p className="font-bold">Account Status:</p>
                        </th>
                        <td>
                            <button className="skeleton skeleton-text">fetching...</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
}