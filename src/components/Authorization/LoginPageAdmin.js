import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';
import * as Helper from '../../utility/Helper';
import MessageDialog from '../General/MessageDialog';

const LOGIN_URL = '/auth/login';

const LoginPageAdmin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setAuth } = useAuth();
    const userRef = useRef();
    const errRef = useRef();

    const userRole = location?.state?.userRole;
    // const searchParams = new URLSearchParams(location?.search)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertMessage, setAlertMessage] = useState(Helper.formatAppMessage('Error occured! Try again.'));

    /** 
     * START - LOGIN SECTIPN 
     * */
    useEffect(() => {
        userRef.current.focus();
    }, []);

    const handleValidation = async (event) => {
        let formError = Helper.LoginPageValidation(email, password);
        if (formError.isError) {
            setAlertMessage(Helper.formatAppMessage(formError.msg));
            Helper.openAppMessageDialog();
        } else {
            try {
                const response = await axios.post(LOGIN_URL,
                    JSON.stringify({ email, password }),
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: false
                    }
                );
                console.log(JSON.stringify(response?.data));
                const loginStatus = response?.data?.status;
                const loginSuccess = response?.data?.success;
                const accessToken = response?.data?.token;
                const refreshToken = response?.data?.refreshToken;
                const roles = [response?.data?.data?.role];

                if (loginSuccess) {
                    setAuth({ email, password, roles, accessToken, refreshToken });
                    if (roles[0] === 'admin') {
                        window.sessionStorage.setItem('loggedInUserDetails', JSON.stringify(response?.data?.data));
                        document.body.style.backgroundImage = 'none';
                        navigate('/Admin/Dashboard');
                    } else {
                        setAlertMessage(Helper.formatAppMessage('This email is not configured as Napoleone Admin.'));
                        Helper.openAppMessageDialog();
                    }
                }
            } catch (err) {
                setAlertMessage(Helper.formatAppMessage(Helper.HandleSrviceCallError(err, 'LOGIN')));
                Helper.openAppMessageDialog();
            }
        }
    }

    return (
        <>
            <MessageDialog msg={alertMessage} />
            <div className='container-fluid'>
                <div className='row CenterContentRow' style={{ minWidth: '35%' }}>
                    <div className='col-md-8 fw-bolder loginTitleTextBlack'>
                        Login for Napoleon <br /> administrative works...
                    </div>
                    <div className='col-md-4' style={{ backgroundColor: 'white', borderRadius: '15%' }}>
                        {/* Signin Section */}
                        <div className='ms-auto me-auto sectionPadding'>
                            <form id="frmLogin" className="needs-validation pt-4" noValidate>
                                <div className='mb-3'>
                                    <label htmlFor='txtUsername' className='form-label fs-5 fw-lighter'>Username / Email</label>
                                    <input type='text' name='email' className='form-control fs-5 fw-lighter FormInputGold' id='txtUsername' ref={userRef} placeholder='Enter email' onChange={(e) => setEmail(e.target.value)} value={email} required />
                                </div>
                                <div className='mb-3 mt-4'>
                                    <label htmlFor='txtCandidatePassword' className='form-label fs-5 fw-lighter'>Password</label>
                                    <input type='password' name='password' className='form-control s-5 fw-lighter FormInputGold' id='txtCandidatePassword' placeholder='Enter password' onChange={(e) => setPassword(e.target.value)} value={password} required />
                                </div>
                                <div className='text-center w-100'>
                                    <button type='button' className='btn rounded-pill mt-2 PreLoginButtonGold' onClick={handleValidation}>Sign in</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPageAdmin