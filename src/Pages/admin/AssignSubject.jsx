import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure.jsx";
import SectionHeader from "../../utils/SectionHeader/SectionHeader.jsx";


const AssignSubject = () => {
    const axiosSecure = useAxiosSecure();

    const { data: allAssignedSubjects, isPending, error, isError, refetch } = useQuery({
        queryKey: ['allAssignedSubjects'],
        queryFn: async () => {
            const res = await axiosSecure('/subject_offering/');
            return res.data;
        }
    })

    return (
        <div>
            <div>
                <SectionHeader section_title='Assign Subject' />


            </div>
            {/* TODO: Assign Subject to Teacher */}
        </div>
    );
};

export default AssignSubject;