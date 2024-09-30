import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

var GET_JOB_REQUEST_DETAILS_BASE = '/superadmin/getJobDetail';
var GET_JOB_REQUEST_DETAILS = '';

const AdminViewRequestDetails = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [requestData, setRequestData] = useState({});
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const runOnce = true;

    useEffect(() => {
        console.log('i fire once');
        if (state?.id) {
            console.log('Company ID: ' + state.id);
            GET_JOB_REQUEST_DETAILS = GET_JOB_REQUEST_DETAILS_BASE + '/' + state.id;
            fetchRequestData();
        }
    }, [runOnce]);

    const fetchRequestData = async () => {
        try {
            const response = await axiosPrivate.get(GET_JOB_REQUEST_DETAILS, {});
            console.log(JSON.stringify(response?.data));
            const fetchStatus = response?.data?.status;
            const fetchSuccess = response?.data?.success;

            if (fetchSuccess) {
                setRequestData(response?.data?.data?.job);
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
        navigate('/Admin/Dashboard');
    }

    return (
        <>
            <div className="container mt-3" style={{ maxWidth: '95%', height: 'max-content' }}>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <p className='fs-3 fw-medium mt-2 mb-2'>Request No 12345</p>
                <div className="row rounded-5 ps-4 pt-2 pe-4 pb-2" style={{ backgroundColor: 'white' }}>
                    <div className="row">
                        <div className='col-sm'>
                            <label htmlFor="txtExperience" className="col-form-label fw-medium text-start fs-5 mb-">
                                <i className="fas fa-address-card"></i>&nbsp;Contact person
                            </label>
                            <p className="text-start fs-5">{requestData?.agent?.contactName}</p>
                        </div>
                        <div className='col-sm'>
                            <label className="col-form-label fw-medium text-start fs-5">
                                <i className="fas fa-at"></i>&nbsp;Contact email
                            </label>
                            <p className="text-start fs-5">{requestData?.agent?.contactEmail}</p>
                        </div>
                        <div className='col-sm'>
                            <label htmlFor="txtExperience" className="col-form-label fw-medium text-start fs-5">
                                <i className="fas fa-phone"></i>&nbsp;Contact phone
                            </label>
                            <p className="text-start fs-5">{requestData?.agent?.contactPhone}</p>
                        </div>
                    </div>
                </div>
                <div className="row rounded-4 mt-3 pb-2 ps-3" style={{ height: '100%', backgroundColor: 'white' }}>
                    <div className="row mt-3">
                        <div className="col col-sm-8">
                            <p className="fw-medium text-start fs-4 mt-1"><i className="fas fa-receipt"></i> &nbsp;Request details</p>
                        </div>
                        <div className="col col-sm-4 text-end">
                            <button className="btn" type="button" data-bs-toggle="collapse" data-bs-target="#divRequestDetailsCollapsable" aria-expanded="false" aria-controls="multiCollapseExample2" onClick={toggleCollapseIcon}>
                                <i id="iconCollapseRequestDetails" className="fw-medium fas fa-square-minus fs-4"></i>
                            </button>
                        </div>
                    </div>
                    <div className="collapse show" id="divRequestDetailsCollapsable">
                        <div className="row">
                            <div className='col-sm'>
                                <label className="col-form-label fw-medium fs-5">
                                    <i className="fas fa-pen-nib"></i>&nbsp;Job title
                                </label>
                                <p className="text-start fs-5">{requestData?.requestDetails?.jobTitle}</p>
                            </div>
                            <div className='col-sm'>
                                <label className="col-form-label fw-medium fs-5">
                                    <i className="fas fa-briefcase"></i>&nbsp;Desired experience
                                </label>
                                <p className="text-start fs-5">{requestData?.requestDetails?.experience}</p>
                            </div>
                            <div className='col-sm'>
                                <label className="col-form-label fw-medium fs-5 ">
                                    <i className="fas fa-industry"></i>&nbsp;Industry
                                </label>
                                <p className="text-start fs-5 ">{requestData?.requestDetails?.industry}</p>
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="txtExperience" className="col-form-label fw-medium fs-5 ">
                                    <i className="fas fa-building"></i>&nbsp;Sub-industry
                                </label>
                                <p className="text-start fs-5 ">{requestData?.requestDetails?.subIndustry}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-sm'>
                                <label className="col-form-label fw-medium fs-5 ">
                                    <i className="fas fa-user-doctor"></i>&nbsp;Job type
                                </label>
                                <p className="text-start fs-5 ">{requestData?.requestDetails?.jobType}</p>
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="txtExperience" className="col-form-label fw-medium fs-5 ">
                                    <i className="fas fa-person-circle-check"></i>&nbsp;Work authorization
                                </label>
                                <p className="text-start fs-5 ">{requestData?.requestDetails?.workAuth}</p>
                            </div>
                            <div className='col-sm'>
                                <label className="col-form-label fw-medium fs-5 ">
                                    <i className="fas fa-book"></i>&nbsp;Required sills
                                </label>
                                <p className="text-start fs-5 ">{requestData?.requestDetails?.napoleonCandidatePhone}</p>
                            </div>
                            <div className='col-sm'>
                                <label className="col-form-label fw-medium fs-5 ">
                                    <i className="fas fa-laptop-file"></i>&nbsp;Working mode
                                </label>
                                <p className="text-start fs-5 ">{requestData?.requestDetails?.workingMode}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-sm'>
                                <label htmlFor="txtExperience" className="col-form-label fw-medium fs-5 ">
                                    <i className="fas fa-sack-dollar"></i>&nbsp;Min Budget ($)
                                </label>
                                <p className="text-start fs-5 ">{requestData?.requestDetails?.napoleonCandidatePhone}</p>
                            </div>
                            <div className='col-sm'>
                                <label htmlFor="txtExperience" className="col-form-label fw-medium fs-5 ">
                                    <i className="fas fa-sack-dollar"></i>&nbsp;Max Budget ($)
                                </label>
                                <div className="col-sm-1">
                                    <p className="text-start fs-5 ">{requestData?.requestDetails?.maxBudget}</p>
                                </div>
                            </div>

                            <div className='col-sm'>
                                <label htmlFor="txtExperience" className="col-form-label fw-medium fs-5 ">
                                    <i className="fas fa-location-dot"></i>&nbsp;Job location
                                </label>
                                <p className="text-start fs-5 ">{requestData?.requestDetails?.jobLocation}</p>
                            </div>
                            <div className='col-sm'>
                                <label className="col-form-label fw-medium fs-5 ">
                                    <i className="fas fa-clock"></i>&nbsp;Job tenure (Months)
                                </label>
                                <p className="text-start fs-5 ">{requestData?.requestDetails?.jobTenure}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-sm-12'>
                                <label htmlFor="txtExperience" className="col-form-label fw-medium fs-5 ">
                                    <i className="fas fa-message"></i>&nbsp;Message
                                </label>
                                <p className="text-start fs-5 ">{requestData?.requestDetails?.message}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interview Details */}
                <div className="row rounded-4 mt-3 me3 pb-2 ps-3" style={{ height: '100%', backgroundColor: 'white' }}>
                    <div className="row mt-3">
                        <div className="col col-sm-8">
                            <span className="fw-medium text-start fs-4 mt-1"><i className="fas fa-clipboard-question"></i> &nbsp;Interview details</span>
                            {/* <button className="btn btn-secondary fs-5 fw-medium ms-2" type="button">
                                <i id="iconCollapseInterviewDetails" className="fas fa-bullseye fs-4 me-1"></i>&nbsp;Assign
                            </button> */}
                        </div>
                        <div className="col col-sm-4 text-end">
                            <button className="btn" type="button" data-bs-toggle="collapse" data-bs-target="#divInterviewDetailsCollapsable" aria-expanded="false" aria-controls="multiCollapseExample2" onClick={toggleCollapseIcon}>
                                <i id="iconCollapseInterviewDetails" className="fw-medium fas fa-square-plus fs-4"></i>
                            </button>
                        </div>
                    </div>
                    <div className="collapse" id="divInterviewDetailsCollapsable">
                        {
                            requestData?.interviews?.map((interview, key) =>
                                <div className="row">
                                    <div className='col-sm'>
                                        <label className="col-form-label fw-medium text-start fs-5">
                                            <i className="fas fa-user"></i>&nbsp;Candidate name
                                        </label>
                                        <p className="text-start fs-5">{interview.candidateName}</p>
                                    </div>
                                    <div className='col-sm'>
                                        <label className="col-form-label fw-medium text-start fs-5">
                                            <i className="fas fa-check"></i>&nbsp;Candidate status
                                        </label>
                                        <p className="text-start fs-5">{interview.status}</p>
                                    </div>
                                    <div className='col-sm'>
                                        <label className="col-form-label fw-medium text-start fs-5">
                                            <i className="fas fa-calendar-days"></i>&nbsp;Interview date
                                        </label>
                                        <p className="text-start fs-5">{interview.date}</p>
                                    </div>
                                    <div className='col-sm'>
                                        <label className="col-form-label fw-medium text-start fs-5">
                                            <i className="fas fa-link"></i>&nbsp;Interview link
                                        </label>

                                        <div className="fs-5">
                                            <a href={interview.link}>
                                                Join now
                                            </a>
                                            {/* <button type="button" className="btn btn-secondary fs-6 mb-3">
                                                <i className="fa-solid fa-calendar-days"></i>&nbsp;&nbsp;Schedule
                                            </button> */}

                                        </div>
                                    </div>
                                    <div className='col col-sm-12'>
                                        <label className="col-form-label fw-medium text-start fs-5">
                                            <i className="fas fa-comment"></i>&nbsp;Comment
                                        </label>
                                        <p className="text-start fs-5">{interview.comment}</p>
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
export default AdminViewRequestDetails