import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import MessageDialog from "../General/MessageDialog";

const KEY_INFO_UPDATE_URL = '/candidate/updateProfile';

const CadidateProfileKeyInfoEditDialog = (props) => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [profile, setProfile] = useState({});
    const [errMsg, setErrMsg] = useState('');
    const [alertMessage, setAlertMessage] = useState({
        'title': 'Success message',
        'body': 'Profile data saved successfully.'
    });
    const errRef = useRef();

    useEffect(() => {
        setProfile(props?.keyInfo);
    }, [props]);

    function handleBasicInfoInput(event, key) {
        let newObj = { ...profile };
        newObj.basicInfo[key] = event.target.value;
        setProfile(newObj);
    }

    function handleConsentInput(event, key) {
        let newObj = { ...profile };
        newObj.consent[key] = event.target.checked;
        setProfile(newObj);
    }

    const updateKeyInfo = async (event) => {
        try {
            const response = await axiosPrivate.post(KEY_INFO_UPDATE_URL, JSON.stringify(profile));
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

    return (
        <>
            <MessageDialog msg={alertMessage}/>
            <button type="button" id='btnMessage' style={{display: 'none'}} data-bs-toggle="modal" data-bs-target="#messageDialog"/>
            <div class="modal fade" id="editCandidateProfileKeyInfoDialog" tabindex="-1" aria-labelledby="editCandidateProfileKeyInfoDialogLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fw-bold fs-3" id="editCandidateProfileKeyInfoDialogLabel">Profile key information</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            {/* <div className="row">
                            <div className='col-sm text-center'>
                                <img src={imageLink} alt="Candidate Profile" className="mb-2" style={{ height: '150px', width: '150px', borderRadius: '50%' }} />
                            </div>
                        </div> */}
                            <div className="row">
                                <div className='col-sm'>
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="basic-addon1" style={{ width: '45px' }}>
                                            <i className='fa-solid fa-signature fs-3'></i>
                                        </span>
                                        <input type="text" class="form-control" value={profile?.basicInfo?.firstName} placeholder="Enter your first name" aria-label="Username" aria-describedby="basic-addon1" onChange={(event) => handleBasicInfoInput(event, 'firstName')} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className='col-sm'>
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="basic-addon1" style={{ width: '45px' }}>
                                            <i className='fa-solid fa-signature fs-3'></i>
                                        </span>
                                        <input type="text" class="form-control" value={profile?.basicInfo?.lastName} placeholder="Enter your last name" aria-label="Username" aria-describedby="basic-addon1" onChange={(event) => handleBasicInfoInput(event, 'lastName')} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className='col-sm'>
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="basic-addon1" style={{ width: '45px' }}>
                                            <i className='fa-solid fa-user-doctor fs-3'></i>
                                        </span>
                                        <input type="text" class="form-control" value={profile?.basicInfo?.currentJobTitle} placeholder="Enter current role" aria-label="Username" aria-describedby="basic-addon1" onChange={(event) => handleBasicInfoInput(event, 'currentJobTitle')} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className='col-sm'>
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="basic-addon1" style={{ width: '45px' }}>
                                            <i className='fa-solid fa-audio-description fs-3'></i>
                                        </span>
                                        <input type="text" class="form-control" value={profile?.basicInfo?.briefExperience} placeholder="Enter brief about yourself" aria-label="Username" aria-describedby="basic-addon1" onChange={(event) => handleBasicInfoInput(event, 'briefExperience')} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className='col-sm form-switch ps-3'>
                                    <label className="form-check-label text-start fs-6 mb-2" for="flexSwitchCheckDefault" style={{ float: 'left', width: '90%' }}>Do you consent to providing diversity & inclusion information?</label>
                                    <input className="form-check-input me-2" type="checkbox" role="switch" id="flexSwitchCheckDefault" style={{ float: 'right' }} checked={profile?.consent?.provideDIInfoI } onChange={(event) => handleConsentInput(event, 'provideDIInfo')} />
                                </div>
                            </div>
                            <div className="row">
                                <div className='col-sm form-switch ps-3'>
                                    <label className="form-check-label text-start fs-6 mb-2" for="flexSwitchCheckDefault" style={{ float: 'left', width: '90%' }}>Do you identify as a diversity & inclusion candidate?</label>
                                    <input className="form-check-input me-2" type="checkbox" role="switch" id="flexSwitchCheckDefault" style={{ float: 'right' }} checked={profile?.consent?.diCandidate} onChange={(event) => handleConsentInput(event, 'diCandidate')} />
                                </div>
                            </div>
                            <div className="row">
                                <div className='col-sm form-switch ps-3'>
                                    <label className="form-check-label text-start fs-6 mb-2" for="flexSwitchCheckDefault" style={{ float: 'left', width: '90%' }}>Do you consent to us utilizing this information to find you matiching job?</label>
                                    <input className="form-check-input me-2" type="checkbox" role="switch" id="flexSwitchCheckDefault" style={{ float: 'right' }} checked={profile?.consent?.shareProfile} onChange={(event) => handleConsentInput(event, 'shareProfile')} />
                                </div>
                            </div>
                            {/* <div className="row">
                            <div className='col-sm form-switch ps-3'>
                                <label for="formFile" class="form-check-label text-start fs-6 mb-2">Upload your resume</label>
                                <input class="form-control" type="file" id="formFile"/>
                            </div>
                        </div> */}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success fs-5" onClick={updateKeyInfo}>
                                <i className="fa-solid fa-floppy-disk"></i>&nbsp;Save
                            </button>
                            {/* <button type="button" class="btn btn-danger fs-5" data-bs-dismiss="modal" >
                                <i className="fa-solid fa-circle-xmark"></i>&nbsp;Close
                            </button> */}
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
export default CadidateProfileKeyInfoEditDialog