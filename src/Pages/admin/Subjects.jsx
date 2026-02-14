import { useQuery } from "@tanstack/react-query";
import CreateSubject from "../../components/pageComponents/SubjectsPage/CreateSubject.jsx";
import SectionHeader from "../../utils/SectionHeader/SectionHeader.jsx";
import useAxiosSecure from "../../hooks/useAxiosSecure.jsx";
import { useEffect, useState } from "react";
import errorMessageParser from "../../utils/errorMessageParser/errorMessageParser.js";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useAuth from "../../hooks/useAuth.jsx";
import { useForm } from "react-hook-form";
import { useDebounce } from "../../hooks/useDebounce.jsx";
import useTheme from "../../hooks/useTheme.jsx";


const Subjects = () => {
    const [theme] = useTheme();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [selectedSubject, setSelectedSubject] = useState(null); // state for editing
    const [isFormLoading, setIsFormLoading] = useState(false);

    // Filter
    const [filters, setFilters] = useState({
        semester_id: "",
        subject_credits: "",
        search: "",
        sub_order_by_filter: localStorage.getItem("sub_order_by_filter") || ""
    });

    // debounce the search string by 500ms(wait 500ms before making the request send after user stop typing)
    const debouncedSearch = useDebounce(filters.search, 500);

    // Subjects query
    const { data: allSubjects, isPending: isSubjectsPending, error: subjectsError, isError: isSubjectsError, refetch: allSubjectsRefetch } = useQuery({
        queryKey: ['allSubjects', filters.semester_id, filters.subject_credits, filters.sub_order_by_filter, debouncedSearch],
        queryFn: async () => {
            const params = new URLSearchParams();

            if (filters.semester_id) params.append('semester_id', filters.semester_id);
            if (filters.subject_credits) params.append('subject_credits', filters.subject_credits);
            if (filters.sub_order_by_filter) params.append('order_by_filter', filters.sub_order_by_filter);

            // Use the debounced value for the API call
            if (debouncedSearch) params.append('search', debouncedSearch);

            const res = await axiosSecure(`/subjects/?${params.toString()}`);
            return res.data;
        }
    })

    // SEMESTERS query to update subjects semester
    const { data: allSemesters, isPending: isSemesterPending, error: semesterError, isError: isSemesterError, refetch: totalSemestersRefetch } = useQuery({
        queryKey: ['totalSemesters'],
        queryFn: async () => {
            const res = await axiosSecure('/semesters/');
            return res.data;
        }
    })

    useEffect(() => {
        if (isSubjectsError) {
            console.log(subjectsError);
            const message = errorMessageParser(subjectsError);
            toast.error(message || "Failed to fetch subjects");
        }
    }, [isSubjectsError])

    useEffect(() => {
        if (isSemesterError) {
            console.log(semesterError);
            const message = errorMessageParser(semesterError);
            toast.error(message || "Failed to fetch semesters");
        }
    }, [isSubjectsError])

    // Handler to update filters
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // open update subject modal
    const openUpdateSubjectModal = (sub) => {
        setSelectedSubject(sub);
        reset({
            updatedSubjectTitle: sub.subject_title,
            updatedSubjectCode: sub.subject_code,
            updatedSubjectCredits: sub.credits,
            updatedSemester: sub.semester_id,
            updatedIsGeneral: sub.is_general ? "yes" : "no"
        }); // This fills the form
        // @ts-ignore
        document.getElementById('update_subject_modal').showModal();
    }

    // update subject
    const updateSubject = async (data) => {
        const updated_data = {};

        if (data.updatedSubjectTitle && data.updatedSubjectTitle !== selectedSubject.subject_title) updated_data.subject_title = data.updatedSubjectTitle;

        if (data.updatedSubjectCode && data.updatedSubjectCode !== selectedSubject.subject_code) updated_data.subject_code = data.updatedSubjectCode;

        if (data.updatedSubjectCredits && parseFloat(data.updatedSubjectCredits) !== selectedSubject.credits) updated_data.credits = parseFloat(data.updatedSubjectCredits);

        if (data.updatedSemester && parseInt(data.updatedSemester) !== selectedSubject.semester_id) updated_data.semester_id = parseInt(data.updatedSemester);

        if (data.updatedIsGeneral && data.updatedIsGeneral !== (selectedSubject.is_general ? "yes" : "no")) updated_data.is_general = data.updatedIsGeneral === "yes";

        if (Object.keys(updated_data).length === 0) {
            // @ts-ignore
            document.getElementById('update_subject_modal').close();
            return toast.error('No data to update')
        };

        console.log(updated_data);
        const subject_id = selectedSubject.id;
        try {
            setIsFormLoading(true);
            const res = await axiosSecure.patch(`/subjects/${subject_id}`, updated_data);
            console.log(res);
            // @ts-ignore
            document.getElementById('update_subject_modal').close();
            allSubjectsRefetch();
            totalSemestersRefetch();
            // @ts-ignore
            toast.success(res?.data?.message);
        } catch (error) {
            console.log(error);
            // @ts-ignore
            document.getElementById('update_subject_modal').close();
            const message = errorMessageParser(error);
            toast.error(message || 'Failed to update subject');
        } finally {
            setIsFormLoading(false);
            reset();
        }
    }


    // const Delete Subject
    const deleteSubject = async (id) => {
        try {
            setIsFormLoading(true);
            const res = await axiosSecure.delete(`/subjects/${id}`);
            console.log(res);
            // @ts-ignore
            document.getElementById('delete_subject_modal').close();
            allSubjectsRefetch();
            // @ts-ignore
            toast.success(res?.data?.message);
        } catch (error) {
            console.log(error);
            // @ts-ignore
            document.getElementById('delete_subject_modal').close();
            const message = errorMessageParser(error);
            toast.error(message || 'Failed to delete subject');
        } finally {
            setIsFormLoading(false);
        }
    }

    return (
        <div className="bg-base-100 p-4 rounded-xl">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                    <SectionHeader section_title='Subjects' />
                    <span>({allSubjects?.length})</span>
                </div>

                <CreateSubject allSubjectsRefetch={allSubjectsRefetch} />
            </div>

            {/* 3. Filter UI Section */}
            <div className="grid grid-cols-1 md:grid-cols-10 gap-4 mb-6">

                {/* Semester Select */}
                <div className="form-control md:col-span-1">
                    <label className="label">Semester</label>
                    <select
                        name="semester_id"
                        className="select"
                        value={filters.semester_id}
                        onChange={handleFilterChange}
                    >
                        <option value="">All</option>
                        {allSemesters?.map(semester => (
                            <option key={semester.id} value={semester.id}>Semester {semester.semester_number}</option>
                        ))}
                    </select>
                </div>

                {/* Order by */}
                <div className="md:col-span-1">
                    <label className="label">Order By: </label>
                    <select
                        name='sub_order_by_filter'
                        className='select'
                        value={filters.sub_order_by_filter}
                        onChange={(e) => {
                            handleFilterChange(e);
                            localStorage.setItem("sub_order_by_filter", e.target.value);
                        }}
                    >
                        <option value="asc">ASC ⬇️</option>
                        <option value="desc">DESC ⬆️</option>
                    </select>
                </div>

                {/* Credits Input (Searchable Number) */}
                <div className="form-control md:col-span-3">
                    <label className="label">Credits (e.g. 1.5, 3.0)</label>
                    <input
                        type="number"
                        step="0.5"
                        min={0}
                        name="subject_credits"
                        placeholder="Search by subject credits"
                        className="input input-bordered"
                        value={filters.subject_credits}
                        onChange={handleFilterChange}
                    />
                </div>

                {/* Search Title/Code */}
                <div className="form-control md:col-span-4">
                    <label className="label">Search Title or Code</label>
                    <input
                        type="text"
                        name="search"
                        placeholder="Math, CSE-101..."
                        className="input input-bordered w-full"
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                </div>

                {/* Reset Button */}
                <div className="md:col-span-1 md:place-self-center md:mt-5">
                    <button
                        className={`btn btn-error text-sm ${theme === "light" ? "text-white" : "text-black"}`}
                        onClick={() => {
                            setFilters({ semester_id: "", subject_credits: "", search: "", sub_order_by_filter: "" })
                            localStorage.removeItem("sub_order_by_filter");
                        }}
                    >
                        Clear Filters
                    </button>
                </div>
            </div>



            {/* Show All Subjects List */}
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>Sub ID</th>
                            <th>Title</th>
                            <th>Subject Code</th>
                            <th>Credits</th>
                            <th>Taught in</th>
                            <th>Is General <br /> Subject?</th>
                            <th>Created/updated At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            allSubjects?.length > 0 && allSubjects.map((subject) =>
                                <tr key={subject.id}>
                                    <th>{subject.id}</th>
                                    <td className="capitalize">{subject.subject_title}</td>
                                    <td>{subject.subject_code}</td>
                                    <td>{subject.credits}</td>
                                    <td className="capitalize">{subject.semester.semester_name} Semester</td>
                                    <td>{subject.is_general ? 'Yes' : 'No'}</td>
                                    <td>C: {subject.created_at?.split('T')[0]} <br />
                                        U: {subject.updated_at?.split('T')[0]}
                                    </td>
                                    <td>
                                        {/* update subject Modal trigger */}
                                        <button
                                            onClick={() => openUpdateSubjectModal(subject)}
                                            className="btn btn-ghost bg-transparent border-0 shadow-none btn-primary hover:bg-primary hover:text-white">
                                            <FaEdit />
                                        </button>


                                        {/* Delete subject confirmation Modal */}
                                        {
                                            user?.role === "super_admin" &&
                                            <div>
                                                <button className="btn btn-ghost bg-transparent border-0 shadow-none btn-error hover:bg-error hover:text-white"
                                                    onClick={() => {
                                                        setSelectedSubject(subject);
                                                        document.getElementById('delete_subject_modal').
                                                            // @ts-ignore
                                                            showModal()
                                                    }}
                                                >
                                                    <MdDelete className='text-lg' />
                                                </button>
                                            </div>}
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>

            {/* MODALS */}
            {/* Update subject modal */}
            <dialog id="update_subject_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-warning">Edit Subject</h3>

                    <form className='space-y-4 mt-4' onSubmit={handleSubmit(updateSubject)}>
                        {/* update subject title */}
                        <div className="w-full">
                            <label>Subject Title</label>
                            <input
                                type="text"
                                className="input input-bordered w-full mt-2"
                                {...register("updatedSubjectTitle")}
                            />
                        </div>

                        {/* update subject code */}
                        <div className="w-full">
                            <label>Subject Code</label>
                            <p className='text-xs text-warning'>Format: Letter(3 to 5)-Number(3 to 6) EG: CSE-123, SWE-123456</p>
                            <input
                                type="text"
                                className="input input-bordered w-full mt-2"
                                {...register("updatedSubjectCode")}
                            />
                        </div>

                        {/* update subject code */}
                        <div className="w-full">
                            <label>Subject Credits</label>
                            <p className='text-xs text-warning'>Format: 3.0, 1.5 (Floating value)</p>
                            <input
                                type="text"
                                className="input input-bordered w-full mt-2"
                                {...register("updatedSubjectCredits")}
                            />
                        </div>

                        {/* update subject taught in semester */}
                        <div>
                            <label className="label block">Semester</label>
                            {isSemesterPending && <input disabled placeholder='Loading...' />}
                            {
                                !isSemesterPending && <select className="select w-full"
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

                        {/* update subject is general */}
                        <div>
                            <label className="label block">Is General Subject?</label>

                            <select className="select w-full"
                                {...register("updatedIsGeneral")}
                            >
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>

                        <button className={`btn ${isFormLoading && "btn-disabled"} btn-success w-full`} type='submit' disabled={isFormLoading}>
                            {isFormLoading ? <AiOutlineLoading3Quarters className='animate-spin' /> : "Update"}
                        </button>
                    </form>
                    <div className="modal-action">
                        <form method="dialog"><button className="btn btn-error">Cancel</button></form>
                    </div>
                </div>
            </dialog>


            {/* delete subject modal */}
            <dialog id="delete_subject_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-error uppercase">Be Careful!!!</h3>
                    <p className="py-4">Are you sure you want to delete "{selectedSubject?.subject_title.toUpperCase()}" subject?</p>
                    <p className='text-warning'>The subject is connected with other data such as department, Teachers, Students etc. Deleting it may create errors and failures in the system!!! Try Editing instead</p>
                    <div className="modal-action">
                        <button onClick={() => deleteSubject(selectedSubject?.id)} className={`btn ${isFormLoading ? "btn-disabled" : "btn-error"}`} >
                            {isFormLoading ? <AiOutlineLoading3Quarters className='animate-spin' /> : "Yes, delete it"}
                        </button>
                        <form method="dialog"
                        >
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>


        </div>
    );
};

export default Subjects;