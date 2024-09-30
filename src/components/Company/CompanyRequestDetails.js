import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const REQUEST_DETAILS_URL = '/company/getRequestedJobDetails';

const CompanyRequestDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();
    const requestId = location.state.id;
    const [jobRequestDetails, setJobRequestDetails] = useState({});
    const [interveiwSectionDisplay, setInterveiwSectionDisplay] = useState({
        'displayMode': 'none'
    });
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();
    var skills = '';
    console.log(location);
    console.log(requestId);

    useEffect(() => {
        fetchRequestDetails(requestId);
    }, [requestId]);

    const fetchRequestDetails = async (requestId) => {
        try {
            const response = await axiosPrivate.get(REQUEST_DETAILS_URL + "/" + requestId, {});
            console.log(JSON.stringify(response?.data));
            // const fetchStatus = response?.data?.status;
            const fetchSuccess = response?.data?.success;

            if (fetchSuccess) {
                setJobRequestDetails(response?.data?.data?.job);
                if(response?.data?.data?.job?.interviews?.length > 0) {
                    setInterveiwSectionDisplay({
                        'displayMode': 'block'
                    });
                }
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

    function toggleCollapseIcon(event) {
        let collapseIcon = event.target;
        let classList = collapseIcon.classList;
        if (classList.contains("fa-square-plus")) {
            classList.remove("fa-square-plus");
            classList.add("fa-square-minus");
        } else if (classList.contains("fa-square-minus")) {
            classList.remove("fa-square-minus");
            classList.add("fa-square-plus");
        }
    }

    function handleCencelNewRequest(event) {
        navigate('/Company/Dashboard');
    }

    function editJobRequest(event) {
        navigate('EditRequest', { state: { job: jobRequestDetails } });
    }

    function handleCandidateProfile(event, candidateId) {
        navigate('CandidateProfile', { state: { id: candidateId } });
    }

    return (
        <>
            <div className="container mt-3" style={{ maxWidth: '95%', height: 'max-content' }}>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <p className='fs-3 fw-bold mt-2 mb-2'>Request details</p>
                <div className="row rounded-5 ps-4 pt-2 pe-4 pb-2 mb-3" style={{ backgroundColor: 'white' }}>
                    <div className="row">
                        <div className="col col-sm-8">
                            <p className="fw-bold text-start fs-4 mt-1">
                                Company contact
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-sm'>
                            <div className="d-flex flex-row">
                                <i className="fa-thin fa-address-card mt-1 mt-1 formIcon"></i>
                                <div className='d-flex flex-column ms-2'>
                                    <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                        Contact person
                                    </label>
                                    <p className="text-start fs-5">{jobRequestDetails?.agent?.contactName}</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm'>
                            <div className="d-flex flex-row">
                                <i className="fa-thin fa-envelope-open-text mt-1 formIcon"></i>
                                <div className='d-flex flex-column ms-2'>
                                    <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                        Contact email
                                    </label>
                                    <p className="text-start fs-5">{jobRequestDetails?.agent?.contactEmail}</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm'>
                            <div className="d-flex flex-row">
                                <i className="fa-thin fa-phone mt-1 formIcon"></i>
                                <div className='d-flex flex-column ms-2'>
                                    <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                        Contact phone
                                    </label>
                                    <p className="text-start fs-5">{jobRequestDetails?.agent?.contactPhone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row rounded-5 ps-4 pt-2 pe-4 pb-2 mb-3" style={{ height: '100%', backgroundColor: 'white' }}>
                    <div className="row mt-3">
                        <div className="col col-sm-8">
                            <p className="fw-bold text-start fs-4 mt-1">
                                Request details
                                <i className='fa-solid fa-pencil fs-5 ms-4' style={{ cursor: 'pointer' }} onClick={editJobRequest}></i>
                            </p>
                        </div>
                        <div className="col col-sm-4 text-end">
                            <button className="btn" type="button" data-bs-toggle="collapse" data-bs-target="#divRequestDetailsCollapsable" aria-expanded="false" aria-controls="multiCollapseExample2" onClick={toggleCollapseIcon}>
                                <i id="iconCollapseRequestDetails" className="fw-medium fa-thin fa-square-minus fs-4"></i>
                            </button>
                        </div>
                    </div>
                    <div class="collapse show" id="divRequestDetailsCollapsable">
                        <div className="row">
                            <div className='col-sm'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-pen-nib mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Job title
                                        </label>
                                        <p className="text-start fs-5">{jobRequestDetails?.requestDetails?.jobTitle}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-briefcase mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Desired experience
                                        </label>
                                        <p className="text-start fs-5">{jobRequestDetails?.requestDetails?.experience}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-industry mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Industry
                                        </label>
                                        <p className="text-start fs-5">{jobRequestDetails?.requestDetails?.industry}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-building mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Sub-indusrty
                                        </label>
                                        <p className="text-start fs-5">{jobRequestDetails?.requestDetails?.subIndustry}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-sm'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-user-doctor mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Job type
                                        </label>
                                        <p className="text-start fs-5">{jobRequestDetails?.requestDetails?.jobType}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-person-circle-check mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Work authorization
                                        </label>
                                        <p className="text-start fs-5">{jobRequestDetails?.requestDetails?.workAuth}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-book mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Required skills
                                        </label>
                                        <p className="text-start fs-5 ">
                                            {
                                                jobRequestDetails?.requestDetails?.skills?.map((skill, key) =>
                                                    skills = skills + " " + skill
                                                )
                                            }
                                            skills
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-laptop-file mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Working mode
                                        </label>
                                        <p className="text-start fs-5">{jobRequestDetails?.requestDetails?.workingMode}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-sm'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-sack-dollar mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Min budget
                                        </label>
                                        <p className="text-start fs-5 ">{jobRequestDetails?.requestDetails?.maxBudget} $</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-sack-dollar mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Max budget
                                        </label>
                                        <p className="text-start fs-5 ">{jobRequestDetails?.requestDetails?.maxBudget} $</p>
                                    </div>
                                </div>
                            </div>

                            <div className='col-sm'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-location-dot mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Job location
                                        </label>
                                        <p className="text-start fs-5">{jobRequestDetails?.requestDetails?.jobLocation}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-clock mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Job tenure
                                        </label>
                                        <p className="text-start fs-5 ">{jobRequestDetails?.requestDetails?.jobTenure}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-sm-12'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-message mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Message
                                        </label>
                                        <p className="text-start fs-5 ">{jobRequestDetails?.requestDetails?.message}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interview Details */}
                <div className="row rounded-5 ps-4 pt-2 pe-4 pb-2" style={{ height: '100%', backgroundColor: 'white', display: interveiwSectionDisplay.displayMode }}>
                    <div className="row mt-3 mb-3">
                        <div className="col col-sm-8">
                            <span className="fw-bold text-start fs-4 mt-1">Interview details</span>
                        </div>
                        <div className="col col-sm-4 text-end">
                            {/* <button className="btn btn-success" type="button" data-bs-toggle="collapse" data-bs-target="#divInterviewDetailsCollapsable" aria-expanded="false" aria-controls="multiCollapseExample2" onClick={toggleCollapseIcon}> */}
                                <i id="iconCollapseInterviewDetails" className="fw-medium fa-thin fa-square-plus fs-4" data-bs-toggle="collapse" data-bs-target="#divInterviewDetailsCollapsable" aria-expanded="false" aria-controls="multiCollapseExample2" onClick={toggleCollapseIcon}></i>
                            {/* </button> */}
                        </div>
                    </div>
                    <div className="collapse" id="divInterviewDetailsCollapsable">
                        {
                            jobRequestDetails?.interviews?.map((interview, key) =>
                                <div className="row">
                                    <div className='col-sm'>
                                        <div className="d-flex flex-row">
                                            <i className="fa-thin fa-user mt-1 formIcon"></i>
                                            <div className='d-flex flex-column ms-2'>
                                                <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                    Candidate name
                                                </label>
                                                <a href='/#' className='fs-5' onClick={(event) => handleCandidateProfile(event,interview.candidateId)}>
                                                    {interview?.candidateName}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-sm'>
                                        <div className="d-flex flex-row">
                                            <i className="fa-thin fa-person-circle-check mt-1 formIcon"></i>
                                            <div className='d-flex flex-column ms-2'>
                                                <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                    Candidate status
                                                </label>
                                                <p className="text-start fs-5">{interview?.status}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-sm'>
                                        <div className="d-flex flex-row">
                                            <i className="fa-thin fa-calendar-days mt-1 formIcon"></i>
                                            <div className='d-flex flex-column ms-2'>
                                                <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                    Interview date
                                                </label>
                                                <p className="text-start fs-5">{interview?.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-sm'>
                                        <div className="d-flex flex-row">
                                            <i className="fa-thin fa-link mt-1 formIcon"></i>
                                            <div className='d-flex flex-column ms-2'>
                                                <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                    Interview link
                                                </label>
                                                <a href={interview?.link} className='fs-5'>
                                                    Join now
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col col-sm-12'>
                                        <div className="d-flex flex-row">
                                            <i className="fa-thin fa-comment mt-1 formIcon"></i>
                                            <div className='d-flex flex-column ms-2'>
                                                <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                    Comment
                                                </label>
                                                <p className="text-start fs-5">{interview?.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>

                <div className="mt-3 text-center">
                    <button type="button" className="btn btn-success mb-3" onClick={handleCencelNewRequest}>
                        <i className="fa-solid fa-arrow-left"></i>&nbsp;Go back
                    </button>
                </div>
            </div>
        </>
    )
}
export default CompanyRequestDetails