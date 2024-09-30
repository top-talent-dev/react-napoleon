import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import MessageDialog from "../General/MessageDialog";

const SKILL_INFO_UPDATE_URL = '/candidate/updateProfile';

export default function CadidateProfileSkillInfoEditDialog(props) {
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

    function handleSkillInput(event, index) {
        let newObj = { ...profile };
        if (newObj.skill.length >= index + 1) {
            newObj.skill[index].skillName = event.target.value;
        } else {
            newObj.skill.push({
                "skillName": event.target.value,
                "proficiency": "Great",
            });
        }
        setProfile(newObj);
    }

    const updateSkillInfo = async (event) => {
        const form = document.getElementById('frmUpdateSkillInfo');
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        } else {
            try {
                const response = await axiosPrivate.post(SKILL_INFO_UPDATE_URL, JSON.stringify(profile));
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
            <button type="button" id='btnMessage' style={{ display: 'none' }} data-bs-toggle="modal" data-bs-target="#messageDialog" />
            <div class="modal fade" id="editCandidateProfileSkilInfoDialog" tabindex="-1" aria-labelledby="editCandidateProfileSkilInfoDialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fw-bold fs-3" id="editCandidateProfileSkilInfoDialogLabel">Profile Skill information</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="frmUpdateSkillInfo" className="needs-validation" noValidate>
                                <div className="row">
                                    <div className='col-sm'>
                                        <div class="input-group mb-3">
                                            <span class="input-group-text" id="basic-addon1" style={{ width: '45px' }}>
                                                <i className='fa-solid fa-1 fs-3'></i>
                                            </span>
                                            <input type="text" class="form-control" value={profile?.skill?.length >= 1 ? profile?.skill[0]?.skillName : ''} placeholder="Enter skill one" aria-label="UseSkill one" aria-describedby="basic-addon1" onChange={(event) => handleSkillInput(event, 0)} />
                                        </div>
                                    </div>
                                </div><div className="row">
                                    <div className='col-sm'>
                                        <div class="input-group mb-3">
                                            <span class="input-group-text" id="basic-addon1" style={{ width: '45px' }}>
                                                <i className='fa-solid fa-2 fs-3'></i>
                                            </span>
                                            <input type="text" class="form-control" value={profile?.skill?.length >= 2 ? profile?.skill[1]?.skillName : ''} placeholder="Enter skill two" aria-label="UseSkill one" aria-describedby="basic-addon1" onChange={(event) => handleSkillInput(event, 1)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm'>
                                        <div class="input-group mb-3">
                                            <span class="input-group-text" id="basic-addon1" style={{ width: '45px' }}>
                                                <i className='fa-solid fa-3 fs-3'></i>
                                            </span>
                                            <input type="text" class="form-control" value={profile?.skill?.length >= 3 ? profile?.skill[2]?.skillName : ''} placeholder="Enter skill three" aria-label="UseSkill one" aria-describedby="basic-addon1" onChange={(event) => handleSkillInput(event, 2)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm'>
                                        <div class="input-group mb-3">
                                            <span class="input-group-text" id="basic-addon1" style={{ width: '45px' }}>
                                                <i className='fa-solid fa-4 fs-3'></i>
                                            </span>
                                            <input type="text" class="form-control" value={profile?.skill?.length >= 4 ? profile?.skill[3]?.skillName : ''} placeholder="Enter skill four" aria-label="UseSkill one" aria-describedby="basic-addon1" onChange={(event) => handleSkillInput(event, 3)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm'>
                                        <div class="input-group mb-3">
                                            <span class="input-group-text" id="basic-addon1" style={{ width: '45px' }}>
                                                <i className='fa-solid fa-5 fs-3'></i>
                                            </span>
                                            <input type="text" class="form-control" value={profile?.skill?.length >= 5 ? profile?.skill[4]?.skillName : ''} placeholder="Enter skill five" aria-label="UseSkill one" aria-describedby="basic-addon1" onChange={(event) => handleSkillInput(event, 4)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm'>
                                        <div class="input-group mb-3">
                                            <span class="input-group-text" id="basic-addon1" style={{ width: '45px' }}>
                                                <i className='fa-solid fa-6 fs-3'></i>
                                            </span>
                                            <input type="text" class="form-control" value={profile?.skill?.length >= 6 ? profile?.skill[5]?.skillName : ''} placeholder="Enter skill six" aria-label="UseSkill one" aria-describedby="basic-addon1" onChange={(event) => handleSkillInput(event, 5)} />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success fs-5" onClick={updateSkillInfo}>
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