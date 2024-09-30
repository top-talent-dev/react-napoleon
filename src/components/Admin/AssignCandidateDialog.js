import { useState, useRef, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';

const ASSIGN_CANDIDTE_URL = '/superadmin/assignNewCandidate';

const AssignCandidateDialog = (props) => {
    const { auth } = useAuth();
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        if (props?.resources?.jobRequest?.candidates?.length === 0) {
            document.getElementById('selectCandidateOne').value = '0';
            document.getElementById('selectCandidateTwo').value = '0';
        } else {
            if (props?.resources?.jobRequest?.candidates?.length > 0) {
                document.getElementById('selectCandidateOne').value = props?.resources?.jobRequest?.candidates[0].id;
            }

            if (props?.resources?.jobRequest?.candidates?.length > 1) {
                document.getElementById('selectCandidateTwo').value = props?.resources?.jobRequest?.candidates[1];
            }
        }
    }, [props]);

    const handleAssignCandidate = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            var isFormValid = false;
            if (document.getElementById('selectCandidateOne').value === '0') {
                setErrMsg('Select a candidate');
            } else if (!document.getElementById('txtInterviewTimeOne').value) {
                setErrMsg('Set the meeting time for first candidate');
            } else if (document.getElementById('selectCandidateTwo').value != '0' && !document.getElementById('txtInterviewTimeOne').value) {
                setErrMsg('Set the meeting time for second candidate');
            } else {
                isFormValid = true;
            }

            if (!isFormValid) {
                return;
            } else {
                var payload = {};
                payload.assign_candidate = [];
                var candidateOnePayload = {};
                var candidateTwoPayload = {};
                candidateOnePayload.jobId = props?.resources?.jobRequest?.requestId;
                candidateTwoPayload.jobId = props?.resources?.jobRequest?.requestId;

                candidateOnePayload.candidate = document.getElementById('selectCandidateOne').value;
                candidateOnePayload.interview_dt_time = document.getElementById('txtInterviewTimeOne').value;
                candidateOnePayload.timezone = 'America/New_York'; //new Date().getTimezoneOffset();
                payload.assign_candidate.push(candidateOnePayload);

                if (document.getElementById('selectCandidateTwo').value != '0') {
                    candidateTwoPayload.candidate = document.getElementById('selectCandidateTwo').value;
                    candidateTwoPayload.interview_dt_time = document.getElementById('txtInterviewTimeTwo').value;
                    candidateTwoPayload.timezone = new Date().getTimezoneOffset();
                    payload.assign_candidate.push(candidateTwoPayload);
                }

                try {
                    const response = await axiosPrivate.post(ASSIGN_CANDIDTE_URL, JSON.stringify(payload));
                    console.log(JSON.stringify(response?.data));
                    const saveStatus = response?.data?.status;
                    const saveSuccess = response?.data?.success;

                    if (saveSuccess) {
                        alert('Candidates assigned successfully');
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
    }

    return (
        <div class='modal fade' id='assignCandidateDialog' tabindex='-1' aria-labelledby='assignCandidateDialogLabel' aria-hidden='true'>
            <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'>{errMsg}</p>
            <form id='frmAssignCandidte' className='row g-3 needs-validation' onSubmit={handleAssignCandidate} noValidate>
                <div class='modal-dialog modal-dialog-centered'>
                    <div class='modal-content'>
                        <div class='modal-header'>
                            <h1 class='modal-title fw-bold fs-3' id='assignCandidateDialogLabel'>Quick assign candidates</h1>
                            <button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div class='modal-body'>
                            <div className='row'>
                                <div className='col-sm'>
                                    <div className="d-flex flex-row">
                                        <i className="fa-thin fa-address-card formIcon mt-1"></i>
                                        <div className='d-flex flex-column ms-2'>
                                            <label htmlFor='txtRequestNo' className='col-form-label fw-medium fw-bold text-start fs-5 p-0'>
                                                Request no
                                            </label>
                                            <p id='txtRequestNo' className='text-start fs-5 m-0'>{props?.resources?.jobRequest?.requestId}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-sm'>
                                    <div className="d-flex flex-row">
                                        <i className="fa-thin fa-building formIcon mt-1"></i>
                                        <div className='d-flex flex-column ms-2'>
                                            <label htmlFor='txtCompanyName' className='col-form-label fw-medium fw-bold text-start fs-5 p-0'>
                                                Company name
                                            </label>
                                            <p id='txtCompanyName' className='text-start fs-5 m-0'>{props?.resources?.jobRequest?.companyName}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='row mt-3'>
                                <div className='col-sm'>
                                    <div className="d-flex flex-row">
                                        <i className="fa-thin fa-briefcase formIcon mt-1"></i>
                                        <div className='d-flex flex-column ms-2'>
                                            <label htmlFor='txtExperience' className='col-form-label fw-medium fw-bold text-start fs-5 p-0'>
                                                Experience
                                            </label>
                                            <p id='txtExperience' className='text-start fs-5 m-0'>{props?.resources?.jobRequest?.experience}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-sm'>
                                    <div className="d-flex flex-row">
                                        <i className="fa-thin fa-industry formIcon mt-1"></i>
                                        <div className='d-flex flex-column ms-2'>
                                            <label htmlFor='txtIndustry' className='col-form-label fw-medium fw-bold text-start fs-5 p-0'>
                                                Industry
                                            </label>
                                            <p id='txtIndustry' className='text-start fs-5 m-0'>{props?.resources?.jobRequest?.industry}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row mt-3'>
                                <div className='col-sm'>
                                    <div className="d-flex flex-row">
                                        <i className="fa-thin fa-pen-nib formIcon mt-1"></i>
                                        <div className='d-flex flex-column ms-2'>
                                            <label htmlFor='txtRole' className='col-form-label fw-medium fw-bold text-start fs-5 p-0'>
                                                Role
                                            </label>
                                            <p id='txtRole' className='text-start fs-5 m-0'>{props?.resources?.jobRequest?.requestedRole}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-sm'>
                                    <div className="d-flex flex-row">
                                        <i className="fa-thin fa-user-doctor formIcon mt-1"></i>
                                        <div className='d-flex flex-column ms-2'>
                                            <label htmlFor='txtJobType' className='col-form-label fw-medium fw-bold text-start fs-5 p-0'>
                                                Jon type
                                            </label>
                                            <p id='txtJobType' className='text-start fs-5 m-0'>{props?.resources?.jobRequest?.jobType}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='row mt-4'>
                                <p className='fs-4 fw-bold mt-1 mb-0 text-start text-decoration-underline'>Candidate assignment</p>
                                <div className='col-sm'>
                                    <label htmlFor='selectCandidateOne' className='col-form-label fw-medium text-start fs-5'>
                                        {/* <i className='fas fa-address-card'></i>&nbsp; */}
                                        Candidate one
                                    </label>
                                    <select id='selectCandidateOne' className='form-select' aria-label='Default select example' required>
                                        <option value='0' selected>Select</option>
                                        {
                                            props?.resources?.candidates?.map((candidate, key) =>
                                                <option value={candidate?.candidateId}>{candidate?.basicInfo?.firstName} {candidate?.basicInfo?.lastName}</option>
                                            )
                                        }
                                    </select>
                                </div>
                                <div className='col-sm'>
                                    <label htmlFor='selectCandidateTwo' className='col-form-label fw-medium text-start fs-5'>
                                        {/* <i className='fas fa-building'></i>&nbsp; */}
                                        Candidate two
                                    </label>
                                    <select id='selectCandidateTwo' className='form-select' aria-label='Default select example'>
                                        <option value='0' selected>Select</option>
                                        {
                                            props?.resources?.candidates?.map((candidate, key) =>
                                                <option value={candidate?.candidateId}>{candidate?.basicInfo?.firstName} {candidate?.basicInfo?.lastName}</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className='row mt-1'>
                                <div className='col-md-6'>
                                    <label htmlFor='txtRequestNo' className='col-form-label fw-medium text-start fs-5'>
                                        {/* <i className='fas fa-address-card'></i>&nbsp; */}
                                        Schedule interview
                                    </label>
                                    <input type='datetime-local' className='form-control fw-lighter fs-5 w-auto' id='txtInterviewTimeOne' name='txtInterviewTimeOne' required />
                                </div>
                                <div className='col-md-6'>
                                    <label className='col-form-label fw-medium text-start fs-5'>
                                        {/* <i className='fas fa-building'></i>&nbsp; */}
                                        Schedule interview
                                    </label>
                                    <input type='datetime-local' className='form-control fw-lighter fs-5 w-auto' id='txtInterviewTimeTwo' name='txtInterviewTimeTwo' />
                                </div>
                            </div>
                        </div>
                        <div class='modal-footer'>
                            <button type='submit' class='btn btn-success fs-5 me-2'>
                                <i className='fa-light fa-check'></i>&nbsp;Assign
                            </button>
                            {/* <button type='button' class='btn btn-danger fs-5' data-bs-dismiss='modal' >
                                <i className='fa-solid fa-ban'></i>&nbsp;Cancel
                            </button> */}
                        </div>
                    </div>
                </div>
            </form>
        </div >
    )
}
export default AssignCandidateDialog