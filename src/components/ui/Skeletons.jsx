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