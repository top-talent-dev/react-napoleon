import { useState, useRef, useEffect } from 'react';
import CandidateViewInterveiwDetailsDialog from './CandidateViewInterveiwDetailsDialog'
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const INTERVIEW_LIST_URL = '/candidate/getInterviewList';

const CandidateDashboard = () => {
    const navigate = useNavigate();
    const [interviews, setInterveiws] = useState([]);
    const [interviewDetails, setInterviewDetails] = useState({});
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const runOnce = true;

    useEffect(() => {
        console.log('i fire once');
        fetchData();
    }, [runOnce]);

    const fetchData = async () => {
        try {
            const response = await axiosPrivate.get(INTERVIEW_LIST_URL, {});
            console.log(JSON.stringify(response?.data));
            const fetchStatus = response?.data?.status;
            const fetchSuccess = response?.data?.success;

            if (fetchSuccess) {
                setInterveiws(response?.data?.data?.interviews);
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

    function handleViewInterviewDetailsDialog(event, interviewId, key) {
        if (interviews[key].interviewId === interviewId) {
            var data = {};
            data.interveiwDetails = interviews[key];

            setInterviewDetails(data);
        }
    }

    return (
        <>
            <CandidateViewInterveiwDetailsDialog resources={interviewDetails} />
            <div className='container mt-3' style={{ maxWidth: '95%', height: 'max-content' }}>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <div className="row rounded-5" style={{ backgroundColor: 'white' }}>
                    <p className='text-left fs-4 fw-bold mt-2 ms-3'>Total {interviews.length} interviews found</p>
                    <table className='table table-striped table-light table-hover fs-5 ms-auto me-auto' style={{ width: '95%' }}>
                        <thead>
                            <tr>
                                <th scope='col' className='text-center'>#</th>
                                <th scope='col' className='text-center'>Company name</th>
                                <th scope='col' className='text-center d-none d-md-table-cell'>Contact person</th>
                                <th scope='col' className='text-center d-none d-md-table-cell'>Contact email</th>
                                <th scope='col' className='text-center d-none d-md-table-cell'>Contact number</th>
                                <th scope='col' className='text-center'>Interview date</th>
                                <th scope='col' className='text-center'>Interview status</th>
                                <th scope='col' className='text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                interviews.map((interview, key) =>
                                    <tr key={key}>
                                        <th scope='row' className='text-center'>{key + 1}</th>
                                        <td className='text-center'>{interview.companyName}</td>
                                        <td className='text-center d-none d-md-table-cell'>{interview.conatactName}</td>
                                        <td className='text-center d-none d-md-table-cell'>{interview.conatactEmail}</td>
                                        <td className='text-center d-none d-md-table-cell'>{interview.conatactNumber}</td>
                                        <td className='text-center'>{interview.interviewDate}</td>
                                        <td className='text-center'>{interview.status}</td>
                                        <td className='text-center'>
                                            <div className="d-flex flex-row">
                                                <i className='fa-light fa-eye fs-4' style={{ cursor: 'pointer' }} onClick={(event) => handleViewInterviewDetailsDialog(event, interview.interviewId, key)} data-bs-toggle='modal' data-bs-target='#viewInterveiwDetailsDialog'></i>
                                                <a href={interview.interviewLink} style={{ display: interview.status === 'active' ? 'block' : 'none' }}>
                                                    <i className='fa-light fa-handshake fs-4 ms-2'></i>
                                                </a>
                                                <a href={interview.offerLetter} style={{ display: interview.offerLetter ? 'block' : 'none' }}>
                                                    <i className='fa-light fa-file-contract fs-4 ms-2'></i>
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
export default CandidateDashboard