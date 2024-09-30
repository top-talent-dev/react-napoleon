import { useState, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const REQUEST_CREATE_URL = '/company/insertNewJobRequest';

const CompanyCreateRequest = () => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();
    const [jobRequest, setJobRequest] = useState({
        "budget": 0,
        "exp": 0,
        "industry": null,
        "job_location": null,
        "job_title": null,
        "message": null,
        "skills_required": [],
        "sub_industry": null,
        "tenure_required": 0,
        "type": 'fulltime',
        "work_authorization": null,
        "working_mode": 'Offline'
    });

    function handleInput(event, key) {
        const newObj = { ...jobRequest, [key]: event.target.value };
        if(key === 'exp') {
            newObj.exp = Number(event.target.value);
        } else if(key === 'budget') {
            newObj.budget = Number(event.target.value);
        } else if(key === 'tenure_required') {
            newObj.tenure_required = Number(event.target.value);
        } else if(key === 'skills_required') {
            newObj.skills_required = event.target.value.toString().split(';');
        } else if(key === 'type') {
            console.log(event.target.value);
        } else if(key === 'working_mode') {
            console.log(event.target.value);
        }
        setJobRequest(newObj);
    }

    const handleCreateNewRequest = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            var payload = {};
            payload["requestJobs"] = [];
            payload.requestJobs.push(jobRequest);

            try {
                const response = await axiosPrivate.post(REQUEST_CREATE_URL, JSON.stringify(payload));
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

    function handleCencelNewRequest(event) {
        document.getElementById("frmCreateNewCandidateRequest").reset();
        navigate('/Company/Dashboard');
    }

    return (
        <>
            <div className="container mt-3" style={{ maxWidth: '95%', height: 'max-content' }}>
                <div className="row rounded-5 ps-4 pt-2 pe-4 pb-2" style={{ backgroundColor: 'white' }}>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <p className="fw-medium text-start fs-4 mt-3"><i className="fas fa-circle-plus"></i> &nbsp;Create new candidate request</p>
                    <form id="frmCreateNewCandidateRequest" className="row g-3 needs-validation" onSubmit={handleCreateNewRequest} noValidate>
                        <div className="row mb-2">
                            <div className='col-sm'>
                                <label htmlFor="txtJobTitle" className="col-form-label fw-medium text-start fs-5">
                                    <i className="fas fa-pen-nib"></i>&nbsp;Job title
                                </label>
                                <div className="input-group has-validation">
                                    <input type="text" className="form-control fw-lighter fs-5" id="txtJobTitle" name="txtJobTitle" onChange={(event) => handleInput(event, 'job_title')} value={jobRequest.job_title} required />
                                </div>
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="txtExperience" className="col-form-label fw-medium text-end fs-5">
                                    <i className="fas fa-briefcase"></i>&nbsp;Desired experience (Months)
                                </label>
                                <div className="input-group has-validation">
                                    <input type="number" className="form-control fw-lighter fs-5" id="txtExperience" name="txtExperience" onChange={(event) => handleInput(event, 'exp')} value={jobRequest.exp} required />
                                </div>
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="txtIndustry" className="col-form-label fw-medium text-end fs-5">
                                    <i className="fas fa-industry"></i>&nbsp;Industry
                                </label>
                                <div className="input-group has-validation">
                                    <input type="text" className="form-control fw-lighter fs-5" id="txtIndustry" name="txtIndustry" onChange={(event) => handleInput(event, 'industry')} value={jobRequest.industry} required />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className='col-sm'>
                                <label htmlFor="txtSubIndustry" className="col-form-label fw-medium text-end fs-5">
                                    <i className="fas fa-building"></i>&nbsp;Sub-industry
                                </label>
                                <div className="input-group has-validation">
                                    <input type="text" className="form-control fw-lighter fs-5" id="txtSubIndustry" name="txtSubIndustry" onChange={(event) => handleInput(event, 'sub_industry')} value={jobRequest.sub_industry} required />
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
                                    <input type="text" className="form-control fw-lighter fs-5" id="txtWorkAuthorization" name="txtWorkAuthorization" onChange={(event) => handleInput(event, 'work_authorization')} value={jobRequest.work_authorization} required />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className='col-sm'>
                                <label htmlFor="txtSkills" className="col-form-label fw-medium text-end fs-5">
                                    <i className="fas fa-book"></i>&nbsp;Required sills
                                </label>
                                <div className="input-group has-validation">
                                    <input type="text" className="form-control fw-lighter fs-5" id="txtSkills" name="txtSkills" onChange={(event) => handleInput(event, 'skills_required')} value={jobRequest.skills_required} required />
                                </div>
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="txtBudget" className="col-form-label fw-medium text-end fs-5">
                                    <i className="fas fa-sack-dollar"></i>&nbsp;Minimum budget ($)
                                </label>
                                <div className="input-group has-validation">
                                    <input type="bumber" className="form-control fw-lighter fs-5" id="txtMinBudget" name="txtMinBudget" onChange={(event) => handleInput(event, 'budget')} value={jobRequest.budget} required />
                                </div>
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="txtBudget" className="col-form-label fw-medium text-end fs-5">
                                    <i className="fas fa-sack-dollar"></i>&nbsp;Maximum budget ($)
                                </label>
                                <div className="input-group has-validation">
                                    <input type="bumber" className="form-control fw-lighter fs-5" id="txtMaxBudget" name="txtMaxBudget" onChange={(event) => handleInput(event, 'budget')} value={jobRequest.budget} required />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className='col-sm'>
                                <label htmlFor="drpMode" className="col-form-label fw-medium text-end fs-5">
                                    <i className="fas fa-laptop-file"></i>&nbsp;Working mode
                                </label>
                                <div className="input-group has-validation">
                                    <select className="form-select" id="drpMode" name="drpMode" aria-label="Floating label select example" defaultValue="" onChange={(event) => handleInput(event, 'working_mode')} required>
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
                                    <input type="text" className="form-control fw-lighter fs-5" id="txtLocation" name="txtLocation" onChange={(event) => handleInput(event, 'job_location')} value={jobRequest.job_location} required />
                                </div>
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="txtTenure" className="col-form-label fw-medium text-end fs-5 mb-1">
                                    <i className="fas fa-clock"></i>&nbsp;Job tenure
                                </label>
                                <div className="input-group has-validation">
                                    <input type="text" className="form-control fw-lighter fs-5" id="txtTenure" name="txtTenure" onChange={(event) => handleInput(event, 'tenure_required')} value={jobRequest.tenure_required} required />
                                </div>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className='col col-sm-12'>
                                <label htmlFor="txtMessage" className="col-form-label fw-medium text-end fs-5">
                                    <i className="fas fa-message"></i>&nbsp;Message
                                </label>
                                <textarea className="form-control fs-5" placeholder="Leave your message here" id="txtMessage" name="txtMessage" onChange={(event) => handleInput(event, 'message')} value={jobRequest.message}></textarea>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className='col col-sm-12 text-center'>
                                <button type="submit" className="btn btn-success rounded-4 fs-5 me-2"><i className="fa-solid fa-user-plus"></i>&nbsp;Create</button>
                                <button type="button" className="btn btn-danger rounded-4 fs-5" onClick={handleCencelNewRequest}><i className="fa-solid fa-ban"></i>&nbsp;Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
export default CompanyCreateRequest