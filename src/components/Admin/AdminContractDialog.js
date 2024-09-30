import { useState, useRef, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';

const UPLOAD_NAPOLEONE_OFFER_BASE = '/superadmin/uploadOfferLetter';

const AdminContractDialog = (props) => {
    const { auth } = useAuth();
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();
    const axiosPrivate = useAxiosPrivate();
    var UPLOAD_NAPOLEONE_OFFER_URL = '';

    const uploadOffer = async (event, candidateId) => {
        // window.open("https://www.signwell.com/");
        const selectedFile = document.getElementById('fileOffer').files[0];
        const payload = new FormData();
        // payload.append('jobId', props?.resources?.jobRequest?.requestId);
        // payload.append('candidateId ', candidateId);
        payload.append('letter ', selectedFile);

        UPLOAD_NAPOLEONE_OFFER_URL = UPLOAD_NAPOLEONE_OFFER_BASE + '/' + props?.resources?.jobRequest?.requestI + '/' + candidateId;

        try {
            const response = await axiosPrivate.put(UPLOAD_NAPOLEONE_OFFER_URL, payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            console.log(JSON.stringify(response?.data));
            const saveStatus = response?.data?.status;
            const saveSuccess = response?.data?.success;

            if (saveSuccess) {
                alert("Offer uploaded successfully");
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

    return (
        <>
            <div className='modal fade' id='uploadNapoleonContractDialog' tabindex='-1' aria-labelledby='uploadNapoleonContractDialogLabel' aria-hidden='true'>
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h1 class='modal-title fw-bold fs-3' id='uploadNapoleonContractDialogLabel'>Upload offer</h1>
                            <button type='button' class='btn-close' style={{ color: 'white' }} data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div class='modal-body'>
                            <div className='row'>
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
                                <div className='col-sm'>
                                    <div className="d-flex flex-row">
                                        <i className="fa-thin fa-briefcase formIcon mt-1"></i>
                                        <div className='d-flex flex-column ms-2'>
                                            <label htmlFor='txtRole' className='col-form-label fw-medium fw-bold text-start fs-5 p-0'>
                                                Role required
                                            </label>
                                            <p id='txtRole' className='text-start fs-5 m-0'>{props?.resources?.jobRequest?.requestedRole}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-sm'>
                                    <div className="d-flex flex-row">
                                        <i className="fa-thin fa-address-card formIcon mt-1"></i>
                                        <div className='d-flex flex-column ms-2'>
                                            <label htmlFor='txtJobType' className='col-form-label fw-medium fw-bold text-start fs-5 p-0'>
                                                Job type
                                            </label>
                                            <p id='txtJobType' className='text-start fs-5 m-0'>{props?.resources?.jobRequest?.jobType}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                (props?.resources?.jobRequest?.interviews)?.map((resource, key) =>
                                    <div className='row mt-3'>
                                        <div className='col-sm-4'>
                                            <div className="d-flex flex-row">
                                                <i className="fa-thin fa-address-card formIcon mt-1"></i>
                                                <div className='d-flex flex-column ms-2'>
                                                    <label className='col-form-label fw-medium fw-bold text-start fs-5 p-0'>
                                                        Candidate
                                                    </label>
                                                    <p className='text-start fs-5 m-0'>{resource?.candidateName}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-sm-8'>
                                            <div className="d-flex flex-row">
                                                <i className="fa-thin fa-file formIcon mt-1"></i>
                                                <div className='d-flex flex-column ms-2'>
                                                    <label className='col-form-label fw-medium fw-bold text-start fs-5 p-0'>
                                                        Upload contract
                                                    </label>
                                                    <input class='form-control fs-5' type='file' id='fileOffer' onChange={(event) => uploadOffer(event, resource?.candidateId)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        {/* <div class='modal-footer'>
                            <button type='button' class='btn btn-danger fs-5' data-bs-dismiss='modal'>
                                <i className='fa-solid fa-ban'></i>&nbsp;Cancel
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}
export default AdminContractDialog