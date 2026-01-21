import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import AdminDashboardCards from '../../components/ui/AdminDashboardCards.jsx';

const AdminDashboard = () => {
    const axiosSecure = useAxiosSecure();
    const { data: dashboardCounts, isPending, isError, error } = useQuery({
        queryKey: ['dashboardCounts'],
        queryFn: async () => {
            const res = await axiosSecure('/adminDashboard/allTableDataCount');
            return res?.data;
        }
    })

    console.log(dashboardCounts);

    return (
        <div>
            <div className='grid grid-cols-2 md:grid-cols-5 gap-2'>
                {
                    !isPending &&
                    Object.entries(dashboardCounts).map(([key, value]) =>
                        <AdminDashboardCards key={key} title={key} count={value} />
                    )
                }
            </div>
        </div>
    );
};

export default AdminDashboard;