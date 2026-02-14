import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import AdminDashboardCards from '../../components/ui/AdminDashboardCards.jsx';
import SectionHeader from '../../utils/SectionHeader/SectionHeader.jsx';

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
        <div className='min-h-screen'>
            <SectionHeader section_title="Admin Dashboard" />

            <div className='grid grid-cols-2 md:grid-cols-5 gap-2'>
                {
                    !isPending &&
                    Object.entries(dashboardCounts).map(([key, value]) =>
                        <AdminDashboardCards key={key} title={key} count={value} />
                    )
                }
            </div>

            {/* Future features */}
            {/* 
                Audit Log Summary: Today's Total Audit logs
                in which method/category most error(Critical Errors) happened
                User Status: * Active vs Inactive student/teacher (Pie Chart)।
                Recent Activities: last 5 audit logs in a table/list
                Course Distribution: department wise subject count (Bar Chart)।
            */}
        </div>
    );
};

export default AdminDashboard;