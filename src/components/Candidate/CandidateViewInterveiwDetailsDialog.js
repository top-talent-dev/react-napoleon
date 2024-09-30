import React from 'react';

export default function CandidateViewInterveiwDetailsDialog(props) {
    return (
        <div className='modal fade' id='viewInterveiwDetailsDialog' tabindex='-1' aria-labelledby='viewInterveiwDetailsDialogLabel' aria-hidden='true'>
            <div className='modal-dialog modal-dialog-centered'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h1 className='modal-title fs-3 fw-bold' id='viewInterveiwDetailsDialogLabel'>Interview details</h1>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    <div className='modal-body'>
                        <div className='row'>
                            <div className='col-sm'>
                                <div className='d-flex flex-row'>
                                    <i className='fa-thin fa-user mt-1 formIcon'></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor='txtExperience' className='col-form-label fw-bold text-start fs-5 p-0'>
                                            Company name
                                        </label>
                                        <p className='fw-normal text-start mb-1 fs-5'>{props?.resources?.interveiwDetails?.companyName}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm'>
                                <div className='d-flex flex-row'>
                                    <i className='fa-thin fa-check mt-1 formIcon'></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor='txtExperience' className='col-form-label fw-bold text-start fs-5 p-0'>
                                            Candidate status
                                        </label>
                                        <p className='fw-normal text-start mb-1 fs-5'>{props?.resources?.interveiwDetails?.status}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col-sm'>
                                <div className='d-flex flex-row'>
                                    <i className='fa-thin fa-calendar-days mt-1 formIcon'></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor='txtExperience' className='col-form-label fw-bold text-start fs-5 p-0'>
                                            Interview date
                                        </label>
                                        <p className='fw-normal text-start mb-1 fs-5'>{props?.resources?.interveiwDetails?.interviewDate}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm'>
                                <div className='d-flex flex-row'>
                                    <i className='fa-thin fa-link mt-1 formIcon'></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor='txtExperience' className='col-form-label fw-bold text-start fs-5 p-0'>
                                            Interview link
                                        </label>
                                        <a href={props?.resources?.interveiwDetails?.interviewLink} className='fs-5'>
                                            Join now
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col col-sm-12'>
                                <div className='d-flex flex-row'>
                                    <i className='fa-thin fa-comment mt-1 formIcon'></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor='txtExperience' className='col-form-label fw-bold text-start fs-5 p-0'>
                                            Brief job description
                                        </label>
                                        <p className='fw-normal text-start mb-1 fs-5'>{props?.resources?.interveiwDetails?.comments}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className='modal-footer'>
                        <button type='button' className='btn btn-danger fs-5' data-bs-dismiss='modal' >
                            <i className='fa-solid fa-circle-xmark'></i>&nbsp;Close
                        </button>
                    </div> */}
                </div>
            </div>
        </div >
    )
}