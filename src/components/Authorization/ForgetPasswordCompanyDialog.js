import { useState, useEffect } from "react";
import axios from "../../api/axios";
import MessageDialog from "../General/MessageDialog";
import { HandleSrviceCallError } from '../../utility/Helper';

const SEND_OTP_URL = '/auth/forgotPassword';
const RESET_PASSWORD_URL = '/auth/resetPassword';

const ForgetPasswordCompanyDialog = (props) => {
    const [alertMessage, setAlertMessage] = useState({
        'title': 'Error message',
        'body': 'Sample message'
    });

    const [forgetPassword, setForgetPassword] = useState({
        email: '',
        contactNo: null,
        otp: null,
        password: '',
        rePassword: ''
    });

    const [displayFields, setDisplayFields] = useState({
        otpField: 'none',
        otpButton: 'block',
        resetButton: 'none'
    });

    useEffect(() => {
        document.getElementById('txtForgetPasswordEmail').disabled = false;
        document.getElementById('txtForgetPasswordContactNo').disabled = false;
        setForgetPassword({
            email: '',
            contactNo: null,
            otp: null,
            password: '',
            rePassword: ''
        });

        setDisplayFields({
            otpField: 'none',
            otpButton: 'block',
            resetButton: 'none'
        });
    }, [props]);

    function handleForgetPasswordInput(event, key) {
        const newObj = { ...forgetPassword, [key]: event.target.value };
        setForgetPassword(newObj);
    }

    const handleSendOTP = async (event) => {
        const form = document.getElementById('frmForgetPassword');
        if (form.checkValidity() === false) {

        } else {
            try {
                const response = await axios.post(SEND_OTP_URL,
                    JSON.stringify({ email: forgetPassword.email }),
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: false
                    }
                );
                console.log(JSON.stringify(response?.data));
                // const otpStatus = response?.data?.status;
                const otpSuccess = response?.data?.success;

                if (otpSuccess) {
                    alert('OTP sent to your email');
                    document.getElementById('txtForgetPasswordEmail').disabled = true;
                    document.getElementById('txtForgetPasswordContactNo').disabled = true;
                    setDisplayFields({
                        otpField: 'flex',
                        otpButton: 'none',
                        resetButton: 'block'
                    });
                }
            } catch (err) {
                setAlertMessage({
                    'title': 'Error message',
                    'body': HandleSrviceCallError(err, 'OTP')
                });
                document.getElementById('btnOpenAlert').click();
            }
        }
    }

    const handleResetPassword = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {
                const response = await axios.post(RESET_PASSWORD_URL,
                    JSON.stringify(forgetPassword),
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: false
                    }
                );
                console.log(JSON.stringify(response?.data));
                // const otpStatus = response?.data?.status;
                const otpSuccess = response?.data?.success;

                if (otpSuccess) {
                    alert('Your password is reset. Pleawse login to continue');

                }
            } catch (err) {
                setAlertMessage({
                    'title': 'Error message',
                    'body': HandleSrviceCallError(err, 'ForgetPass')
                });
                document.getElementById('btnOpenAlert').click();
            }
        }
        form.classList.add('was-validated');
    }

    return (
        <>
            <MessageDialog msg={alertMessage}/>
            <button type="button" id='btnMessage' style={{ display: 'none' }} data-bs-toggle="modal" data-bs-target="#messageDialog" />
            <div className="modal fade" id="forgetPasswordCompanyDialog" tabIndex="-1" aria-labelledby="forgetPasswordCompanyDialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="row w-100" style={{ color: '#93131D' }}>
                                <div className="col-sm-10">
                                    <h1 className="modal-title fw-bold fs-3" id="forgetPasswordCompanyDialogLabel">Reset password</h1>
                                </div>
                                <div className="col-sm-2 text-end mt-2 p-0">
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                        <div className="modal-body">
                            <form id="frmForgetPassword" className="needs-validation" onSubmit={handleResetPassword} noValidate>
                                <div className="row mb-3">
                                    <div className="col-sm-12">
                                        <input type="text" name="txtForgetPasswordEmail" className="form-control fs-5 fw-lighter FormInputRed" id="txtForgetPasswordEmail" placeholder="Registered email" onChange={(event) => handleForgetPasswordInput(event, 'email')} />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-12">
                                        <input type="number" name="txtForgetPasswordContactNo" className="form-control fs-5 fw-lighter FormInputRed" id="txtForgetPasswordContactNo" placeholder="Registered contact number" onChange={(event) => handleForgetPasswordInput(event, 'contactNo')} />
                                    </div>
                                </div>
                                <div className="row mb-3" style={{ display: displayFields.otpField }}>
                                    <div className="col-sm-12">
                                        <input type="number" name="txtOTP" className="form-control fs-5 fw-lighter FormInputRed" id="txtOTP" placeholder="Enter OTP" onChange={(event) => handleForgetPasswordInput(event, 'otp')} />
                                    </div>
                                </div>
                                <div className="row mb-4" style={{ display: displayFields.otpField }}>
                                    <div className="col-sm-6">
                                        <input type="password" name="txtPassword" className="form-control fs-5 fw-lighter FormInputRed" id="txtPassword" placeholder="Enter new password" onChange={(event) => handleForgetPasswordInput(event, 'password')} />
                                    </div>
                                    <div className="col-sm-6">
                                        <input type="password" name="txtRetypePassword" className="form-control fs-5 fw-lighter FormInputRed" id="txtRetypePassword" placeholder="Re-enter new password" onChange={(event) => handleForgetPasswordInput(event, 'rePassword')} />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer text-center">
                            <button type="button" className="btn rounded-pill mt-2 LoginButtonRed" style={{ display: displayFields.otpButton }} onClick={handleSendOTP}>Generate OTP</button>
                            <button type="submit" className="btn rounded-pill mt-2 LoginButtonRed" style={{ display: displayFields.resetButton }}>Reset</button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
export default ForgetPasswordCompanyDialog