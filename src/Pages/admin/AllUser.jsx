import { useEffect, useState } from 'react';
import SectionHeader from '../../utils/SectionHeader/SectionHeader.jsx';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import { AllUserTableSkeleton } from '../../components/ui/Skeletons.jsx';
import errorMessageParser from '../../utils/errorMessageParser/errorMessageParser.js';
// @ts-ignore
import defaultImage from "../../assets/blank-profile-picture.png";
import { Link } from 'react-router-dom';

const AllUser = () => {
    const axiosSecure = useAxiosSecure();
    const [allUserFilter, setAllUserFilter] = useState(localStorage.getItem("allUserFilter") || "");

    const { data: allUser, isError: isAllUserError, isFetching: isAllUserFetching, error: allUserError } = useQuery({
        queryKey: ['allUser', allUserFilter],
        queryFn: async () => {
            const res = await axiosSecure(`/users/?user_role=${allUserFilter}`);
            return res.data;
        }
    })

    useEffect(() => {
        if (isAllUserError) {
            console.log(allUserError);
            // @ts-ignore
            const message = errorMessageParser(error);
            toast.error(message || "Failed to fetch users. Please try again.");
        }
    }, [isAllUserError])

    console.log(isAllUserFetching);

    return (
        <div>
            <SectionHeader section_title='All User' />
            {/* FIXME: remove the overflow-y-clip if it causes any issue scrolling issue for many rows */}

            {/* All User Table */}
            <div className='flex items-center gap-2'>
                <h4 className="">Filter by Role: </h4>
                <select className='select' value={allUserFilter} onChange={(e) => {
                    localStorage.setItem("allUserFilter", e.target.value); setAllUserFilter(e.target.value)
                }}>
                    <option value="">All</option>
                    <option value="admin">Admin</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
            </div>
            {
                isAllUserFetching ?
                    <AllUserTableSkeleton />
                    :
                    <div className="overflow-x-auto overflow-y-clip">
                        <table className="table table-xs md:table-md">
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
                                {
                                    allUser?.length > 0 && allUser.map((user, index) =>
                                        <tr className="hover:bg-base-300" key={user.id}>
                                            <td>{index + 1}</td>
                                            <td>{user.username}</td>
                                            <td>{user.role}</td>
                                            {/* Account Status */}
                                            <td>{user.is_active ?
                                                <button className="badge badge-sm badge-success font-medium">Active</button>
                                                : <button className="badge badge-sm badge-error font-medium">Inactive</button>}
                                            </td>

                                            {/* Name */}
                                            <td>
                                                {user.role === "student" && user?.student?.name}
                                                {user.role === "teacher" && user?.teacher?.name}
                                            </td>

                                            {/* Department */}
                                            <td className='uppercase'>
                                                {user.role === "student" && ((user?.student?.department) ? user?.student?.department?.department_name : <p className='text-error'>Not Assigned</p>)}

                                                {user.role === "teacher" && ((user?.teacher?.department) ? user?.teacher?.department?.department_name : <p className='text-error'>Not Assigned</p>)}
                                            </td>
                                            <td>
                                                {user.role === "student" &&
                                                    <div className="mask mask-squircle h-10 w-10">
                                                        <img
                                                            src={user?.student?.photo_url || defaultImage}
                                                            alt="User Photo" />
                                                    </div>
                                                }
                                                {user.role === "teacher" &&
                                                    <div className="mask mask-squircle h-10 w-10">
                                                        <img
                                                            src={user?.teacher?.photo_url || defaultImage}
                                                            alt="User Photo" />
                                                    </div>
                                                }
                                            </td>
                                            <td>
                                                {
                                                    user?.role !== "admin" &&
                                                    <Link
                                                        to={`/admin/user/${user.id}`}
                                                        state={{ userData: user }} // pass the user data to the user details page
                                                        className="btn btn-info btn-xs"
                                                    >Details
                                                    </Link>}
                                            </td>
                                        </tr>
                                    )
                                }

                            </tbody>
                        </table>
                    </div>
            }
        </div>
    );
};

export default AllUser;