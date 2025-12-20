import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import { DepartmentsSkeleton, SemestersSkeleton } from '../../components/ui/Skeletons.jsx';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const DepartmentsAndSemesters = () => {
    const axiosSecure = useAxiosSecure();

    const { data: allDepartments, isLoading, error, isError } = useQuery({
        queryKey: ['allDepartments'],
        queryFn: async () => {
            const res = await axiosSecure('/departments');
            return res.data;
        }
    })

    const { data: totalSemesters, isLoading: isSemesterLoading, error: semesterError, isError: isSemesterError } = useQuery({
        queryKey: ['totalSemesters'],
        queryFn: async () => {
            const res = await axiosSecure('/semesters');
            return res.data;
        }
    })

    console.log(allDepartments);
    console.log(isLoading);

    return (
        <div>
            {/* DEPARTMENTS */}
            <div>
                <h1 className='text-3xl font-bold'>Departments</h1>

                {isLoading && <DepartmentsSkeleton />}
                {
                    allDepartments?.length === 0 ?
                        <h4 className='text-error text-center text-lg'>No departments found</h4>
                        :
                        <div className="overflow-x-auto">
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Department Name</th>
                                        <th>Department ID</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* rows */}
                                    {
                                        allDepartments?.map((department, index) =>
                                            <tr key={department?.id}>
                                                <th>{index + 1}</th>
                                                <td>{department?.department_name}</td>
                                                <td>{department?.id}</td>
                                                <td>
                                                    <button className="btn btn-ghost hover:bg-transparent border-0 group/edit-dept">
                                                        <FaEdit className='group-hover/edit-dept:text-success' />
                                                    </button>
                                                    <button className="btn btn-ghost hover:bg-transparent border-0  group/delete-dept">
                                                        <MdDelete className='group-hover/delete-dept:text-red-700 text-lg' />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    }

                                </tbody>
                            </table>
                        </div>
                }
            </div>


            {/* SEMESTERS */}
            <div className='mt-10'>
                <h1 className='text-3xl font-bold'>Semesters</h1>

                {isSemesterLoading && <SemestersSkeleton />}
                {
                    totalSemesters?.length === 0 ?
                        <h4 className='text-error text-center text-lg'>No semesters found</h4>
                        :
                        <div className="overflow-x-auto">
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Semester Name</th>
                                        <th>Semester Number</th>
                                        <th>Semester ID</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* rows */}
                                    {
                                        totalSemesters?.map((semester, index) =>
                                            <tr key={semester?.id}>
                                                <th>{index + 1}</th>
                                                <td>{semester?.semester_name}</td>
                                                <td>{semester?.semester_number}</td>
                                                <td>{semester?.id}</td>
                                                <td>
                                                    <button className="btn btn-ghost hover:bg-transparent border-0 group/edit-semester">
                                                        <FaEdit className='group-hover/edit-semester:text-success' />
                                                    </button>
                                                    <button className="btn btn-ghost hover:bg-transparent border-0  group/delete-semester">
                                                        <MdDelete className='group-hover/delete-semester:text-red-700 text-lg' />
                                                    </button>
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

export default DepartmentsAndSemesters;