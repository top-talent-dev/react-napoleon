import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import AuthContext from '../../context/AuthProvider';

const ConfirmLogoutDialog = (param) => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async (event) => {
        window.loggedInUserType = null;
        setAuth({});
        window.sessionStorage.clear();
        navigate('/');
    }

    return (
        <div className="modal" tabIndex="-1" id="confirmDialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">{param.title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>{param.message}</p>
                    </div>
                    <div className="modal-footer">
                        {/* <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button> */}
                        <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ConfirmLogoutDialog