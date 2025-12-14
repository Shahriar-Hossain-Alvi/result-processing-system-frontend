import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth.jsx";

const Unauthorize = () => {
    const { user, logout } = useAuth();

    return (
        <div>
            <h1 className="text-2xl text-error">⚠️ Unauthorized Access!!</h1>

            <Link to="/" className="btn">Home</Link>
            <button onClick={()=>logout(true)} className="btn">Logout</button>
            <Link to="/signin" className="btn">SignIn</Link>
        </div>
    );
};

export default Unauthorize;