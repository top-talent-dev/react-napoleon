import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const EXPERIENCEN_INFO_UPDATE_URL = '/candidate/updateProfile';

const CadidateProfileExperienceInfoEditDialog = (props) => {
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

    function handleExperienceInfoInput(event, key, index) {
        let newObj = { ...profile };
        (newObj.experience[index])[key] = event.target.value;
        setProfile(newObj);
    }

    const updateExperienceInfo = async (event) => {
        const form = document.getElementById('frmUpdateExperienceInfo');
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        } else {
            try {
                const response = await axiosPrivate.post(EXPERIENCEN_INFO_UPDATE_URL, JSON.stringify(profile));
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
            <div class="modal fade" id="editCandidateProfileExperienceInfoDialog" tabindex="-1" aria-labelledby="editCandidateProfileExperienceInfoDialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fw-bold fs-3" id="editCandidateProfileExperienceInfoDialogLabel">Profile Experience information</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="frmUpdateExperienceInfo" className="needs-validation" noValidate>
                                {
                                    (profile?.experience)?.map((experience, key) =>
                                        <div className="row">
                                            <div className="col col-sm-12">
                                                <p>Experience details {key + 1}</p>
                                            </div>
                                            <div className="col col-sm-12">
                                                <div class="input-group mb-3">
                                                    <span class="input-group-text" id="basic-addon1">
                                                        <i className='fa-solid fa-industry fs-3'></i>
                                                    </span>
                                                    <input type="text" class="form-control" placeholder="Enter company name" value={experience.company} onChange={(event) => handleExperienceInfoInput(event, 'company', key)} aria-label="Degree" aria-describedby="basic-addon1" />
                                                </div>
                                            </div>
                                            <div className='col col-sm-6'>
                                                <div class="input-group mb-3">
                                                    <span class="input-group-text" id="basic-addon1">
                                                        <i className='fa-solid fa-calendar-days fs-3'></i>
                                                    </span>
                                                    <input type="date" class="form-control" placeholder="Enter date of joining" value={experience.fromDate} onChange={(event) => handleExperienceInfoInput(event, 'fromDate', key)} aria-label="Year" aria-describedby="basic-addon1" />
                                                </div>
                                            </div>
                                            <div className='col col-sm-6'>
                                                <div class="input-group mb-3">
                                                    <span class="input-group-text" id="basic-addon1">
                                                        <i className='fa-solid fa-calendar-days fs-3'></i>
                                                    </span>
                                                    <input type="date" class="form-control" placeholder="Enter date of leaving" value={experience.toDate} onChange={(event) => handleExperienceInfoInput(event, 'toDate', key)} aria-label="Year" aria-describedby="basic-addon1" />
                                                </div>
                                            </div>
                                            <div className='col col-sm-12'>
                                                <div class="input-group mb-3">
                                                    <span class="input-group-text" id="basic-addon1">
                                                        <i className='fa-solid fa-user-doctor fs-3'></i>
                                                    </span>
                                                    <input type="text" class="form-control" placeholder="Enter brief experience summary" value={experience.roleDescription} onChange={(event) => handleExperienceInfoInput(event, 'roleDescription', key)} aria-label="University" aria-describedby="basic-addon1" />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success fs-5" onClick={updateExperienceInfo}>
                                <i className="fa-solid fa-floppy-disk"></i>&nbsp;Save
                            </button>
                            {/* <button type="button" class="btn btn-danger fs-5" data-bs-dismiss="modal" onClick={cancelEdit} >
                                <i className="fa-solid fa-circle-xmark"></i>&nbsp;Close
                            </button> */}
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
export default CadidateProfileExperienceInfoEditDialog