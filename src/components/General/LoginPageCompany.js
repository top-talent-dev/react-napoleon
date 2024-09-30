import { useRef, useState, useEffect } from 'react';
import LoginPageValidation from '../../utility/LoginPageValidation';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';
import NavbarCompanyLogin from './NavbarCompanyLogin';
import FooterCompanyLogin from './FooterCompanyLogin';
import SignUpCandidateDialog from './SignUpCompanyDialog';
import TermsConditionCompanyDialog from './TermsConditionCompanyDialog';
import ForgetPasswordCompanyDialog from './ForgetPasswordCompanyDialog';

const LOGIN_URL = '/auth/login';
const REGISTER_URL = '/auth/register';
const SEND_OTP_URL = '/auth/forgotPassword';
const RESET_PASSWORD_URL = '/auth/resetPassword';

const LoginPageCompany = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setAuth } = useAuth();
    const userRef = useRef();
    const errRef = useRef();

    const userRole = location?.state?.userRole;
    // const searchParams = new URLSearchParams(location?.search)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [role, setRole] = useState('candidate');

    /** 
     * START - LOGIN SECTIPN 
     * */
    useEffect(() => {
        document.body.classList.remove('PreLoginBgImage');
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [email, password]);

    const [displayMode, setDisplayMode] = useState({
        signInDisplay: 'block',
        signUpDisplay: 'none',
        forgetPassDisplay: 'none'
    });

    const [signupMode, setSignupMode] = useState({
        candidateRadio: true,
        candidateSignup: 'none',
        companyRadio: false,
        companySignup: 'none'
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const handleValidation = async (event) => {
        let formError = LoginPageValidation(email, password);
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
                if (roles[0] === 'company') {
                    window.sessionStorage.setItem('loggedInUserDetails', JSON.stringify(response?.data?.data?.company));
                    navigate('/Company/Dashboard');
                } else {

                }
            }
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            <NavbarCompanyLogin />
            <SignUpCandidateDialog />
            <ForgetPasswordCompanyDialog />
            <TermsConditionCompanyDialog />
            <div className='container-fluid'>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <div className='row CenterContentRow' style={{ minWidth: '35%' }}>
                    <div className='col-md-8 fw-bolder loginTitleTextRed'>
                        LOOKING FOR <br/> MY NEXT DREAM JOB...
                    </div>
                    <div className='col-md-4' style={{ backgroundColor: 'white', borderRadius: '15%' }}>
                        {/* Signin Section */}
                        <div className='ms-auto me-auto sectionPadding' style={{ display: displayMode.signInDisplay }}>
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
                                <div className='col-sm-6 text-start w-50' style={{ display: userRole != 'admin' ? 'block' : 'none' }}>
                                    <a className='fs-5 text-decoration-none text-nowrap fw-bold' href='#' style={{ gap: '0px', color: '#93131D' }} data-bs-toggle='modal' data-bs-target='#signupCompanyDialog'>
                                        First time user?
                                    </a>
                                </div>
                                <div className='col-sm-6 text-end w-50'>
                                    <a className='fs-5 text-decoration-none text-nowrap fw-bold' href='#' style={{ gap: '0px', color: '#93131D' }} data-bs-toggle='modal' data-bs-target='#forgetPasswordCompanyDialog'>
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