import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import CompanyContractUploadDialog from './CompanyContractUploadDialog';
import DocumentSign from '../General/DocumentSign';

const REQUESTED_JOBS_URL = '/company/getRequestedJobs';
const HIRED_CANDIDATES_URL = '/company/getRequestedJobs';
const REJECTED_CANDIDATES_URL = '/company/getRequestedJobs';

const CompanyDashboard = () => {
    const navigate = useNavigate();
    const [jobRequests, setJobRequests] = useState([]);
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const runOnce = true;
    const [offerCandidateData, setOfferCandidateData] = useState({});

    useEffect(() => {
        console.log('i fire once');
        fetchData();
    }, [runOnce]);

    const fetchData = async () => {
        try {
            const response = await axiosPrivate.get(REQUESTED_JOBS_URL, {});
            console.log(JSON.stringify(response?.data));
            const fetchStatus = response?.data?.status;
            const fetchSuccess = response?.data?.success;

            if (fetchSuccess) {
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

    function handleNewRequest(event) {
        navigate('/Company/CreateRequest');
    }

    function handleViewRequest(event, jobRequestId) {
        navigate('/Company/RequestDetails', {
            state: {
                id: jobRequestId
            }
        });
    }

    const [displayMode, setDisplayMode] = useState({
        requestRadioSelect: true,
        hiredRadioSelect: false,
        rejectedRadioSelect: false,
        requestedDisplay: 'block',
        hiredDisplay: 'none',
        rejectedDisplay: 'none'
    });

    function handleReportType(event) {
        if (event.target.value === 'Requested') {
            setDisplayMode({
                requestRadioSelect: true,
                hiredRadioSelect: false,
                rejectedRadioSelect: false,
                requestedDisplay: 'block',
                hiredDisplay: 'none',
                rejectedDisplay: 'none'
            });
        } else if (event.target.value === 'Hired') {
            setDisplayMode({
                requestRadioSelect: false,
                hiredRadioSelect: true,
                rejectedRadioSelect: false,
                requestedDisplay: 'none',
                hiredDisplay: 'block',
                rejectedDisplay: 'none'
            });
        } else if (event.target.value === 'Rejected') {
            setDisplayMode({
                requestRadioSelect: false,
                hiredRadioSelect: false,
                rejectedRadioSelect: true,
                requestedDisplay: 'none',
                hiredDisplay: 'none',
                rejectedDisplay: 'block'
            });
        }
    }

    function handleCompanyOfferUploadDialog(event, requestId, key) {
        if (jobRequests[key].requestId === requestId) {
            var data = {};
            data.jobRequest = jobRequests[key];

            setOfferCandidateData(data);
        }
    }

    return (
        <>
            <Tooltip id='napoleon-tooltip' />
            <CompanyContractUploadDialog resources={offerCandidateData} />
            <DocumentSign />
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <div className='container mt-3' style={{ maxWidth: '95%', height: 'max-content' }}>
                <div className='row'>
                    <div className='col col-lg-4'>
                        <p className='text-left fs-3 fw-bold' style={{ width: '50%' }}>Resources</p>
                    </div>
                    <div className='col col-lg-4'>
                        <select id='selRequested' className="form-select ms-auto me-auto" aria-label="Select filter" defaultValue='Raised' style={{width:'fit-content'}} onChange={handleReportType}>
                            <option value="Requested">Requested</option>
                            <option value="Hired">Hired</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div className='col col-lg-4 text-end'>
                        <button type='button' className='btn btn-success rounded-5 btn-sm fw-medium' onClick={handleNewRequest} data-tooltip-id='napoleon-tooltip' data-tooltip-content='Create new resource request'>
                            <i className='fa-light fa-plus fs-5 me-1'></i>&nbsp;New request
                        </button>
                    </div>
                </div>

                <div className='row rounded-5 mt-2 ps-4 pe-4 pb-2' style={{ height: '100%', backgroundColor: 'white', borderRadius: '20px', display: displayMode.requestedDisplay }}>
                    <div className="d-flex">
                        <div className="p-2 flex-grow-1">
                            <p className='text-left fs-5 fw-bold mt-2 ms-3 pt-3'>Total {jobRequests.length} requests found</p>
                        </div>
                        <div className="p-2">
                            <button type='button' className='btn btn-success rounded-4 btn-sm fw-medium mt-3 me-2' style={{ height: 'fit-content' }} data-bs-toggle='modal' data-bs-target='#signDocumentDialog' data-tooltip-id='napoleon-tooltip' data-tooltip-content='Digitally sign document'>
                                <img src={require('../../images/Signwell.ico')} alt='Signwell' className='rounded-circle me-1' style={{ height: '20px', width: '20px' }} />
                                Document sign
                            </button>
                        </div>
                    </div>
                    <table className='table table-striped table-light table-hover ms-auto me-auto fs-5' style={{ width: '95%' }}>
                        <thead>
                            <tr>
                                <th scope='col' className='text-center'>#</th>
                                <th scope='col' className='text-center'>Job title</th>
                                <th scope='col' className='text-center d-none d-md-table-cell'>Industry</th>
                                <th scope='col' className='text-center d-none d-md-table-cell'>Job type</th>
                                <th scope='col' className='text-center d-none d-md-table-cell'>Experience</th>
                                {/* <th scope='col' className='text-center'>Requested on</th> */}
                                <th scope='col' className='text-center'>Status</th>
                                <th scope='col' className='text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                jobRequests.map((jobRequest, key) =>
                                    <tr key={key}>
                                        <th scope='row' className='text-center'>{key + 1}</th>
                                        <td className='text-center'>{jobRequest.requestedRole}</td>
                                        <td className='text-center d-none d-md-table-cell'>{jobRequest.industry}</td>
                                        <td className='text-center d-none d-md-table-cell'>{jobRequest.jobType}</td>
                                        <td className='text-center d-none d-md-table-cell'>{jobRequest.experience}</td>
                                        {/* <td className='text-center'>23 March 2023</td> */}
                                        <td className='text-center'>{jobRequest.status}</td>
                                        <td className='text-center'>
                                            <i className='fa-light fa-eye fs-5' style={{ cursor: 'pointer' }} onClick={(event) => handleViewRequest(event, jobRequest.requestId)} data-tooltip-id='napoleon-tooltip' data-tooltip-content='View request details'></i>
                                            {/* <i className='fa-thin fa-trash fs-5' style={{ cursor: 'pointer' }} data-tooltip-id='napoleon-tooltip' data-tooltip-content='Delete request'></i> */}
                                            {/* <button type='button' className='btn p-0 ms-3' style={{ visibility: jobRequest?.status === 'hired' ? 'visible' : 'hidden' }} onClick={(event) => handleCompanyOfferUploadDialog(event, jobRequest.requestId, key)} data-bs-toggle='modal' data-bs-target='#uploadCompanyContractDialog' data-tooltip-id='napoleon-tooltip' data-tooltip-content='Upload contract'> */}
                                            <i className='fa-light fa-file-signature fs-4 ms-3' style={{ cursor: 'pointer', visibility: jobRequest?.status === 'hired' ? 'visible' : 'hidden' }} onClick={(event) => handleCompanyOfferUploadDialog(event, jobRequest.requestId, key)} data-bs-toggle='modal' data-bs-target='#uploadCompanyContractDialog' data-tooltip-id='napoleon-tooltip' data-tooltip-content='Upload contract'></i>
                                            {/* </button> */}
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
                {/* Hired Candidates */}
                <div className='row rounded-5 ps-4 pt-2 pe-4 pb-2' style={{ height: '100%', backgroundColor: 'white', borderRadius: '20px', display: displayMode.hiredDisplay }}>
                    <p className='text-left fs-5 fw-bold mt-2 ms-3 pt-3'>Total 1 candidate found</p>
                    <table className='table table-striped table-light table-hover fs-5' style={{ width: '95%', marginLeft: '2.5%' }}>
                        <thead>
                            <tr>
                                <th scope='col' className='text-center'>#</th>
                                <th scope='col' className='text-center'>Name</th>
                                <th scope='col' className='text-center d-none d-md-table-cell'>Email</th>
                                <th scope='col' className='text-center d-none d-md-table-cell'>Company</th>
                                <th scope='col' className='text-center d-none d-md-table-cell'>Contact name</th>
                                <th scope='col' className='text-center d-none d-md-table-cell'>Contact email</th>
                                <th scope='col' className='text-center'>Start date</th>
                                <th scope='col' className='text-center'>End date</th>
                                <th scope='col' className='text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* <tr>
                                <th scope='row' className='text-center'  >1</th>
                                <td className='text-center'>John Doe</td>
                                <td className='text-center d-none d-md-table-cell'>john.doe@mail.com</td>
                                <td className='text-center d-none d-md-table-cell'>Napoleon</td>
                                <td className='text-center d-none d-md-table-cell'>Sid Biswas</td>
                                <td className='text-center d-none d-md-table-cell'>sid@sparkadvisory.com</td>
                                <td className='text-center'>Jun 16 2023</td>
                                <td className='text-center'>Dec 24 2023</td>
                                <td className='text-center'>
                                    <i className='fa-thin fa-eye fs-5' style={{ cursor: 'pointer' }} onClick={handleViewRequest} data-tooltip-id='napoleon-tooltip' data-tooltip-content='View request details'></i>
                                    <button type='button' className='btn ms-2 p-0' onClick={() => inputFile.current.click()} data-tooltip-id='napoleon-tooltip' data-tooltip-content='Upload contract'>
                                        <i className='fa-thin fa-file-contract fs-4' style={{ cursor: 'pointer' }}></i>
                                    </button>
                                    <input ref={inputFile} type='file' style={{ display: 'none' }} />
                                </td>
                            </tr> */}
                        </tbody>
                    </table>
                </div>
                {/* Rejected Candidates */}
                <div className='row rounded-5 ps-4 pt-2 pe-4 pb-2' style={{ height: '100%', backgroundColor: 'white', borderRadius: '20px', display: displayMode.rejectedDisplay }}>
                    <p className='text-left fs-5 fw-bold mt-2 ms-3 pt-3'>No candidates found</p>
                    <table className='table table-striped table-light table-hover fs-5' style={{ width: '95%', marginLeft: '2.5%' }}>
                        <thead>
                            <tr>
                                <th scope='col' className='text-center'>#</th>
                                <th scope='col' className='text-center'>Name</th>
                                <th scope='col' className='text-center d-none d-md-table-cell'>Email</th>
                                <th scope='col' className='text-center d-none d-md-table-cell'>Company</th>
                                <th scope='col' className='text-center d-none d-md-table-cell'>Contact name</th>
                                <th scope='col' className='text-center d-none d-md-table-cell'>Contact email</th>
                                <th scope='col' className='text-center'>Reason</th>
                                <th scope='col' className='text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* <tr>
                                <th scope='row' className='text-center'  >1</th>
                                <td className='text-center'>John Smith</td>
                                <td className='text-center d-none d-md-table-cell'>john.smith@mail.com</td>
                                <td className='text-center d-none d-md-table-cell'>Napoleon</td>
                                <td className='text-center d-none d-md-table-cell'>Henry William</td>
                                <td className='text-center d-none d-md-table-cell'>henry.william@sparkadvisory.com</td>
                                <td className='text-center'>Candidate work experience is not appropriate for the requrement.</td>
                                <td className='text-center'>
                                    <i className='fa-thin fa-eye fs-5' style={{ cursor: 'pointer' }} onClick={handleViewRequest} data-tooltip-id='napoleon-tooltip' data-tooltip-content='View request details'></i>
                                </td>
                            </tr> */}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
export default CompanyDashboard