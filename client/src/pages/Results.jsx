import { useAuth } from '../context/AuthContext';
import StatsOverview from '../components/StatsOverview';

const Results = () => {
    const { user } = useAuth();

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold">Performance Reports</h1>
            <StatsOverview user={user} />
        </div>
    );
};

export default Results;
