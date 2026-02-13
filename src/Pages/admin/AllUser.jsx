import { useEffect, useState } from 'react';
import SectionHeader from '../../utils/SectionHeader/SectionHeader.jsx';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import { AllUserTableSkeleton } from '../../components/ui/Skeletons.jsx';
import errorMessageParser from '../../utils/errorMessageParser/errorMessageParser.js';
import { Link } from 'react-router-dom';
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { useDebounce } from '../../hooks/useDebounce.jsx';

const AllUser = () => {
    const axiosSecure = useAxiosSecure();
    const [filters, setFilters] = useState({
        user_role_filter: localStorage.getItem("user_role_filter") || "",
        department_search: "",
        user_order_by_filter: localStorage.getItem("user_order_by_filter") || ""
    });

    // debounce the search string by 500ms(wait 500ms before making the request send after user stop typing)
    const debouncedSearch = useDebounce(filters.department_search, 500);

    const { data: allUser, isError: isAllUserError, isPending: isAllUserPending, error: allUserError } = useQuery({
        queryKey: ['allUser', filters.user_role_filter, filters.user_order_by_filter, debouncedSearch],
        queryFn: async () => {
            const params = new URLSearchParams();

            if (filters.user_role_filter) params.append('user_role', filters.user_role_filter);
            if (filters.user_order_by_filter) params.append('order_by_filter', filters.user_order_by_filter);

            // Use the debounced value for the API call
            if (debouncedSearch) params.append('department_search', debouncedSearch);

            const res = await axiosSecure(`/users/?${params.toString()}`);
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

    console.log(allUser);

    // Handler to update filters
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <div className='w-[95%] my-5 bg-white p-4 mx-auto rounded-xl'>
                <div className='flex items-center gap-1'>
                    <SectionHeader section_title='All User' />
                    <span className='font-bold text-xl'>({allUser?.length})</span>
                </div>
                {/* FIXME: remove the overflow-y-clip if it causes any issue scrolling issue for many rows */}

                {/* 3. Filter UI Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 p-4 rounded-lg">

                    {/* Role Filter */}
                    <div className='md:col-span-2'>
                        <label className="label">Filter by Role: </label>
                        <select
                            name='user_role_filter'
                            className='select'
                            value={filters.user_role_filter}
                            onChange={(e) => {
                                handleFilterChange(e);
                                localStorage.setItem("user_role_filter", e.target.value);
                            }}
                        >
                            <option value="">All</option>
                            <option value="super_admin">🧑‍💻 Super Admin</option>
                            <option value="admin">🧑‍💼 Admin</option>
                            <option value="student">🧑‍🎓 Student</option>
                            <option value="teacher">🧑‍🏫 Teacher</option>
                        </select>
                    </div>

                    {/* Order by */}
                    <div className="md:col-span-2">
                        <label className="label">Order By: </label>
                        <select
                            name='user_order_by_filter'
                            className='select'
                            value={filters.user_order_by_filter}
                            onChange={(e) => {
                                handleFilterChange(e);
                                localStorage.setItem("user_order_by_filter", e.target.value);
                            }}
                        >
                            <option value="asc">ASC ⬇️</option>
                            <option value="desc">DESC ⬆️</option>
                        </select>
                    </div>

                    {/* Search Title/Code */}
                    <div className="form-control md:col-span-6">
                        <label className="label">Search by Department</label>
                        <input
                            type="text"
                            name="department_search"
                            placeholder="CSE, EEE, etc..."
                            className="input input-bordered w-full"
                            value={filters.department_search}
                            onChange={handleFilterChange}
                        />
                    </div>

                    {/* Reset Button */}
                    <div className="md:col-span-2 md:place-self-center md:mt-5">
                        <button
                            className="btn btn-error text-sm text-white"
                            onClick={() => {
                                setFilters({ user_role_filter: "", department_search: "", user_order_by_filter: "" })
                                localStorage.removeItem("user_role_filter");
                                localStorage.removeItem("order_by_filter");
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>



                {/* All User Table */}
                {
                    isAllUserPending ?
                        <AllUserTableSkeleton />
                        :
                        <div className="overflow-x-auto overflow-y-clip">
                            <table className="table table-xs md:table-md">
                                {/* head */}
                                <thead className='bg-base-200'>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Role</th>
                                        <th>Username/Email</th>
                                        <th>Mobile</th>
                                        <th>Department</th>
                                        <th>Details</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        allUser?.length > 0 && allUser.map((user) =>
                                            <tr className="hover:bg-base-300" key={user.id}>
                                                <td>{user.id}</td>

                                                {/* Name */}
                                                <td>
                                                    {user.role === "student" && user?.student?.name}
                                                    {user.role === "teacher" && user?.teacher?.name}
                                                </td>

                                                <td><span className={`badge badge-sm badge-soft ${(user?.role === "admin" || user?.role === "super_admin") && "badge-warning"} ${user?.role === "student" && "badge-info"} ${user?.role === "teacher" && "badge-secondary"}`}>{user.role}</span></td>


                                                {/* username/email */}
                                                <td className='overflow-x-auto max-w-48'>{user.username}</td>

                                                {/* Mobile */}
                                                <td>{user.mobile_number || <span className='text-error'>N/A</span>}</td>

                                                {/* Department */}
                                                <td className='uppercase max-w-44 xl:max-w-full'>
                                                    {user.role === "student" && ((user?.student?.department) ? user?.student?.department?.department_name : <p className='text-error'>N/A</p>)}

                                                    {user.role === "teacher" && ((user?.teacher?.department) ? user?.teacher?.department?.department_name : <p className='text-error'>N/A</p>)}
                                                </td>

                                                {/* Account Status */}
                                                <td>{user.is_active ?
                                                    <button className="badge badge-sm badge-soft badge-success font-medium">Active</button>
                                                    : <button className="badge badge-sm badge-soft badge-error font-medium">Inactive</button>}
                                                </td>

                                                {/* details */}
                                                <td>
                                                    {
                                                        (user?.role !== "admin" && user?.role !== "super_admin") &&
                                                        <Link
                                                            to={`/admin/user/${user.id}`}
                                                            state={{ userData: user }} // pass the user data to the user details page
                                                            className="link link-primary link-hover"
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
        </div>
    );
};

export default AllUser;