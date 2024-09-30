import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const REQUEST_EDIT_BASE = '/company/updateJobRequest';

const CompanyEditRequest = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();
    const [jobRequest, setJobRequest] = useState();
    const [jobRequestId, setJobRequestId] = useState('');
    var UPDATE_REUEST_URL = '';

    useEffect(() => {
        console.log('i fire once');
        if (state?.job) {
            setJobRequest(state?.job?.requestDetails);
            setJobRequestId(state?.job?.requestId);
        } 
    }, []);

    function handleInput(event, key) {
        const newObj = { ...jobRequest, [key]: event.target.value };
        setJobRequest(newObj);
    }

    const handleCreateNewRequest = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            var payload = jobRequest;
            UPDATE_REUEST_URL = REQUEST_EDIT_BASE + '/' + jobRequestId;

            try {
                const response = await axiosPrivate.put(UPDATE_REUEST_URL, JSON.stringify(payload));
                console.log(JSON.stringify(response?.data));
                const saveStatus = response?.data?.status;
                const saveSuccess = response?.data?.success;

                if(saveSuccess) {
                    alert("Job Request created successfully");
                    document.getElementById("frmCreateNewCandidateRequest").reset();
                    navigate('/Company/Dashboard');
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

    function handleCencelEditRequest(event) {
        document.getElementById("frmEditJobRequest").reset();
        navigate('/Company/Dashboard');
    }

    return (
        <>
            <div className="container mt-3" style={{ maxWidth: '95%', height: 'max-content' }}>
                <div className="row rounded-5 ps-4 pt-2 pe-4 pb-2" style={{ backgroundColor: 'white' }}>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <p className="fw-medium text-start fs-4 mt-3"><i className="fas fa-circle-plus"></i> &nbsp;Edit requrest</p>
                    <form id="frmEditJobRequest" className="row g-3 needs-validation" onSubmit={handleCreateNewRequest} noValidate>
                        <div className="row mb-2">
                            <div className='col-sm'>
                                <label htmlFor="txtJobTitle" className="col-form-label fw-medium text-start fs-5">
                                    <i className="fas fa-pen-nib"></i>&nbsp;Job title
                                </label>
                                <div className="input-group has-validation">
                                    <input type="text" className="form-control fw-lighter fs-5" id="txtJobTitle" name="txtJobTitle" onChange={(event) => handleInput(event, 'jobTitle')} value={jobRequest?.jobTitle} required />
                                </div>
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="txtExperience" className="col-form-label fw-medium text-end fs-5">
                                    <i className="fas fa-briefcase"></i>&nbsp;Desired experience (Months)
                                </label>
                                <div className="input-group has-validation">
                                    <input type="number" className="form-control fw-lighter fs-5" id="txtExperience" name="txtExperience" onChange={(event) => handleInput(event, 'experience')} value={jobRequest?.experience} required />
                                </div>
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="txtIndustry" className="col-form-label fw-medium text-end fs-5">
                                    <i className="fas fa-industry"></i>&nbsp;Industry
                                </label>
                                <div className="input-group has-validation">
                                    <input type="text" className="form-control fw-lighter fs-5" id="txtIndustry" name="txtIndustry" onChange={(event) => handleInput(event, 'industry')} value={jobRequest?.industry} required />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className='col-sm'>
                                <label htmlFor="txtSubIndustry" className="col-form-label fw-medium text-end fs-5">
                                    <i className="fas fa-building"></i>&nbsp;Sub-industry
                                </label>
                                <div className="input-group has-validation">
                                    <input type="text" className="form-control fw-lighter fs-5" id="txtSubIndustry" name="txtSubIndustry" onChange={(event) => handleInput(event, 'subIndustry')} value={jobRequest?.subIndustry} required />
                                </div>
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="txtJobType" className="col-form-label fw-medium text-end fs-5 mb-1">
                                    <i className="fas fa-user-doctor"></i>&nbsp;Job type
                                </label>
                                <div className="input-group has-validation">
                                    <select className="form-select" id="drpJobType" name="drpJobType" aria-label="Floating label select example" defaultValue="" onChange={(event) => handleInput(event, 'type')} required>
                                        <option value="fulltime">Full time</option>
                                        <option value="part_time">Part time</option>
                                    </select>
                                </div>
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="txtWorkAuthorization" className="col-form-label fw-medium text-end fs-5">
                                    <i className="fas fa-person-circle-check"></i>&nbsp;Work authorization
                                </label>
                                <div className="input-group has-validation">
                                    <input type="text" className="form-control fw-lighter fs-5" id="txtWorkAuthorization" name="txtWorkAuthorization" onChange={(event) => handleInput(event, 'workAuth')} value={jobRequest?.workAuth} required />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className='col-sm'>
                                <label htmlFor="txtSkills" className="col-form-label fw-medium text-end fs-5">
                                    <i className="fas fa-book"></i>&nbsp;Required sills
                                </label>
                                <div className="input-group has-validation">
                                    <input type="text" className="form-control fw-lighter fs-5" id="txtSkills" name="txtSkills" onChange={(event) => handleInput(event, 'skills')} value={jobRequest?.skills} required />
                                </div>
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="txtBudget" className="col-form-label fw-medium text-end fs-5">
                                    <i className="fas fa-sack-dollar"></i>&nbsp;Minimum budget ($)
                                </label>
                                <div className="input-group has-validation">
                                    <input type="bumber" className="form-control fw-lighter fs-5" id="txtMinBudget" name="txtMinBudget" onChange={(event) => handleInput(event, 'minBudget')} value={jobRequest?.minBudget} required />
                                </div>
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="txtBudget" className="col-form-label fw-medium text-end fs-5">
                                    <i className="fas fa-sack-dollar"></i>&nbsp;Maximum budget ($)
                                </label>
                                <div className="input-group has-validation">
                                    <input type="bumber" className="form-control fw-lighter fs-5" id="txtMaxBudget" name="txtMaxBudget" onChange={(event) => handleInput(event, 'maxBudget')} value={jobRequest?.maxBudget} required />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className='col-sm'>
                                <label htmlFor="drpMode" className="col-form-label fw-medium text-end fs-5">
                                    <i className="fas fa-laptop-file"></i>&nbsp;Working mode
                                </label>
                                <div className="input-group has-validation">
                                    <select className="form-select" id="drpMode" name="drpMode" aria-label="Floating label select example" defaultValue="" onChange={(event) => handleInput(event, 'workingMode')} required>
                                        <option value="offline">Offline</option>
                                        <option value="online">Online</option>
                                    </select>
                                </div>
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="txtLocation" className="col-form-label fw-medium text-end fs-5 mb-1">
                                    <i className="fas fa-location-dot"></i>&nbsp;Job location
                                </label>
                                <div className="input-group has-validation">
                                    <input type="text" className="form-control fw-lighter fs-5" id="txtLocation" name="txtLocation" onChange={(event) => handleInput(event, 'jobLocation')} value={jobRequest?.jobLocation} required />
                                </div>
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="txtTenure" className="col-form-label fw-medium text-end fs-5 mb-1">
                                    <i className="fas fa-clock"></i>&nbsp;Job tenure
                                </label>
                                <div className="input-group has-validation">
                                    <input type="text" className="form-control fw-lighter fs-5" id="txtTenure" name="txtTenure" onChange={(event) => handleInput(event, 'jobTenure')} value={jobRequest?.jobTenure} required />
                                </div>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className='col col-sm-12'>
                                <label htmlFor="txtMessage" className="col-form-label fw-medium text-end fs-5">
                                    <i className="fas fa-message"></i>&nbsp;Message
                                </label>
                                <textarea className="form-control fs-5" placeholder="Leave your message here" id="txtMessage" name="txtMessage" onChange={(event) => handleInput(event, 'message')} value={jobRequest?.message}></textarea>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className='col col-sm-12 text-center'>
                                <button type="submit" className="btn btn-primary fs-5 me-2"><i className="fa-solid fa-floppy-disk"></i>&nbsp;Update</button>
                                <button type="button" className="btn btn-danger fs-5" onClick={handleCencelEditRequest}><i className="fa-solid fa-ban"></i>&nbsp;Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
export default CompanyEditRequest