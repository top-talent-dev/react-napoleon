import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import MessageDialog from "../General/MessageDialog";

const EDUCATION_INFO_UPDATE_URL = '/candidate/updateProfile';

const CadidateProfileEducationInfoEditDialog = (props) => {
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

    function handleEducationInfoInput(event, key, index) {
        let newObj = { ...profile };
        (newObj.education[index])[key] = event.target.value;
        setProfile(newObj);
    }

    const updateEducationInfo = async (event) => {
        const form = document.getElementById('frmUpdateEducationInfo');
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        } else {
            try {
                const response = await axiosPrivate.post(EDUCATION_INFO_UPDATE_URL, JSON.stringify(profile));
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
            <div class="modal fade" id="editCandidateProfileEducationInfoDialog" tabindex="-1" aria-labelledby="editCandidateProfileEducationInfoDialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fw-bold fs-3" id="editCandidateProfileEducationInfoDialogLabel">Profile Education information</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="frmUpdateEducationInfo" className="needs-validation" noValidate>
                                {
                                    (profile?.education)?.map((degree, key) =>
                                        <div className="row">
                                            <div className="col col-sm-12">
                                                <p>Education details {key + 1}</p>
                                            </div>
                                            {/* <div className="col col-sm-6">
                                            <div class="input-group mb-3">
                                                <span class="input-group-text" id="basic-addon1">
                                                    <i className='fa-solid fa-school fs-3'></i>
                                                </span>
                                                <select class="form-select" id="selGender" aria-label="Floating label select example">
                                                    <option selected>Education type</option>
                                                    <option value="1">Doctorate</option>
                                                    <option value="2">Post graduation</option>
                                                    <option value="3">Graduation</option>
                                                    <option value="3">High school</option>
                                                    <option value="3">Certification</option>
                                                </select>
                                            </div>
                                        </div> */}
                                            <div className="col col-sm-6">
                                                <div class="input-group mb-1">
                                                    <span class="input-group-text" id="basic-addon1">
                                                        <i className='fa-solid fa-certificate fs-3'></i>
                                                    </span>
                                                    <input type="text" class="form-control" placeholder="Degree / certificate" value={degree.degree} onChange={(event) => handleEducationInfoInput(event, 'degree', key)} aria-label="Degree" aria-describedby="basic-addon1" />
                                                </div>
                                            </div>
                                            <div className='col col-sm-6 mt-1'>
                                                <div class="input-group mb-1">
                                                    <span class="input-group-text" id="basic-addon1">
                                                        <i className='fa-solid fa-calendar-days fs-3'></i>
                                                    </span>
                                                    <input type="text" class="form-control" placeholder="Enter year of passing" value={degree.year} onChange={(event) => handleEducationInfoInput(event, 'year', key)} aria-label="Year" aria-describedby="basic-addon1" />
                                                </div>
                                            </div>
                                            <div className='col col-sm-6 mt-1'>
                                                <div class="input-group mb-1">
                                                    <span class="input-group-text" id="basic-addon1">
                                                        <i className='fa-solid fa-building-columns fs-3'></i>
                                                    </span>
                                                    <input type="text" class="form-control" placeholder="Enter school / college / university" value={degree.institute} onChange={(event) => handleEducationInfoInput(event, 'institute', key)} aria-label="University" aria-describedby="basic-addon1" />
                                                </div>
                                            </div>
                                            <div className='col col-sm-6 mt-1'>
                                                <div class="input-group mb-1">
                                                    <span class="input-group-text" id="basic-addon1">
                                                        <i className='fa-solid fa-globe fs-3'></i>
                                                    </span>
                                                    <input type="text" class="form-control" placeholder="Enter school / college / university" value={degree.country} onChange={(event) => handleEducationInfoInput(event, 'country', key)} aria-label="University" aria-describedby="basic-addon1" />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success fs-5" onClick={updateEducationInfo} >
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
export default CadidateProfileEducationInfoEditDialog