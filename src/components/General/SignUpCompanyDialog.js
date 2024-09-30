import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import MessageDialog from "./MessageDialog";
import axios from "../../api/axios";

const REGISTER_URL = '/auth/register';

const SignUpCompanyDialog = (props) => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const errRef = useRef();

    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [role, setRole] = useState('candidate');

    useEffect(() => {

    }, [props]);

    const handleRegistration = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        } else {
            event.preventDefault()

            try {
                const response = await axios.post(REGISTER_URL,
                    JSON.stringify({ email, first_name, last_name, mobile, password, role }),
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: false
                    }
                );
                console.log(JSON.stringify(response?.data));
                const loginStatus = response?.data?.status;
                const loginSuccess = response?.data?.success;

                if (loginSuccess) {
                    alert('Registration successful. Please login to proceed.');
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

    return (
        <>
            {/* <MessageDialog msg={alertMessage} /> */}
            <button type="button" id='btnMessage' style={{ display: 'none' }} data-bs-toggle="modal" data-bs-target="#messageDialog" />
            <div className="modal fade" id="signupCompanyDialog" tabIndex="-1" aria-labelledby="signupCompanyDialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="row w-100" style={{ color: '#93131D' }}>
                                <div className="col-sm-10">
                                    <h1 className="modal-title fw-bold fs-3" id="signupCompanyDialogLabel">Sign Up</h1>
                                    <h4 className='fs-5 fw-light'>take the first step towards your dream job</h4>
                                </div>
                                <div className="col-sm-2 text-end mt-2 p-0">
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                        <div className="modal-body">
                            <form id="frmSignUpCandidate" className="needs-validation" onSubmit={handleRegistration} noValidate>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <input type="text" name="txtCompany" className="form-control fs-5 fw-lighter mb-2 FormInputRed" id="txtCompany" placeholder="Company name" onChange={(e) => setCompanyName(e.target.value)} value={email} required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <input type="text" name="txtFirstName" className="form-control fs-5 fw-lighter mb-2 FormInputRed" id="txtFirstName" placeholder="Contact firstname" onChange={(e) => setFirstName(e.target.value)} value={first_name} required />
                                    </div>
                                    <div className="col-sm-6">
                                        <input type="text" name="txtLastName" className="form-control fs-5 fw-lighter mb-2 FormInputRed" id="txtLastName" placeholder="Contact lastname" onChange={(e) => setLastName(e.target.value)} value={last_name} required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <input type="text" name="txtEmail" className="form-control fs-5 fw-lighter mb-2 FormInputRed" id="txtEmail" placeholder="Contact email address" onChange={(e) => setEmail(e.target.value)} value={email} required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <input type="text" name="txtMobile" className="form-control fs-5 fw-lighter mb-2 FormInputRed" id="txtMobile" placeholder="Contact number" onChange={(e) => setMobile(e.target.value)} value={mobile} required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <input type="password" name="txtRegisterPassword" className="form-control fs-5 fw-lighter mb-2 FormInputRed" id="txtRegisterPassword" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                                    </div>
                                    <div className="col-sm-6">
                                        <input type="password" name="txtReRegisterPassword" className="form-control fs-5 fw-lighter mb-2 FormInputRed" id="txtReRegisterPassword" placeholder="Re-enter your password" onChange={(e) => setRePassword(e.target.value)} value={rePassword} required />
                                    </div>
                                </div>
                                <div className="row input-group">
                                    <div className="col-sm-12 text-center">
                                        <input className="form-check-input mt-1 me-2 checkboxRed" type="checkbox" required />
                                        <span className='fs-5 fw-light'>Accept the <a href='#' data-bs-toggle="modal" data-bs-target="#termsConditionCompanyDialog">terms & conditions</a></span>
                                    </div>

                                </div>
                            </form>
                        </div>
                        <div className="modal-footer text-center">
                            <button type="submit" className="btn rounded-pill mt-2 LoginButtonRed">Signup</button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
export default SignUpCompanyDialog