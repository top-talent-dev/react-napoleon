import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MessageDialog from './MessageDialog';

const SIGNWELL_DOC_CREATE_URL = 'https://www.signwell.com/api/v1/documents/'

const DocumentSign = () => {
    const [alertMessage, setAlertMessage] = useState({
        'title': 'Success message',
        'body': 'Profile data saved successfully.'
    });
    const [linkDisplay, setLinkDisplay] = useState({
        'visible': 'none'
    });
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();
    const [signWellData, setSignWellData] = useState({
        signature_page: true,
        reminders: true,
        apply_signing_order: false,
        embedded_signing: true,
        embedded_signing_notifications: false,
        text_tags: false,
        allow_decline: true,
        allow_reassign: true,
        files: [
            {
                name: 'UploadedFileToSign.pdf',
                file_base64: ''
            }
        ],
        name: 'Document for sign',
        subject: 'Document Sign',
        message: 'Please Sign the document',
        recipients: [
            {
                send_email: true,
                send_email_delay: 0,
                id: '1',
                name: '',
                email: '',
                subject: 'Document Sign',
                message: 'Please Sign the document'
            }
        ],
        expires_in: 30,
        custom_requester_name: 'string',
        custom_requester_email: 'user@example.com',
        redirect_url: 'https://napoleon.cloud',
        decline_redirect_url: 'https://napoleon.cloud',
        fields: [
            [
                {
                    type: 'signature',
                    required: true,
                    fixed_width: false,
                    lock_sign_date: false,
                    x: 0,
                    y: 0,
                    page: 1,
                    recipient_id: '1'
                }
            ]
        ]
    });

    useEffect(() => {
        setLinkDisplay({
            'visible': 'none'
        });
    }, []);

    function handleSignwellInput(event, key) {
        let newObj = { ...signWellData };
        newObj.recipients[0][key] = event.target.value;
        setSignWellData(newObj);
    }

    const handleUploadDocument = async (event) => {
        const selectedFile = document.getElementById('fileOffer').files[0];
        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });

        const response = await toBase64(selectedFile);
        let newObj = { ...signWellData };
        newObj.files[0]['file_base64'] = response.substring(response.indexOf('base64') + 7, response.length);
        newObj.files[0]['name'] = selectedFile.name;
        setSignWellData(newObj);
    }

    const signDocument = async (event) => {
        const form = document.getElementById('frmSignDoc');
        const options = {
            method: 'POST',
            url: SIGNWELL_DOC_CREATE_URL,
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'X-Api-Key': 'YWNjZXNzOmFmYzNmN2I4ZmQ0MTVkOGQ0NTgzYTA0ZGQ5NzIyMjFm'
            },
            data: signWellData
        };

        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        } else {
            axios.request(options).then(function (response) {
                document.getElementById('linkSignwellDocuSign').href = response.data.recipients[0].embedded_signing_url;
                setLinkDisplay({
                    'visible': 'block'
                });
            }).catch(function (err) {
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
            });
        }
    }

    function resetForm(event) {
        setLinkDisplay({
            'visible': 'none'
        });

        let newObj = { ...signWellData };
        newObj.recipients[0]['email'] = '';
        newObj.recipients[0]['name'] = '';
        newObj.files[0]['file_base64'] = '';
        newObj.files[0]['name'] = '';
        document.getElementById('fileOffer').value = '';
        setSignWellData(newObj);
    }

    return (
        <>
            <MessageDialog msg={alertMessage} />
            <button type="button" id='btnMessage' style={{ display: 'none' }} data-bs-toggle="modal" data-bs-target="#messageDialog" />
            <div className='modal fade' id='signDocumentDialog' tabIndex='-1' aria-labelledby='signDocumentDialogLabel' aria-hidden='true'>
                <div className='modal-dialog modal-dialog-centered'>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h1 className='modal-title fw-bold fs-3' id='signDocumentDialogLabel'>Digitally sign document</h1>
                            <button type="button" className="btn" data-bs-dismiss="modal" aria-label="Close" onClick={(event) => resetForm(event)}>
                                <i className='fa-light fa-xmark fw-bold fs-2 formIcon'></i>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <form id="frmSignDoc" className="needs-validation" noValidate>
                                <div className='row'>
                                    <div className='col-sm'>
                                        <label htmlFor='txtSignerName' className='col-form-label fw-medium text-start fs-5'>
                                            <i className='fas fa-building'></i>&nbsp;Name of signing authority
                                        </label>
                                        <input type='text' className='form-control fw-lighter fs-5 w-100' id='txtSignerName' name='txtSignerName' value={signWellData.recipients[0].name} onChange={(event) => handleSignwellInput(event, 'name')} required />
                                    </div>
                                    <div className='col-sm'>
                                        <label htmlFor='txtSignerEmail' className='col-form-label fw-medium text-start fs-5'>
                                            <i className='fas fa-briefcase'></i>&nbsp;Email of signing authority
                                        </label>
                                        <input type='email' className='form-control fw-lighter fs-5 w-100' id='txtSignerEmail' name='txtSignerEmail' value={signWellData.recipients[0].email} onChange={(event) => handleSignwellInput(event, 'email')} required />
                                    </div>
                                    <div className='col-sm-12 mt-2'>
                                        <label htmlFor='formFile' className='col-form-label fw-medium text-start fs-5'>
                                            <i className='fas fa-file'></i>&nbsp;Choose file to sign with Signwell
                                        </label>
                                        <input className='form-control fw-lighter fs-5' type='file' id='fileOffer' accept='application/pdf' onChange={(event) => handleUploadDocument(event)} />
                                    </div>
                                    <div className='col-sm-12 mt-2 text-center'>
                                        <a id='linkSignwellDocuSign' name='linkSignwellDocuSign' href='/#' target="_blank" className='link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover' style={{ display: linkDisplay.visible }} data-bs-dismiss='modal' onClick={(event) => resetForm(event)}>
                                            Click herer for document sign
                                        </a>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' className='btn btn-success rounded-pill w-25 fs-4' onClick={signDocument}>
                                Sign
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default DocumentSign