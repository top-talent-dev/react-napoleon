import { useState, useRef, useEffect } from 'react';
import AssignCandidateDialog from './AssignCandidateDialog'
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import AdminContractDialog from './AdminContractDialog';

const GET_ALL_REUESTS_URL = '/superadmin/getAllCompRequestJobs';
const GET_HIRED_REUESTS_URL = '/superadmin/getHiredCandidateList';
const GET_REJECTED_REUESTS_URL = '/superadmin/getRejectedCandidateList';
const GET_ALL_COMPANIES_URL = '/superadmin/getCompanyList';
const GET_ALL_CANDIDATES_URL = '/superadmin/getCandidateList';
const ZOOM_AUTH_URL = 'https://zoom.us/oauth/authorize?response_type=code&client_id=lnu34Rh8TKSsbMXdzsNiQ&redirect_uri=' + window.location.origin + '/Login';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [jobRequests, setJobRequests] = useState([]);
    const [hiredCandidates, setHiredCandidates] = useState([]);
    const [rejectedCandidates, setRejectedCandidates] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [candidateList, setCandidateList] = useState([]);
    const [assignCandidateData, setAssignCandidateData] = useState({});
    const [offerCandidateData, setOfferCandidateData] = useState({});
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const runOnce = true;
    
    useEffect(() => {
        console.log('i fire once');
        fetchReuestList();
        fetchHiredList();
        fetchRejectedList();
        fetchCompanyList();
        fetchCandidateList();
    }, [runOnce]);

    const fetchReuestList = async () => {
        try {
            const response = await axiosPrivate.get(GET_ALL_REUESTS_URL, {});
            console.log(JSON.stringify(response?.data));
            const fetchReuestListStatus = response?.data?.status;
            const fetchReuestListSuccess = response?.data?.success;

            if (fetchReuestListSuccess) {
                setJobRequests(response?.data?.data?.jobs);
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

    const fetchHiredList = async () => {
        try {
            const response = await axiosPrivate.get(GET_HIRED_REUESTS_URL, {});
            console.log(JSON.stringify(response?.data));
            const fetchHiredListStatus = response?.data?.status;
            const fetchHiredListSuccess = response?.data?.success;

            if (fetchHiredListStatus) {
                setHiredCandidates(response?.data?.data?.hiredCandidates);
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

    const fetchRejectedList = async () => {
        try {
            const response = await axiosPrivate.get(GET_REJECTED_REUESTS_URL, {});
            console.log(JSON.stringify(response?.data));
            const fetchRejectedListStatus = response?.data?.status;
            const fetchRejectedListSuccess = response?.data?.success;

            if (fetchRejectedListStatus) {
                setRejectedCandidates(response?.data?.data?.rejectedCandidates);
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

    const fetchCompanyList = async () => {
        try {
            const response = await axiosPrivate.get(GET_ALL_COMPANIES_URL, {});
            console.log(JSON.stringify(response?.data));
            const fetchCompanyListStatus = response?.data?.status;
            const fetchCompanyListSuccess = response?.data?.success;

            if (fetchCompanyListSuccess) {
                setCompanyList(response?.data?.data?.companies);
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

    const fetchCandidateList = async () => {
        try {
            const response = await axiosPrivate.get(GET_ALL_CANDIDATES_URL, {});
            console.log(JSON.stringify(response?.data));
            const fetchCandidateListStatus = response?.data?.status;
            const fetchCandidateListSuccess = response?.data?.success;

            if (fetchCandidateListSuccess) {
                setCandidateList(response?.data?.data?.candidates);
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

    const [displayMode, setDisplayMode] = useState({
        selectRequestRadio: true,
        selectHiredRadioSelect: false,
        selectRejectedRadioSelect: false,
        selectCompanyRadioSelect: false,
        selectCandidateRadioSelect: false,
        displayRequested: 'block',
        displayHired: 'none',
        displayRejected: 'none',
        displayCompanies: 'none',
        displayCandidates: 'none'
    });

    function handleReportType(event) {
        if (event.target.value === 'Requested') {
            setDisplayMode({
                selectRequestRadio: true,
                selectHiredRadioSelect: false,
                selectRejectedRadioSelect: false,
                selectCompanyRadioSelect: false,
                selectCandidateRadioSelect: false,
                displayRequested: 'block',
                displayHired: 'none',
                displayRejected: 'none',
                displayCompanies: 'none',
                displayCandidates: 'none'
            });
        } else if (event.target.value === 'Hired') {
            setDisplayMode({
                selectRequestRadio: false,
                selectHiredRadioSelect: true,
                selectRejectedRadioSelect: false,
                selectCompanyRadioSelect: false,
                selectCandidateRadioSelect: false,
                displayRequested: 'none',
                displayHired: 'block',
                displayRejected: 'none',
                displayCompanies: 'none',
                displayCandidates: 'none'
            });
        } else if (event.target.value === 'Rejected') {
            setDisplayMode({
                selectRequestRadio: false,
                selectHiredRadioSelect: false,
                selectRejectedRadioSelect: true,
                selectCompanyRadioSelect: false,
                selectCandidateRadioSelect: false,
                displayRequested: 'none',
                displayHired: 'none',
                displayRejected: 'block',
                displayCompanies: 'none',
                displayCandidates: 'none'
            });
        } else if (event.target.value === 'Companes') {
            setDisplayMode({
                selectRequestRadio: false,
                selectHiredRadioSelect: false,
                selectRejectedRadioSelect: false,
                selectCompanyRadioSelect: true,
                selectCandidateRadioSelect: false,
                displayRequested: 'none',
                displayHired: 'none',
                displayRejected: 'none',
                displayCompanies: 'block',
                displayCandidates: 'none'
            });
        } else if (event.target.value === 'Candidates') {
            setDisplayMode({
                selectRequestRadio: false,
                selectHiredRadioSelect: false,
                selectRejectedRadioSelect: false,
                selectCompanyRadioSelect: false,
                selectCandidateRadioSelect: true,
                displayRequested: 'none',
                displayHired: 'none',
                displayRejected: 'none',
                displayCompanies: 'none',
                displayCandidates: 'block'
            });
        }
    }

    function handleAssignCandidatesDialog(event, requestId, key) {
        if (jobRequests[key].requestId === requestId) {
            var data = {};
            data.candidates = candidateList;
            data.jobRequest = jobRequests[key];

            setAssignCandidateData(data);
        }
    }

    function handleOfferCandidatesDialog(event, requestId, key) {
        if (jobRequests[key].requestId === requestId) {
            var data = {};
            data.jobRequest = jobRequests[key];

            setOfferCandidateData(data);
        }
    }

    function handleViewRequestDetails(event, jobRequestId) {
        navigate('/Admin/RequestDetails', { state: { id: jobRequestId } });
    }

    function handleViewCompanyProfile(event, companyId) {
        navigate('CompanyProfile', { state: { id: companyId } });
    }

    function handleViewCandidateProfile(event, candidateId) {
        navigate('CandidateProfile', { state: { id: candidateId } });
    }

    return (
        <>
            <Tooltip id='napoleon-tooltip' />
            <AdminContractDialog resources={offerCandidateData} />

            <div className='container mt-3' style={{ maxWidth: '95%', height: 'max-content' }}>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <div className='row'>
                    <div className='col-sm'>
                        <p className='text-left fs-3 fw-bold' style={{color: '#B18818'}}>Napoleone administrator dashboard</p>
                    </div>
                    <div className='col-sm text-end'>
                        <div className='btn-group' role='group' aria-label='Basic radio toggle button group'>
                            <input type='radio' className='btn-check' name='rdoRequested' id='rdoRequested' autoComplete='off' value='Requested' onChange={handleReportType} checked={displayMode.selectRequestRadio} />
                            <label className='btn btn-outline-primary fw-normal' htmlFor='rdoRequested'>Requested</label>

                            <input type='radio' className='btn-check' name='rdoHired' id='rdoHired' autoComplete='off' value='Hired' onChange={handleReportType} checked={displayMode.selectHiredRadioSelect} />
                            <label className='btn btn-outline-primary fw-normal' htmlFor='rdoHired'>Hired</label>

                            <input type='radio' className='btn-check' name='rdoRejected' id='rdoRejected' autoComplete='off' value='Rejected' onChange={handleReportType} checked={displayMode.selectRejectedRadioSelect} />
                            <label className='btn btn-outline-primary fw-normal' htmlFor='rdoRejected'>Rejected</label>

                            <input type='radio' className='btn-check' name='rdoCompanies' id='rdoCompanies' autoComplete='off' value='Companes' onChange={handleReportType} checked={displayMode.selectCompanyRadioSelect} />
                            <label className='btn btn-outline-primary fw-normal  d-none d-md-block' htmlFor='rdoCompanies'>Company</label>

                            <input type='radio' className='btn-check' name='rdoCandidates' id='rdoCandidates' autoComplete='off' value='Candidates' onChange={handleReportType} checked={displayMode.selectCandidateRadioSelect} />
                            <label className='btn btn-outline-primary fw-normal d-none d-md-block' htmlFor='rdoCandidates'>Candidate</label>
                        </div>
                    </div>
                </div>

                <div className='row rounded-5 ps-4 pt-2 pe-4 pb-2' style={{ backgroundColor: 'white' }}>
                    {/* <form className='row g-3 ms-3 mb-4' style={{ width: '97%' }}>
                        <div className='col-md-3 mt-2'>
                            <label for='txtCompanyName' className='form-label fs-5 fw-medium text-start mb-1'>Company name</label>
                            <input type='email' className='form-control' id='txtCompanyName' />
                        </div>
                        <div className='col-md-3 mt-2'>
                            <label for='txtCompanyName' className='form-label fs-5 fw-medium text-start mb-1'>Industry</label>
                            <select className='form-select' aria-label='Default select example'>
                                <option selected>Select</option>
                                <option value='1'>Manufacturing</option>
                                <option value='2'>Aerospace & Defense</option>
                                <option value='3'>Life Science</option>
                                <option value='1'>Utility</option>
                                <option value='2'>CPG</option>
                                <option value='3'>Financial Services</option>
                            </select>
                        </div>
                        <div className='col-md-3 mt-2'>
                            <label for='txtCompanyName' className='form-label fs-5 fw-medium text-start mb-1'>Role</label>
                            <select className='form-select' aria-label='Default select example'>
                                <option selected>Select</option>
                                <option value='1'>Developer</option>
                                <option value='2'>Senior Developer</option>
                                <option value='3'>Manager</option>
                                <option value='1'>Architect</option>
                                <option value='2'>Solution Architect</option>
                                <option value='3'>Enterprise Architect</option>
                            </select>
                        </div>
                        <div className='col-md-3 mt-2'>
                            <label for='txtCompanyName' className='form-label fs-5 fw-medium text-start mb-1'>Opportunity Type</label>
                            <select className='form-select' aria-label='Default select example'>
                                <option selected>Select</option>
                                <option value='1'>Full time</option>
                                <option value='2'>Part time</option>
                                <option value='3'>Contract</option>
                                <option value='1'>On demand</option>
                            </select>
                        </div>
                        <div className='col-md-3 mt-2'>
                            <label for='txtCompanyName' className='form-label fs-5 fw-medium text-start mb-1'>Years of Experience</label>
                            <select className='form-select' aria-label='Default select example'>
                                <option selected>Select</option>
                                <option value='1'>2 to 5 Years</option>
                                <option value='2'>5 to 10 Years</option>
                                <option value='3'>10 to 15 Years</option>
                                <option value='1'>15 to 20 Years</option>
                                <option value='1'>More than 20 Years</option>
                            </select>
                        </div>
                        <div className='col-md-3 mt-2'>
                            <label for='txtCompanyName' className='form-label fs-5 fw-medium text-start mb-1'>Request status</label>
                            <select className='form-select' aria-label='Default select example'>
                                <option selected>Select</option>
                                <option value='1'>Open</option>
                                <option value='2'>Interview scheduled</option>
                                <option value='3'>Decision pending</option>
                                <option value='1'>In-progress</option>
                                <option value='1'>Closed</option>
                                <option value='1'>Rejected</option>
                                <option value='1'>Selected</option>
                            </select>
                        </div>
                        <div className='col-md-3 mt-2'>
                            <button type='button' className='btn btn-primary mt-4 w-50'>Search</button>
                        </div>
                    </form> */}

                    {/* Requested section */}
                    <div className='row table-responsive-sm text-nowrap rounded mt-3 ms-auto me-auto pb-2' style={{ display: displayMode.displayRequested }}>
                        <AssignCandidateDialog resources={assignCandidateData} />
                        <div className='d-flex'>
                            <div className='text-start'>
                                <p className='text-left fs-4 fw-bold'>Total {jobRequests?.length} requests found</p>
                            </div>
                        </div>
                        <table className='table table-striped table-light table-hover fs-5'>
                            <thead>
                                <tr>
                                    <th scope='col' className='text-center'>#</th>
                                    <th scope='col' className='text-center'>Company name</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Industry</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Available role</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Type</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Experience</th>
                                    {/* <th scope='col' className='text-center'>Requested on</th> */}
                                    <th scope='col' className='text-center'>Status</th>
                                    <th scope='col' className='text-center'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    jobRequests.map((job, key) =>
                                        <tr key={key}>
                                            <th scope='row' className='text-center'>{key + 1}</th>
                                            <td className='text-center'>{job?.companyName}</td>
                                            <td className='text-center d-none d-md-table-cell'>{job?.industry}</td>
                                            <td className='text-center d-none d-md-table-cell'>{job?.requestedRole}</td>
                                            <td className='text-center d-none d-md-table-cell'>{job?.jobType}</td>
                                            <td className='text-center d-none d-md-table-cell'>{job?.experience}</td>
                                            {/* <td className='text-center'>Mar 23 2023, 13:26:41</td> */}
                                            <td className='text-center'>{job?.status}</td>
                                            <td className='text-center'>
                                                {/* <button type='button' className='btn me-3 p-0' onClick={(event) => handleViewRequestDetails(event, job.requestId)} data-tooltip-id='napoleon-tooltip' data-tooltip-content='View request details'> */}
                                                    <i className='fa-light fa-eye fs-4' style={{ cursor: 'pointer'}} onClick={(event) => handleViewRequestDetails(event, job.requestId)} data-tooltip-id='napoleon-tooltip' data-tooltip-content='View request details'></i>
                                                {/* </button> */}
                                                {/* <button type='button' className='btn p-0'> */}
                                                    <i className='fa-light fa-bullseye fs-4 ms-3' style={{ cursor: 'pointer'}} onClick={(event) => handleAssignCandidatesDialog(event, job.requestId, key)} data-bs-toggle='modal' data-bs-target='#assignCandidateDialog' data-tooltip-id='napoleon-tooltip' data-tooltip-content='Assign candidates'></i>
                                                {/* </button> */}
                                                {/* <button type='button' className='btn p-0 ms-3' style={{visibility: job?.status === 'hired' ? 'visible' : 'hidden'}} onClick={(event) => handleOfferCandidatesDialog(event, job.requestId, key)} data-bs-toggle='modal' data-bs-target='#uploadNapoleonContractDialog' data-tooltip-id='napoleon-tooltip' data-tooltip-content='Upload contract'> */}
                                                    <i className='fa-light fa-file-signature fs-4 ms-3' style={{ cursor: 'pointer', visibility: job?.status === 'hired' ? 'visible' : 'hidden' }} onClick={(event) => handleOfferCandidatesDialog(event, job.requestId, key)} data-bs-toggle='modal' data-bs-target='#uploadNapoleonContractDialog' data-tooltip-id='napoleon-tooltip' data-tooltip-content='Upload contract'></i>
                                                {/* </button> */}
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                    {/* Hired section */}
                    <div className='row table-responsive-sm text-nowrap rounded mt-3 ms-auto me-auto pb-2' style={{ display: displayMode.displayHired }}>
                        <p className='text-left fs-4 fw-bold ms-3'>Total {hiredCandidates?.length} records found</p>
                        <table className='table table-striped table-light table-hover fs-5'>
                            <thead>
                                <tr>
                                    <th scope='col' className='text-center'>#</th>
                                    <th scope='col' className='text-center'>Candidate Name</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Email</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Contact No</th>
                                    {/* <th scope='col' className='text-center d-none d-md-table-cell'>Company Name</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Contact Name</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Contact Email</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Contact No</th>
                                    <th scope='col' className='text-center'>Start Date</th>
                                    <th scope='col' className='text-center'>End Date</th> */}
                                    <th scope='col' className='text-center'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    hiredCandidates?.map((hiredCandidate, key) =>
                                        <tr key={key}>
                                            <th scope='row' className='text-center'>{key + 1}</th>
                                            <td className='text-center'>{hiredCandidate?.basicInfo?.firstName} {hiredCandidate?.basicInfo?.lastName}</td>
                                            <td className='text-center d-none d-md-table-cell'>{hiredCandidate?.basicInfo?.email}</td>
                                            <td className='text-center d-none d-md-table-cell'>{hiredCandidate?.basicInfo?.phone}</td>
                                            {/* <td className='text-center d-none d-md-table-cell'>{hiredCandidate?.first_name}</td>
                                            <td className='text-center d-none d-md-table-cell'>{hiredCandidate?.first_name}</td>
                                            <td className='text-center d-none d-md-table-cell'>{hiredCandidate?.first_name}</td>
                                            <td className='text-center d-none d-md-table-cell'>{hiredCandidate?.first_name}</td>
                                            <td className='text-center'>Jun 05 2023</td>
                                            <td className='text-center'>Feb 28 2024</td> */}
                                            <td className='text-center'>
                                                {/* <button type='button' className='btn p-0' data-tooltip-id='napoleon-tooltip' data-tooltip-content='View request details'> */}
                                                    <i className='fa-light fa-eye fs-4' style={{ cursor: 'pointer'}} data-tooltip-id='napoleon-tooltip' data-tooltip-content='View request details'></i>
                                                {/* </button> */}
                                                {/* <button type='button' className='btn ms-2 p-0' data-tooltip-id='napoleon-tooltip' data-tooltip-content='Upload contract for signing'>
                                                    <i className='fa-light fa-file-signature fs-4' style={{ cursor: 'pointer' }}></i>
                                                </button> */}
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                    {/* Rejected section */}
                    <div className='row table-responsive-sm text-nowrap rounded mt-3 ms-auto me-auto pb-2' style={{ display: displayMode.displayRejected }}>
                        <p className='text-left fs-4 fw-bold ms-3'>Total 6 records found</p>
                        <table className='table table-striped table-light table-hover fs-5'>
                            <thead>
                                <tr>
                                    <th scope='col' className='text-center'>#</th>
                                    <th scope='col' className='text-center'>Candidate Name</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Email</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Contact No</th>
                                    {/* <th scope='col' className='text-center'>Company Name</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Contact Name</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Contact Email</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Contact No</th> */}
                                    <th scope='col' className='text-center'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    rejectedCandidates?.map((rejectedCandidate, key) =>
                                        <tr key={key}>
                                            <th scope='row' className='text-center'>{key + 1}</th>
                                            <td className='text-center'>{rejectedCandidate?.basicInfo?.firstName} {rejectedCandidate?.basicInfo?.lastName}</td>
                                            <td className='text-center d-none d-md-table-cell'>{rejectedCandidate?.basicInfo?.email}</td>
                                            <td className='text-center d-none d-md-table-cell'>{rejectedCandidate?.basicInfo?.phone}</td>
                                            {/* <td className='text-center'>Plaxonic Technologies</td>
                                            <td className='text-center d-none d-md-table-cell'>James Bond</td>
                                            <td className='text-center d-none d-md-table-cell'>james.bond@sparkadvisory.com</td>
                                            <td className='text-center d-none d-md-table-cell'>1234567890</td> */}
                                            <td className='text-center'>
                                                {/* <button type='button' className='btn p-0' data-tooltip-id='napoleon-tooltip' data-tooltip-content='View request details'> */}
                                                    <i className='fa-light fa-eye fs-4' style={{ cursor: 'pointer'}} data-tooltip-id='napoleon-tooltip' data-tooltip-content='View request details'></i>
                                                {/* </button> */}
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                    {/* Companies Section */}
                    <div className='row table-responsive-sm text-nowrap rounded mt-3 ms-auto me-auto pb-2' style={{ display: displayMode.displayCompanies }}>
                        <p className='text-left fs-4 fw-bold ms-3'>Total 6 records found</p>
                        <table className='table table-striped table-light table-hover fs-5'>
                            <thead>
                                <tr>
                                    <th scope='col' className='text-center'>#</th>
                                    <th scope='col' className='text-center'>Company Name</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Industry</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Contact Name</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Title</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Contact Email</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Contact No</th>
                                    {/* <th scope='col' className='text-center'>Registered On</th> */}
                                    {/* <th scope='col' className='text-center'>Status</th> */}
                                    <th scope='col' className='text-center'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    companyList?.map((company, key) =>
                                        <tr key={key}>
                                            <th scope='row' className='text-center'>{key + 1}</th>
                                            <td className='text-center'>{company?.name}</td>
                                            <td className='text-center d-none d-md-table-cell'>{company?.business?.industry}</td>
                                            <td className='text-center d-none d-md-table-cell'>{company?.contant?.designation}</td>
                                            <td className='text-center d-none d-md-table-cell'>{company?.contant?.name}</td>
                                            <td className='text-center d-none d-md-table-cell'>{company?.contant?.email}</td>
                                            <td className='text-center d-none d-md-table-cell'>{company?.contant?.phone}</td>
                                            {/* <td className='text-center'>Feb 14 2023</td> */}
                                            {/* <td className='text-center'>Active</td> */}
                                            <td className='text-center'>
                                                {/* <button type='button' className='btn p-0' onClick={(event) => handleViewCompanyProfile(event, company.id)} data-tooltip-id='napoleon-tooltip' data-tooltip-content='View company details'> */}
                                                    <i className='fa-light fa-eye fs-4' style={{ cursor: 'pointer'}} onClick={(event) => handleViewCompanyProfile(event, company.id)} data-tooltip-id='napoleon-tooltip' data-tooltip-content='View company details'></i>
                                                {/* </button> */}
                                                {/* <button type='button' className='btn p-0' data-tooltip-id='napoleon-tooltip' data-tooltip-content='Delete company'>
                                                    <i className='fa-light fa-trash fs-4'></i>
                                                </button> */}
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                    {/* Candidates Section */}
                    <div className='row table-responsive-sm text-nowrap rounded mt-3 ms-auto me-auto pb-2' style={{ display: displayMode.displayCandidates }}>
                        <p className='text-left fs-4 fw-bold ms-3'>Total 6 records found</p>
                        <table className='table table-striped table-light table-hover fs-5'>
                            <thead>
                                <tr>
                                    <th scope='col' className='text-center'>#</th>
                                    <th scope='col' className='text-center'>Candidate Name</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Email</th>
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Industry</th>
                                    {/* <th scope='col' className='text-center d-none d-md-table-cell'>Contact No</th> */}
                                    {/* <th scope='col' className='text-center d-none d-md-table-cell'>Experience</th> */}
                                    <th scope='col' className='text-center d-none d-md-table-cell'>Current Role</th>
                                    {/* <th scope='col' className='text-center'>Registered On</th> */}
                                    {/* <th scope='col' className='text-center'>Status</th> */}
                                    <th scope='col' className='text-center'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    candidateList?.map((candidate, key) =>
                                        <tr key={key}>
                                            <th scope='row' className='text-center'>{key + 1}</th>
                                            <td className='text-center'>{candidate?.basicInfo?.firstName} {candidate?.basicInfo?.lastName}</td>
                                            <td className='text-center d-none d-md-table-cell'>{candidate?.basicInfo?.email}</td>
                                            <td className='text-center d-none d-md-table-cell'>{candidate?.basicInfo?.industry}</td>
                                            {/* <td className='text-center d-none d-md-table-cell'>1234567890</td> */}
                                            {/* <td className='text-center d-none d-md-table-cell'>12 Years</td> */}
                                            <td className='text-center d-none d-md-table-cell'>{candidate?.basicInfo?.currentJobTitle}</td>
                                            {/* <td className='text-center'>23 March 2023</td> */}
                                            {/* <td className='text-center'>{candidate.status}</td> */}
                                            <td className='text-center'>
                                                {/* <button type='button' className='btn p-0' onClick={(event) => handleViewCandidateProfile(event, candidate.candidateId)} data-tooltip-id='napoleon-tooltip' data-tooltip-content='View request details'> */}
                                                    <i className='fa-light fa-eye fs-4' style={{ cursor: 'pointer'}} onClick={(event) => handleViewCandidateProfile(event, candidate.candidateId)} data-tooltip-id='napoleon-tooltip' data-tooltip-content='View request details'></i>
                                                {/* </button> */}
                                                {/* <button type='button' className='btn p-0' data-tooltip-id='napoleon-tooltip' data-tooltip-content='Delete candidate'>
                                                    <i className='fa-light fa-trash fs-4'></i>
                                                </button> */}
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div >
        </>
    )
}
export default AdminDashboard