import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import MessageDialog from "../General/MessageDialog";

const DIVERSITY_INFO_UPDATE_URL = '/candidate/updateProfile';

const CadidateProfileDiversityInfoEditDialog = (props) => {
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
        const clonedProfile = { ...props?.keyInfo };
        setProfile(clonedProfile);
    }, [props]);

    function handleDiversityInput(event, key) {
        let newObj = { ...profile };
        newObj.diversityInfo[key] = event.target.checked;
        setProfile(newObj);
    }

    const updateDiversityInfo = async (event) => {
        try {
            const response = await axiosPrivate.post(DIVERSITY_INFO_UPDATE_URL, JSON.stringify(profile));
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

    function cancelEdit(event) {
        const clonedProfileCancel = { ...props?.keyInfo };
        setProfile(clonedProfileCancel);
    }

    return (
        <div class="modal fade" id="editCandidateProfileDiversityInfoDialog" tabindex="-1" aria-labelledby="editCandidateProfileDiversityInfoDialogLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fw-bold fs-3" id="editCandidateProfileDiversityInfoDialogLabel">Profile Diversity information</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div className='row'>
                            <div className="col col-sm-6 mt-2">
                                <div class="form-check form-switch p-0">
                                    <p className="fw-medium fs-5 text-start mb-1" style={{ float: 'left', width: '85%' }}><i className="fas fa-globe"></i>&nbsp;Cultural diversity</p>
                                    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={profile?.diversityInfo?.culture} onChange={(event) => handleDiversityInput(event, 'culture')} />
                                </div>
                            </div>
                            <div className="col col-sm-6 mt-2">
                                <div class="form-check form-switch p-0">
                                    <p className="fw-medium fs-5 text-start mb-2" style={{ float: 'left', width: '85%' }}><i className="fas fa-hand-dots"></i>&nbsp;Racial diversity</p>
                                    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={profile?.diversityInfo?.racial} onChange={(event) => handleDiversityInput(event, 'racial')} />
                                </div>
                            </div>
                            <div className="col col-sm-6 mt-2">
                                <div class="form-check form-switch p-0">
                                    <p className="fw-medium fs-5 text-start mb-1" style={{ float: 'left', width: '85%' }}><i className="fas fa-hands-praying"></i>&nbsp;Religious diversity</p>
                                    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={profile?.diversityInfo?.regious} onChange={(event) => handleDiversityInput(event, 'regious')} />
                                </div>
                            </div>
                            <div className="col col-sm-6 mt-2">
                                <div class="form-check form-switch p-0">
                                    <p className="fw-medium fs-5 text-start mb-1" style={{ float: 'left', width: '85%' }}><i className="fas fa-stairs"></i>&nbsp;Age diversity</p>
                                    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={profile?.diversityInfo?.age} onChange={(event) => handleDiversityInput(event, 'age')} />
                                </div>
                            </div>
                            <div className="col col-sm-6 mt-2">
                                <div class="form-check form-switch p-0">
                                    <p className="fw-medium fs-5 text-start mb-1" style={{ float: 'left', width: '85%' }}><i className="fas fa-venus-mars"></i>&nbsp;Gender diversity</p>
                                    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={profile?.diversityInfo?.gender} onChange={(event) => handleDiversityInput(event, 'gender')} />
                                </div>
                            </div>
                            <div className="col col-sm-6 mt-2">
                                <div class="form-check form-switch p-0">
                                    <p className="fw-medium fs-5 text-start mb-1" style={{ float: 'left', width: '85%' }}><i className="fas fa-people-group"></i>&nbsp;Sexual orientation</p>
                                    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={profile?.diversityInfo?.sexual} onChange={(event) => handleDiversityInput(event, 'sexual')} />
                                </div>
                            </div>
                            <div className="col col-sm-6 mt-2">
                                <div class="form-check form-switch p-0">
                                    <p className="fw-medium fs-5 text-start mb-1" style={{ float: 'left', width: '85%' }}><i className="fas fa-wheelchair"></i>&nbsp;Disability</p>
                                    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={profile?.diversityInfo?.disability} onChange={(event) => handleDiversityInput(event, 'disability')} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success fs-5" onClick={updateDiversityInfo}>
                            <i className="fa-solid fa-floppy-disk"></i>&nbsp;Save
                        </button>
                        {/* <button type="button" class="btn btn-danger fs-5" data-bs-dismiss="modal" onClick={cancelEdit} >
                            <i className="fa-solid fa-circle-xmark"></i>&nbsp;Close
                        </button> */}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default CadidateProfileDiversityInfoEditDialog