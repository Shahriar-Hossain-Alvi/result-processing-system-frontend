import { useQuery } from "@tanstack/react-query";
import CreateSubject from "../../components/pageComponents/SubjectsPage/CreateSubject.jsx";
import SectionHeader from "../../utils/SectionHeader/SectionHeader.jsx";
import useAxiosSecure from "../../hooks/useAxiosSecure.jsx";


const Subjects = () => {
    const axiosSecure = useAxiosSecure();
    // Subjects query
    const { data: allSubjects, isPending: isSubjectsPending, error: subjectsError, isError: isSubjectsError, refetch: allSubjectsRefetch } = useQuery({
        queryKey: ['allSubjects'],
        queryFn: async () => {
            const res = await axiosSecure('/subjects/');
            return res.data;
        }
    })

    console.log(allSubjects);

    return (
        <div>
            <div className="flex justify-between">
                <SectionHeader section_title='Subjects' />
                <span>Subjects: {allSubjects?.length}</span>
                <CreateSubject allSubjectsRefetch={allSubjectsRefetch} />
            </div>
        </div>
    );
};

export default Subjects;