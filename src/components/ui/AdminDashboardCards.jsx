

const AdminDashboardCards = ({ title, count }) => {
    return (
        <div className="card card-border bg-base-100 card-sm shadow-sm">
            <div className="card-body justify-between">
                <h2 className="card-title capitalize">{title}</h2>
                <h4 className='text-2xl'>{count}</h4>
            </div>
        </div>
    );
};

export default AdminDashboardCards;