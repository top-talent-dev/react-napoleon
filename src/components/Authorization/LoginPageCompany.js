import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';
import NavbarCompanyLogin from '../General/NavbarCompanyLogin';
import FooterCompanyLogin from '../General/FooterCompanyLogin';
import TermsConditionCompanyDialog from '../General/TermsConditionCompanyDialog';
import ForgetPasswordCompanyDialog from './ForgetPasswordCompanyDialog';
import MessageDialog from '../General/MessageDialog';
import SignUpCompanyDialog from './SignUpCompanyDialog';
import * as Helper from '../../utility/Helper';

const LOGIN_URL = '/auth/login';

const LoginPageCompany = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setAuth } = useAuth();
    const userRef = useRef();

    const userRole = location?.state?.userRole;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertMessage, setAlertMessage] = useState(Helper.formatAppMessage('Error occured! Try again.'));

    /** 
     * START - LOGIN SECTIPN 
     * */
    useEffect(() => {
        document.body.classList.remove('PreLoginBgImage');
        userRef.current.focus();
    }, []);

    function handleState(msgFromChild) {
        setAlertMessage(msgFromChild);
    }

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
                // const loginStatus = response?.data?.status;
                const loginSuccess = response?.data?.success;
                const accessToken = response?.data?.token;
                const refreshToken = response?.data?.refreshToken;
                const roles = [response?.data?.data?.role];

                if (loginSuccess) {
                    setAuth({ email, password, roles, accessToken, refreshToken });
                    if (roles[0] === 'company') {
                        window.sessionStorage.setItem('loggedInUserDetails', JSON.stringify(response?.data?.data?.company));
                        navigate('/Company/Dashboard');
                    } else {
                        setAlertMessage(Helper.formatAppMessage(formError.msg));
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
            <NavbarCompanyLogin/>
            <MessageDialog msg={alertMessage}/>
            <SignUpCompanyDialog change={handleState}/>
            <ForgetPasswordCompanyDialog/>
            <TermsConditionCompanyDialog/>
            <div className='container-fluid'>
                <div className='row CenterContentRow' style={{ minWidth: '35%' }}>
                    <div className='col-md-8 fw-bolder loginTitleTextRed'>
                        LOOKING FOR <br /> MY NEXT DREAM JOB...
                    </div>
                    <div className='col-md-4' style={{ backgroundColor: 'white', borderRadius: '15%' }}>
                        {/* Signin Section */}
                        <div className='ms-auto me-auto sectionPadding'>
                            <form id="frmLogin" className="needs-validation pt-4" noValidate>
                                <div className='mb-3'>
                                    <label htmlFor='txtUsername' className='form-label fs-5 fw-lighter'>Username / Email</label>
                                    <input type='text' name='email' className='form-control fs-5 fw-lighter FormInputRed' id='txtUsername' ref={userRef} placeholder='Enter email' onChange={(e) => setEmail(e.target.value)} value={email} required />
                                </div>
                                <div className='mb-3 mt-4'>
                                    <label htmlFor='txtUsername' className='form-label fs-5 fw-lighter'>Password</label>
                                    <input type='password' name='password' className='form-control s-5 fw-lighter FormInputRed' id='txtPassword' placeholder='Enter password' onChange={(e) => setPassword(e.target.value)} value={password} required />
                                </div>
                                <div className='text-center w-100'>
                                    <button type='button' className='btn rounded-pill mt-2 LoginButtonRed' onClick={handleValidation}>Sign in</button>
                                </div>
                            </form>
                            <div className='row mt-3 mb-3'>
                                <div className='col-sm-6 text-start w-50' style={{ display: userRole !== 'admin' ? 'block' : 'none' }}>
                                    <a className='fs-5 text-decoration-none text-nowrap fw-bold' href='/#' style={{ gap: '0px', color: '#93131D' }} data-bs-toggle='modal' data-bs-target='#signupCompanyDialog'>
                                        First time user?
                                    </a>
                                </div>
                                <div className='col-sm-6 text-end w-50'>
                                    <a className='fs-5 text-decoration-none text-nowrap fw-bold' href='/#' style={{ gap: '0px', color: '#93131D' }} data-bs-toggle='modal' data-bs-target='#forgetPasswordCompanyDialog'>
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FooterCompanyLogin />
        </>
    );
}

export default LoginPageCompany