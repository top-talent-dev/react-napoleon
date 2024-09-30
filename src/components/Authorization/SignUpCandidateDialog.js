import { useState, useEffect } from "react";
import axios from "../../api/axios";
import * as Helper from '../../utility/Helper';

const REGISTER_URL = '/auth/register';

const SignUpCandidateDialog = ({ change }) => {
    const [signUpInfo, setSignUpInfo] = useState({
        'companyName': '',
        'email': '',
        'firstName': '',
        'lastName': '',
        'mobile': '',
        'password': '',
        'rePassword': '',
        'termsAccept': false,
        'role': 'candidate'
    });

    useEffect(() => {

    }, []);

    function handleSignUpInfo(event, key) {
        let newObj = { ...signUpInfo };
        if (key === 'termsAccept') {
            newObj[key] = event.target.checked;
        } else {
            newObj[key] = event.target.value;
        }
        setSignUpInfo(newObj);
    }

    function getTransformedPayload() {
        return {
            "email": signUpInfo.email,
            "first_name": signUpInfo.firstName,
            "last_name": signUpInfo.lastName,
            "mobile": signUpInfo.mobile,
            "password": signUpInfo.password,
            "role": signUpInfo.role,
            "company_name": signUpInfo.companyName
        }
    }

    const handleRegistration = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        } else {
            event.preventDefault()
            let formError = Helper.SignUpValidation(signUpInfo);
            if (formError.isError) {
                change(Helper.formatAppMessage(formError.msg));
                Helper.openAppMessageDialogLevelTwo('signupCandidateDialog');
            } else {
                try {
                    const response = await axios.post(REGISTER_URL,
                        JSON.stringify(getTransformedPayload()),
                        {
                            headers: { 'Content-Type': 'application/json' },
                            withCredentials: false
                        }
                    );
                    console.log(JSON.stringify(response?.data));
                    // const loginStatus = response?.data?.status;
                    const loginSuccess = response?.data?.success;

                    if (loginSuccess) {
                        change(Helper.formatAppMessage('Registration successful. Please login to proceed.'));
                        Helper.openAppMessageDialog();
                    } else {
                        change(Helper.formatAppMessage('Registration failed. Try again later.'));
                        Helper.openAppMessageDialog();
                    }
                } catch (err) {
                    change(Helper.formatAppMessage(Helper.HandleSrviceCallError(err, 'SignUp')));
                    Helper.openAppMessageDialog();
                }
            }
        }
        form.classList.add('was-validated');
    }

    return (
        <>
            <button type="button" id='btnMessage' style={{ display: 'none' }} data-bs-toggle="modal" data-bs-target="#messageDialog" />
            <div className="modal fade" id="signupCandidateDialog" tabIndex="-1" aria-labelledby="signupCandidateDialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="row w-100" style={{ color: '#135441' }}>
                                <div className="col-sm-10">
                                    <h1 className="modal-title fw-bold fs-3" id="signupCandidateDialogLabel">Sign Up</h1>
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
                                    <div className="col-sm-6">
                                        <input type="text" name="txtFirstName" className="form-control fs-5 fw-lighter mb-2 FormInputGreen" id="txtFirstName" placeholder="Enter your firstname" onChange={(e) => handleSignUpInfo(e, 'firstName')} value={signUpInfo.firstName} required />
                                    </div>
                                    <div className="col-sm-6">
                                        <input type="text" name="txtLastName" className="form-control fs-5 fw-lighter mb-2 FormInputGreen" id="txtLastName" placeholder="Enter your lastname" onChange={(e) => handleSignUpInfo(e, 'lastName')} value={signUpInfo.lastName} required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <input type="text" name="txtEmail" className="form-control fs-5 fw-lighter mb-2 FormInputGreen" id="txtEmail" placeholder="Enter your email address" onChange={(e) => handleSignUpInfo(e, 'email')} value={signUpInfo.email} required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <input type="text" name="txtMobile" className="form-control fs-5 fw-lighter mb-2 FormInputGreen" id="txtMobile" placeholder="Enter your contact number" onChange={(e) => handleSignUpInfo(e, 'mobile')} value={signUpInfo.mobile} required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <input type="password" name="txtRegisterPassword" className="form-control fs-5 fw-lighter mb-2 FormInputGreen" id="txtRegisterPassword" placeholder="Enter your password" onChange={(e) => handleSignUpInfo(e, 'password')} value={signUpInfo.password} required />
                                    </div>
                                    <div className="col-sm-6">
                                        <input type="password" name="txtReRegisterPassword" className="form-control fs-5 fw-lighter mb-2 FormInputGreen" id="txtReRegisterPassword" placeholder="Re-enter your password" onChange={(e) => handleSignUpInfo(e, 'rePassword')} value={signUpInfo.rePassword} required />
                                    </div>
                                </div>
                                <div className="row input-group">
                                    <div className="col-sm-12 text-center">
                                        <input className="form-check-input mt-1 me-2 checkboxGreen" type="checkbox" onClick={(e) => handleSignUpInfo(e, 'termsAccept')} required />
                                        <span className='fs-5 fw-light'>Accept the <a href='/#' data-bs-toggle="modal" data-bs-target="#termsConditionDialog">terms & conditions</a></span>
                                    </div>

                                </div>
                            </form>
                        </div>
                        <div className="modal-footer text-center">
                            <button type="submit" className="btn rounded-pill mt-2 LoginButtonGreen" onClick={handleRegistration}>Signup</button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
export default SignUpCandidateDialog