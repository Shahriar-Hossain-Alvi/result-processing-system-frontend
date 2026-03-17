import React, { useEffect, useState } from 'react';
import SectionHeader from '../../utils/SectionHeader/SectionHeader.jsx';
import { useDebounce } from '../../hooks/useDebounce.jsx';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import errorMessageParser from '../../utils/errorMessageParser/errorMessageParser.js';
import { toast } from 'react-hot-toast';
import useTheme from '../../hooks/useTheme.jsx';
import { BsFiletypePdf } from 'react-icons/bs';

const Results = () => {
    const [theme] = useTheme();
    const axiosSecure = useAxiosSecure();

    const gpa_with_color = {
        4.0: 'text-emerald-600',
        3.75: 'text-green-600',
        3.5: 'text-teal-600',
        3.25: 'text-cyan-600',
        3.0: 'text-sky-600',
        2.75: 'text-blue-600',
        2.5: 'text-yellow-600',
        2.25: 'text-amber-600',
        2.0: 'text-orange-600',
        0.0: 'text-red-600',
    }

    // Fetch departments
    const { data: allDepartments, isPending: isAllDepartmentsPending, error: allDepartmentsError, isError: isAllDepartmentsError, refetch: allDepartmentsRefetch } = useQuery({
        queryKey: ['allDepartments'],
        queryFn: async () => {
            const res = await axiosSecure('/departments/');
            return res.data;
        }
    })

    useEffect(() => {
        if (isAllDepartmentsError) {
            console.log(allDepartmentsError);
            const message = errorMessageParser(allDepartmentsError);
            toast.error(message || "Failed to fetch departments");
        }
    }, [isAllDepartmentsError])

    // Fetch SEMESTERS
    const { data: allSemesters, isPending: isSemesterPending, error: semesterError, isError: isSemesterError, refetch: totalSemestersRefetch } = useQuery({
        queryKey: ['totalSemesters'],
        queryFn: async () => {
            const res = await axiosSecure('/semesters/');
            return res.data;
        }
    })

    useEffect(() => {
        if (isSemesterError) {
            console.log(semesterError);
            const message = errorMessageParser(semesterError);
            toast.error(message || "Failed to fetch semesters");
        }
    }, [isSemesterError])

    // Filter
    const [filters, setFilters] = useState({
        search: "",
        department_id: "",
        semester_id: ""
    });

    // debounce the search string by 500ms(wait 500ms before making the request send after user stop typing)
    const debouncedSearch = useDebounce(filters.search, 500);

    // Fetch Results
    const { data: singleSearchedResult, isPending: isSingleSearchedResultPending, error: singleSearchedResultError, isError: isSingleSearchedResultError, refetch: singleSearchedResultRefetch } = useQuery({
        queryKey: ['singleSearchedResult', filters.department_id, filters.semester_id, debouncedSearch],
        queryFn: async () => {
            const params = new URLSearchParams();

            if (filters.department_id) params.append('department_id', filters.department_id);
            if (filters.semester_id) params.append('semester_id', filters.semester_id);

            // Use the debounced value for the API call
            if (debouncedSearch) params.append('registration', debouncedSearch);

            if (debouncedSearch === "" || filters.department_id === "" || filters.semester_id === "") return [];

            const res = await axiosSecure(`/marks/results?${params.toString()}`);
            return res.data;
        },
        enabled: !!filters.department_id && !!filters.semester_id && debouncedSearch.length > 2
    })

    // Handler to update filters
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (isSingleSearchedResultError) {
            console.log(singleSearchedResultError);
            const message = errorMessageParser(singleSearchedResultError);
            toast.error(message || "Failed to fetch result");
        }
    }, [isSingleSearchedResultPending])

    const downloadPdf = (base64String, fileName) => {
        const linkSource = `data:application/pdf;base64,${base64String}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    };

    return (
        <div className='bg-base-100 p-4 rounded-xl min-h-dvh'>
            <SectionHeader section_title="Results" />

            <h2>Use your Registration number, Semester and Department to get your results</h2>

            <div>
                {/* 3. Filter UI Section */}
                <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-6">
                    {/* Department Select */}
                    <div className="form-control md:col-span-3">
                        <label className="label">Department</label>
                        <select
                            name="department_id"
                            className="select w-full uppercase"
                            value={filters.department_id}
                            onChange={handleFilterChange}
                        >
                            <option value="">All</option>
                            {allDepartments?.map(department => (
                                <option key={department.id} value={department.id}>{department.department_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Semester Select */}
                    <div className="form-control md:col-span-2">
                        <label className="label">Semester</label>
                        <select
                            name="semester_id"
                            className="select w-full uppercase"
                            value={filters.semester_id}
                            onChange={handleFilterChange}
                        >
                            <option value="">All</option>
                            {allSemesters?.map(semester => (
                                <option key={semester.id} value={semester.id}>{semester.semester_number}</option>
                            ))}
                        </select>
                    </div>


                    {/* Search by Registration */}
                    <div className="form-control md:col-span-2">
                        <label className="label">Registration</label>
                        <input
                            type="text"
                            name="search"
                            placeholder="registration.."
                            className="input input-bordered w-full"
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                    </div>

                    {/* Reset Button */}
                    <div className="md:col-span-1 md:place-self-center md:mt-5">
                        <button
                            className={`btn btn-error text-sm ${theme == "light" ? "text-white" : "text-black"}`}
                            onClick={() => {
                                setFilters({
                                    search: "",
                                    department_id: "",
                                    semester_id: "",
                                })
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>


                {/* show the result */}
                <div>
                    {/* If all the filters are not selected */}
                    {(!filters.department_id || !filters.semester_id || debouncedSearch.length <= 2) && (
                        <div className="text-center py-10 text-warning opacity-70">
                            Please select Department, Semester, and enter Registration to view results.
                        </div>
                    )}

                    {/* Data display */}
                    {singleSearchedResult && (
                        <div className="results-container">
                            <h2 className='text-center text-lg text-error'>{singleSearchedResult?.message}</h2>

                            {/* student info */}
                            <div className='text-center'>
                                <h2 className='uppercase text-lg font-semibold'>{singleSearchedResult?.department_info?.department_name}</h2>
                                <h2 className='capitalize text-lg font-medium'>{singleSearchedResult?.semester_info?.semester_name} semester (Session: {singleSearchedResult?.student_info?.session})</h2>

                                <h2 className='mt-10 mb-5 font-medium text-xl underline'>Result Sheet</h2>

                                <div className='border w-5/6 max-w-3xl text-left mx-auto rounded-lg p-1 space-y-1'>
                                    <h2 className='grid grid-cols-3'>
                                        <span className='border-r'>Student Name</span>
                                        <span className='col-span-2 pl-2'>{singleSearchedResult?.student_info?.name}</span>
                                    </h2>

                                    <h2 className='border-y grid grid-cols-3'>
                                        <span className='border-r'>Registration No.</span>
                                        <span className='col-span-2 pl-2'>{singleSearchedResult?.student_info?.registration}</span>
                                    </h2>

                                    <h2 className='grid grid-cols-3'>
                                        <span className='border-r'>Session</span>
                                        <span className='col-span-2 pl-2'>{singleSearchedResult?.student_info?.session}</span>
                                    </h2>

                                    <h2 className='border-y grid grid-cols-3'>
                                        <span className='border-r'>Semester</span>
                                        <span className='col-span-2 pl-2'>{singleSearchedResult?.semester_info?.semester_number}</span>
                                    </h2>

                                    <h2 className='grid grid-cols-3'>
                                        <span className='border-r'>Department</span>
                                        <span className='col-span-2 pl-2'>{singleSearchedResult?.department_info?.department_name}</span>
                                    </h2>

                                </div>
                            </div>


                            {/* Result */}
                            <div className="overflow-x-auto mt-5 max-w-6xl mx-auto">
                                <table className="table">
                                    {/* head */}
                                    <thead className='text-center'>
                                        <tr>
                                            <th>#</th>
                                            <th className='text-left'>Subject</th>
                                            <th className='text-left'>Code</th>
                                            <th>Credits</th>
                                            <th>Assignment</th>
                                            <th>CT</th>
                                            <th>Mid</th>
                                            <th>Final</th>
                                            <th>GPA</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-center'>
                                        {singleSearchedResult?.result?.map((r, index) => (
                                            <tr key={r.id}>
                                                <th>{index + 1}</th>
                                                <td className='text-left'>{r?.subject?.subject_title}</td>
                                                <td className='text-left'>{r?.subject?.subject_code}</td>
                                                <td>{r?.subject?.credits}</td>
                                                <td>{r?.assignment_mark}</td>
                                                <td>{r?.class_test_mark}</td>
                                                <td>{r?.midterm_mark}</td>
                                                <td>{r?.final_exam_mark}</td>
                                                <td className={`${gpa_with_color[r?.GPA]}`}>{r?.GPA}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className='text-center mt-4'>
                                <button
                                    onClick={() => downloadPdf(singleSearchedResult?.pdf_base64, singleSearchedResult?.student_info?.name)}
                                    className='btn btn-success btn-wide'>Download <BsFiletypePdf className='text-lg' /></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Results;