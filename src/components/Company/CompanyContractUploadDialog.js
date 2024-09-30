import { useState, useRef, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';

const UPLOAD_COMPANY_OFFER_BASE = '/company/uploadOfferLetter';

const CompanyContractUploadDialog = (props) => {
    const { auth } = useAuth();
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();
    const axiosPrivate = useAxiosPrivate();
    var UPLOAD_COMPANY_OFFER_URL = '';

    const uploadOffer = async (event, candidateId) => {
        // window.open("https://www.signwell.com/");
        const selectedFile = document.getElementById('fileOffer').files[0];
        const payload = new FormData();
        // payload.append('jobId', props?.resources?.jobRequest?.requestId);
        // payload.append('candidateId ', candidateId);
        payload.append('letter ', selectedFile);

        UPLOAD_COMPANY_OFFER_URL = UPLOAD_COMPANY_OFFER_BASE + '/' + props?.resources?.jobRequest?.requestId + '/' + candidateId;

        try {
            const response = await axiosPrivate.put(UPLOAD_COMPANY_OFFER_URL, payload, {
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
            <div className='modal fade' id='uploadCompanyContractDialog' tabIndex='-1' aria-labelledby='uploadCompanyContractDialogLabel' aria-hidden='true'>
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h1 className='modal-title fw-bold fs-3' id='uploadCompanyContractDialogLabel'>Upload offer</h1>
                            <button type='button' className='btn-close' style={{ color: 'white' }} data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <div className='row'>
                                <div className='col-sm'>
                                    <label className='col-form-label fw-medium text-start fs-5'>
                                        <i className='fas fa-building'></i>&nbsp;Company name
                                    </label>
                                    <p className='text-start fs-5'>{props?.resources?.jobRequest?.companyName}</p>
                                </div>
                                <div className='col-sm'>
                                    <label htmlFor='txtExperience' className='col-form-label fw-medium text-start fs-5'>
                                        <i className='fas fa-briefcase'></i>&nbsp;Role required
                                    </label>
                                    <p className='text-start fs-5'>{props?.resources?.jobRequest?.requestedRole}</p>
                                </div>
                                <div className='col-sm'>
                                    <label className='col-form-label fw-medium text-start fs-5'>
                                        <i className='fas fa-address-card'></i>&nbsp;Job type
                                    </label>
                                    <p id='txtRequestNo' className='text-start fs-5'>{props?.resources?.jobRequest?.jobType}</p>
                                </div>
                            </div>
                            {
                                (props?.resources?.jobRequest?.interviews)?.map((resource, key) =>
                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <label className='col-form-label fw-medium text-start fs-5 '>
                                                <i className='fas fa-industry'></i>&nbsp;Candidate name
                                            </label>
                                            <p id='txtRequestNo' className='text-start fs-5'>{resource?.candidateName}</p>
                                        </div>
                                        <div className='col-sm-8'>
                                            <label htmlFor='formFile' className='col-form-label fw-medium text-start fs-5'>
                                                <i className='fas fa-file'></i>&nbsp;Choose contract
                                            </label>
                                            <input className='form-control' type='file' id='fileOffer' onChange={(event) => uploadOffer(event, resource?.candidateId)} />
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        {/* <div className='modal-footer'>
                            <button type='button' className='btn btn-danger fs-5' data-bs-dismiss='modal'>
                                <i className='fa-solid fa-ban'></i>&nbsp;Cancel
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}
export default CompanyContractUploadDialog 