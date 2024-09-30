import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';
import NavbarCandidateLogin from '../General/NavbarCandidateLogin';
import FooterCandidateLogin from '../General/FooterCandidateLogin';
import SignUpCandidateDialog from './SignUpCandidateDialog';
import TermsConditionCandidateDialog from '../General/TermsConditionCandidateDialog';
import ForgetPasswordCandidateDialog from './ForgetPasswordCandidateDialog';
import MessageDialog from '../General/MessageDialog';
import * as Helper from '../../utility/Helper';

const LOGIN_URL = '/auth/login';

const LoginPageCandidate = () => {
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
            setAlertMessage({
                'title': 'Error message',
                'body': formError.msg
            });
            document.getElementById('btnOpenAlert').click();
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
                    if (roles[0] === 'candidate') {
                        window.sessionStorage.setItem('loggedInUserDetails', JSON.stringify(response?.data?.data?.candidate));
                        navigate('/Candidate/Dashboard');
                    } else {
                        setAlertMessage({
                            'title': 'User are not registered as a Candidate! Please register to proceed.',
                            'body': formError.msg
                        });
                        document.getElementById('btnOpenAlert').click();
                    }
                }
            } catch (err) {
                setAlertMessage({
                    'title': 'Error message',
                    'body': Helper.HandleSrviceCallError(err, 'Login')
                });
                document.getElementById('btnOpenAlert').click();
            }
        }
    }

    return (
        <>
            <NavbarCandidateLogin />
            <MessageDialog msg={alertMessage} />
            <SignUpCandidateDialog change={handleState} />
            <ForgetPasswordCandidateDialog />
            <TermsConditionCandidateDialog />
            <div className='container-fluid'>
                <div className='row CenterContentRow' style={{ minWidth: '35%' }}>
                    <div className='col-md-8 fw-bolder loginTitleTextGreen'>
                        LOOKING FOR <br /> MY NEXT DREAM JOB...
                    </div>
                    <div className='col-md-4' style={{ backgroundColor: 'white', borderRadius: '15%' }}>
                        {/* Signin Section */}
                        <div className='ms-auto me-auto sectionPadding'>
                            <form id="frmLogin" className="needs-validation pt-4" noValidate>
                                <div className='mb-3'>
                                    <label htmlFor='txtUsername' className='form-label fs-5 fw-lighter'>Username / Email</label>
                                    <input type='text' name='email' className='form-control fs-5 fw-lighter FormInputGreen' id='txtUsername' ref={userRef} placeholder='Enter email' onChange={(e) => setEmail(e.target.value)} value={email} required />
                                </div>
                                <div className='mb-3 mt-4'>
                                    <label htmlFor='txtCandidatePassword' className='form-label fs-5 fw-lighter'>Password</label>
                                    <input type='password' name='password' className='form-control s-5 fw-lighter FormInputGreen' id='txtCandidatePassword' placeholder='Enter password' onChange={(e) => setPassword(e.target.value)} value={password} required />
                                </div>
                                <div className='text-center w-100'>
                                    <button type='button' className='btn rounded-pill mt-2 LoginButtonGreen' onClick={handleValidation}>Sign in</button>
                                </div>
                            </form>
                            <div className='row mt-3 mb-3'>
                                <div className='col-sm-6 text-start w-50' style={{ display: userRole !== 'admin' ? 'block' : 'none' }}>
                                    <a className='fs-5 text-decoration-none text-nowrap fw-bold' href='/#' style={{ gap: '0px', color: '#135340' }} data-bs-toggle='modal' data-bs-target='#signupCandidateDialog'>
                                        First time user?
                                    </a>
                                </div>
                                <div className='col-sm-6 text-end w-50'>
                                    <a className='fs-5 text-decoration-none text-nowrap fw-bold' href='/#' style={{ gap: '0px', color: '#135340' }} data-bs-toggle='modal' data-bs-target='#forgetPasswordCandidateDialog'>
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FooterCandidateLogin />
        </>
    );
}

export default LoginPageCandidate