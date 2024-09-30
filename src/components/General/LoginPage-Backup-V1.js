import { useRef, useState, useEffect } from 'react';
import LoginPageValidation from '../utility/LoginPageValidation';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';

const LOGIN_URL = '/auth/login';
const REGISTER_URL = '/auth/register';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setAuth } = useAuth();
    const userRef = useRef();
    const errRef = useRef();

    const userRole = location.state.userRole;
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
        if(userRole === 'candidate') {
            document.body.style.backgroundImage = 'linear-gradient(to top right, #32775E , #2BA58B)';
        } else if(userRole === 'company') {
            document.body.style.backgroundImage = 'linear-gradient(to top right, #A21825 , #E67782)';
        } else if(userRole === 'admin') {

        } 
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, password])

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
                if(roles[0] === 'company') {
                    window.sessionStorage.setItem('loggedInUserDetails', JSON.stringify(response?.data?.data?.company));
                } else if(roles[0] === 'candidate') {
                    window.sessionStorage.setItem('loggedInUserDetails', JSON.stringify(response?.data?.data?.candidate));
                }
            }

            if (roles[0] === 'company') {
                navigate('/Company/Dashboard');
            } else if (roles[0] === 'candidate') {
                navigate('/Candidate/Dashboard');
            } else if (roles[0] === 'admin') {
                navigate('/Admin/Dashboard');
            } else {
                setErrors(formError);
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

    /** 
     * START - SIGNUP SECTION 
     * */
    function handleSignup(event) {
        setDisplayMode({
            signInDisplay: 'none',
            signUpDisplay: 'block',
            forgetPassDisplay: 'none'
        });

        setSignupMode({
            candidateRadio: true,
            candidateSignup: 'block',
            companyRadio: false,
            companySignup: 'none'
        });
    }

    function handleRegistrationType(event) {
        event.target.checked = true;
        if (event.target.value === 'Candidate') {
            setSignupMode({
                candidateRadio: true,
                candidateSignup: 'block',
                companyRadio: false,
                companySignup: 'none'
            });
            setRole('candidate');
        } else if (event.target.value === 'Company') {
            setSignupMode({
                candidateRadio: false,
                candidateSignup: 'none',
                companyRadio: true,
                companySignup: 'block'
            });
            setRole('company');
        }
    }

    const handleRegistration = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        } else {
            event.preventDefault()

            try {
                const response = await axios.post(REGISTER_URL,
                    JSON.stringify({ email, first_name,last_name, mobile, password, role }),
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: false
                    }
                );
                console.log(JSON.stringify(response?.data));
                const loginStatus = response?.data?.status;
                const loginSuccess = response?.data?.success;

                if(loginSuccess) {
                    alert('Registration successful. Please login to proceed.');
                    setDisplayMode({
                        signInDisplay: 'block',
                        signUpDisplay: 'none',
                        forgetPassDisplay: 'none'
                    });
                } else {
                    setErrMsg(response?.data?.message);
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
        form.classList.add('was-validated');
    }

    function handleSignupCancel(event) {
        setDisplayMode({
            signInDisplay: 'block',
            signUpDisplay: 'none',
            forgetPassDisplay: 'none'
        });
    }

    /** 
     * START - FORGET PASSWORD SECTION 
     * */
    function handleForgetPassword(event) {
        setDisplayMode({
            signInDisplay: 'none',
            signUpDisplay: 'none',
            forgetPassDisplay: 'block'
        });
    }

    return (
        <div className='container-fluid'>
            <div className='row ms-auto CenterContent loginSectionWidth' style={{ minWidth: '35%' }}>
                {/* <div className='col col-md-6 rounded-start d-none d-sm-block' style={{ backgroundColor: '#1F4E79' }}>
                    <img src={require('../images/Logo.png')} alt='Napoleon Logo' className='mt-2' />
                    <p className='text-end fs-1 fw-semibold text-white me-3' style={{marginTop: '25%'}}>Welcome to Napoleon</p>
                    <p className='text-end fs-3 fw-light text-white me-3'>Sign in to continue access</p>
                    <p><a href='www.napoleon.com' className='link-light fs-6 fw-lighter text-white' style={{position: 'fixed', bottom: '5%'}}>www.napoleon.cloud</a></p>
                </div> */}
                <div className='col-sm rounded-4 align-middle ms-auto me-auto pb-3' style={{ backgroundColor: 'white' }}>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    {/* Signin Section */}
                    <div className='ms-auto me-auto p-2' style={{ display: displayMode.signInDisplay }}>
                        <div className='text-center w-100'>
                            <img src={require('../images/Logo.png')} alt='Napoleon Logo' className='mt-1 mb-1' />
                        </div>
                        <p className='text-left fs-3 fw-medium mb-3'>Sign in</p>
                        <form id="frmLogin" className="needs-validation" noValidate>
                            <div className='mb-3'>
                                <i className='fa-solid fa-user fs-5 mt-1 me-2'></i><label htmlFor='txtUsername' className='form-label fs-5 fw-lighter'>Username / Email</label>
                                <input type='text' name='email' className='form-control fs-5 fw-lighter FormInput' id='txtUsername' ref={userRef} placeholder='Enter email' onChange={(e) => setEmail(e.target.value)} value={email} required />
                                {/* <p style={{ color: 'red' }} className='fs-5 fw-light'>{errors.email}</p> */}
                            </div>
                            <div className='mb-3 mt-4'>
                                <i className='fa-solid fa-lock fs-5 mt-1 me-2'></i>
                                <label htmlFor='txtUsername' className='form-label fs-5 fw-lighter'>Password</label>
                                <input type='password' name='password' className='form-control fs-5 fw-lighter FormInput' id='txtPassword' placeholder='Enter password' onChange={(e) => setPassword(e.target.value)} value={password} required />
                                {/* <p style={{ color: 'red' }} className='fw-light fs-5'>{errors.password}</p> */}
                            </div>
                            <button type='button' className='btn btn-primary mt-2 w-100' onClick={handleValidation}>Continue</button>
                        </form>
                        <div className='row mt-1 mb-3'>
                            <div className='col-sm text-start'>
                                <a className='icon-link fs-5 text-decoration-none text-nowrap' href='#' style={{ gap: '0px' }} onClick={handleSignup}>
                                    <i className='fa-solid fa-user-plus fs-5 me-1'></i>
                                    First time user?
                                </a>
                            </div>
                            <div className='col-sm text-end d-none d-md-block d-lg-block'>
                                <a className='icon-link fs-5 text-decoration-none text-nowrap' href='#' style={{ gap: '0px' }} onClick={handleForgetPassword}>
                                    <i className='fa-solid fa-key fs-5 me-1'></i>
                                    Forgot password?
                                </a>
                            </div>
                            <div className='col-sm text-start d-md-none d-lg-none d-sm-block d-xs-block'>
                                <a className='icon-link fs-5 text-decoration-none text-nowrap' href='#' style={{ gap: '0px' }} onClick={handleForgetPassword}>
                                    <i className='fa-solid fa-key fs-5 me-1'></i>
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Signup Section */}
                    <div className="ms-auto me-auto" style={{ display: displayMode.signUpDisplay }}>
                        <div className="mb-2 text-center">
                            <label className="fs-3 fw-medium mt-2">Signup as </label>
                            <div className="row ms-auto me-auto mt-2 mb-3" style={{ width: '20vw' }}>
                                <div className="col col-sm-6 form-check">
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="rdoCandidate" value="Candidate" onChange={handleRegistrationType} checked={signupMode.candidateRadio} />
                                    <label className="form-check-label" htmlFor="rdoCandidate">Candidate</label>
                                </div>
                                <div className="col col-sm-6 form-check">
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="rdoCompany" value="Company" onChange={handleRegistrationType} checked={signupMode.companyRadio} />
                                    <label className="form-check-label" htmlFor="rdoCompany">Company</label>
                                </div>
                            </div>
                        </div>
                        {/* Registration Section */}
                        <div style={{ display: signupMode.candidateSignup }}>
                            <form id="frmCandidateRegistration" className="needs-validation" onSubmit={handleRegistration} noValidate>
                                <div className="row mb-4">
                                    <div className="col-sm-5">
                                        <i className="fa-solid fa-address-card fs-5 mt-1 me-2"></i>
                                        <label htmlFor="txtFirstName" className="form-label fs-5 fw-lighter w-50 m-0 text-nowrap">Your name</label>
                                    </div>
                                    <div className="col-sm-7">
                                        <input type="text" name="txtFirstName" className="form-control fs-5 fw-lighter FormInput" id="txtFirstName" placeholder="Enter your firstname" onChange={(e) => setFirstName(e.target.value)} value={first_name} required />
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-sm-5">
                                        <i className="fa-solid fa-address-card fs-5 mt-1 me-2"></i>
                                        <label htmlFor="txtLasttName" className="form-label fs-5 fw-lighter w-50 m-0 text-nowrap">Your name</label>
                                    </div>
                                    <div className="col-sm-7">
                                        <input type="text" name="txtLastName" className="form-control fs-5 fw-lighter FormInput" id="txtLastName" placeholder="Enter your lastname" onChange={(e) => setLastName(e.target.value)} value={last_name} required />
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-sm-5">
                                        <i className="fa-solid fa-at mt-1 me-2" style={{ fontSize: '1.1vw' }}></i>
                                        <label htmlFor="txtEmail" className="form-label fs-5 fw-lighter w-50 m-0 text-nowrap" >Your email</label>
                                    </div>
                                    <div className="col-sm-7">
                                        <input type="text" name="txtEmail" className="form-control fs-5 fw-lighter FormInput" id="txtEmail" placeholder="Enter your email address" onChange={(e) => setEmail(e.target.value)} value={email} required />
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-sm-5">
                                        <i className="fa-solid fa-phone fs-5 mt-1 me-2"></i>
                                        <label htmlFor="txtMobile" className="form-label fs-5 fw-lighter w-50 m-0 text-nowrap" >Contact number</label>
                                    </div>
                                    <div className="col-sm-7">
                                        <input type="text" name="txtMobile" className="form-control fs-5 fw-lighter FormInput" id="txtMobile" placeholder="Enter your contact number" onChange={(e) => setMobile(e.target.value)} value={mobile} required />
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-sm-5">
                                        <i className="fa-solid fa-key mt-1 me-2" style={{ fontSize: '1.1vw' }}></i>
                                        <label htmlFor="txtRegisterPassword" className="form-label fs-5 fw-lighter w-50 m-0 text-nowrap" >Password</label>
                                    </div>
                                    <div className="col-sm-7">
                                        <input type="text" name="txtRegisterPassword" className="form-control fs-5 fw-lighter FormInput" id="txtRegisterPassword" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-sm-5">
                                        <i className="fa-solid fa-key mt-1 me-2" style={{ fontSize: '1.1vw' }}></i>
                                        <label htmlFor="txtReRegisterPassword" className="form-label fs-5 fw-lighter w-50 m-0 text-nowrap" >Re-type password</label>
                                    </div>
                                    <div className="col-sm-7">
                                        <input type="text" name="txtReRegisterPassword" className="form-control fs-5 fw-lighter FormInput" id="txtReRegisterPassword" placeholder="Re-enter your password" onChange={(e) => setRePassword(e.target.value)} value={rePassword} required />
                                    </div>
                                </div>
                                <div class="row input-group mb-2">
                                    <div class="col-sm-12 text-center">
                                        <input className="form-check-input mt-1 me-2" type="checkbox" value="" aria-label="Checkbox for following text input" />
                                        <sapn className='fs-5 fw-light'>Accept the <a href='#'>terms & conditions</a></sapn>
                                    </div>

                                </div>
                                <button type="submit" className="btn btn-primary mt-2" style={{ width: "45%" }}><i className="fa-solid fa-user-plus"></i>&nbsp;Signup</button>
                                <button type="button" className="btn btn-danger mt-2" style={{ width: "45%", float: "right" }} onClick={handleSignupCancel}><i className="fa-solid fa-ban"></i>&nbsp;Cancel</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage