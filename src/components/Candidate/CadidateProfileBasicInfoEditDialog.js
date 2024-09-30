import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import MessageDialog from "../General/MessageDialog";

const BASIC_INFO_UPDATE_URL = '/candidate/updateProfile';

const CadidateProfileBasicInfoEditDialog = (props) => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [profile, setProfile] = useState({});
    const [newEducation, setNewEducation] = useState({
        "degree": "",
        "year": "",
        "institute": "",
        "country": ""
    });
    const [errMsg, setErrMsg] = useState('');
    const [alertMessage, setAlertMessage] = useState({
        'title': 'Success message',
        'body': 'Profile data saved successfully.'
    });
    const errRef = useRef();

    useEffect(() => {
        const clonedProfile = { ...props?.keyInfo };
        setProfile(clonedProfile);
    }, [props]);

    function handleBasicInfoInput(event, key) {
        let newObj = { ...profile };
        newObj.basicInfo[key] = event.target.value;
        setProfile(newObj);
    }

    const updateBasicInfo = async (event) => {
        const form = document.getElementById('frmUpdateBasicInfo');
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        } else {
            try {
                const response = await axiosPrivate.post(BASIC_INFO_UPDATE_URL, JSON.stringify(profile));
                console.log(JSON.stringify(response?.data));
                const saveStatus = response?.data?.status;
                const saveSuccess = response?.data?.success;

                if (saveSuccess) {
                    setAlertMessage({
                        'title': 'Success message',
                        'body': 'Profile data saved successfully.'
                    });
                    document.getElementById('btnMessage').click();
                    navigate('/Candidate/Profile');
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
    }

    function cancelEdit(event) {
        const clonedProfileCancel = { ...props?.keyInfo };
        setProfile(clonedProfileCancel);
    }

    return (
        <>
            <MessageDialog msg={alertMessage} />
            <button type="button" id='btnMessage' style={{display: 'none'}} data-bs-toggle="modal" data-bs-target="#messageDialog"/>
            <div class="modal fade" id="editCandidateProfileBasicInfoDialog" tabindex="-1" aria-labelledby="editCandidateProfileBasicInfoDialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fw-bold fs-3" id="editCandidateProfileBasicInfoDialogLabel">Profile Basic information</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="frmUpdateBasicInfo" className="needs-validation" noValidate>
                                <div className="row">
                                    <div className='col-sm'>
                                        <div class="input-group mb-3">
                                            <span class="input-group-text" style={{ width: '45px' }}>
                                                <i className='fa-solid fa-mobile fs-3'></i>
                                            </span>
                                            <input type="text" class="form-control" value={profile?.basicInfo?.phone} placeholder="Enter phone number" aria-label="Username" aria-describedby="basic-addon1" onChange={(event) => handleBasicInfoInput(event, 'phone')} required/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm'>
                                        <div class="input-group mb-3">
                                            <span class="input-group-text" style={{ width: '45px' }}>
                                                <i className='fa-solid fa-at fs-3'></i>
                                            </span>
                                            <input type="text" class="form-control" value={profile?.basicInfo?.email} placeholder="Enter current email" aria-label="Username" aria-describedby="basic-addon1" onChange={(event) => handleBasicInfoInput(event, 'email')} required/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm'>
                                        <div class="input-group mb-3">
                                            <span class="input-group-text" style={{ width: '45px' }}>
                                                <i className='fa-solid fa-tachometer-alt fs-3'></i>
                                            </span>
                                            <input type="text" class="form-control" value={profile?.basicInfo?.experience} placeholder="Enter years of experience" aria-label="Username" aria-describedby="basic-addon1" onChange={(event) => handleBasicInfoInput(event, 'experience')} required/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm'>
                                        <div class="input-group mb-3">
                                            <span class="input-group-text" style={{ width: '45px' }}>
                                                <i className='fa-solid fa-venus-mars fs-3'></i>
                                            </span>
                                            <select class="form-select" id="selGender" aria-label="Floating label select example" required>
                                                <option selected>Select your gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm'>
                                        <div class="input-group mb-3">
                                            <span class="input-group-text" style={{ width: '45px' }}>
                                                <i className='fa-solid fa-globe fs-3'></i>
                                            </span>
                                            <input type="text" class="form-control" value={profile?.basicInfo?.citizenship} placeholder="Enter your citizenship" aria-label="Citizenship" aria-describedby="basic-addon1" onChange={(event) => handleBasicInfoInput(event, 'citizenship')} required/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm'>
                                        <div class="input-group mb-3">
                                            <span class="input-group-text" style={{ width: '45px' }}>
                                                <i className='fa-solid fa-passport fs-3'></i>
                                            </span>
                                            <input type="text" class="form-control" value={profile?.basicInfo?.visaStatus} placeholder="Enter your visa info" aria-label="Visa" aria-describedby="basic-addon1" onChange={(event) => handleBasicInfoInput(event, 'visaStatus')} required/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm'>
                                        <div class="input-group mb-3">
                                            <span class="input-group-text" style={{ width: '45px' }}>
                                                <i className='fa-solid fa-dollar-sign fs-3'></i>
                                            </span>
                                            <input type="text" class="form-control" value={profile?.basicInfo?.annualSalary} placeholder="Enter your annual salary" aria-label="Visa" aria-describedby="basic-addon1" onChange={(event) => handleBasicInfoInput(event, 'annualSalary')} required/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm'>
                                        <div class="input-group mb-3">
                                            <span class="input-group-text" style={{ width: '45px' }}>
                                                <i className='fa-solid fa-id-card fs-3'></i>
                                            </span>
                                            <input type="text" class="form-control" value={profile?.basicInfo?.ssn} placeholder="Enter SSN" aria-label="SSN" aria-describedby="basic-addon1" onChange={(event) => handleBasicInfoInput(event, 'ssn')} required/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm'>
                                        <div class="input-group mb-3">
                                            <span class="input-group-text" style={{ width: '45px' }}>
                                                <i className='fa-solid fa-map-marked fs-3'></i>
                                            </span>
                                            <input type="text" class="form-control" value={profile?.basicInfo?.address} placeholder="Enter your address" aria-label="Address" aria-describedby="basic-addon1" onChange={(event) => handleBasicInfoInput(event, 'address')} required/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm'>
                                        <div class="input-group mb-3">
                                            <span class="input-group-text" style={{ width: '45px' }}>
                                                <i className='fa-solid fa-signs-post fs-3'></i>
                                            </span>
                                            <input type="text" class="form-control" value={profile?.basicInfo?.city} placeholder="Enter your city" aria-label="Address" aria-describedby="basic-addon1" onChange={(event) => handleBasicInfoInput(event, 'city')} required/>
                                            <input type="text" class="form-control" value={profile?.basicInfo?.country} placeholder="Enter your country" aria-label="Address" aria-describedby="basic-addon1" onChange={(event) => handleBasicInfoInput(event, 'country')} required/>
                                            <input type="text" class="form-control" value={profile?.basicInfo?.postcode} placeholder="Enter your postcode" aria-label="Address" aria-describedby="basic-addon1" onChange={(event) => handleBasicInfoInput(event, 'postcode')} required/>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success fs-5" onClick={updateBasicInfo}>
                                <i className="fa-solid fa-floppy-disk"></i>&nbsp;Save
                            </button>
                            {/* <button type="button" class="btn btn-danger fs-5" data-bs-dismiss="modal" onClick={cancelEdit}>
                                <i className="fa-solid fa-circle-xmark"></i>&nbsp;Close
                            </button> */}
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
export default CadidateProfileBasicInfoEditDialog