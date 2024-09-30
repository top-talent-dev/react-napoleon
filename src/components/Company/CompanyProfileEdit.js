import { useState, useRef, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const SAVE_PROFILE_IMAGE = '/company/uploadProfileImage';
const GET_PROFILE_DATA = '/company/getCompProfile';
const UPDATE_PROFILE_DATA = '/company/updateCompProfile';

const CompanyProfileEdit = () => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState('');
    const [profileData, setProfileData] = useState({
        "id": "",
        "image": "",
        "name": "",
        "address": "",
        "city": "",
        "country": "",
        "postcode": "",
        "businessId": "",
        "business": {
            "industry": "",
            "sub_industry": "",
            "annualRevenue": "",
            "employeeCount": 0,
            "likedinPage": "",
            "twitterHandle": ""
        },
        "contant": {
            "name": "",
            "designation": "",
            "phone": "",
            "alternatePhone": "",
            "email": "m",
            "address": "",
            "city": "",
            "country": "",
            "postcode": ""
        },
        "profileComplete": false
    });
    const errRef = useRef();
    const runOnce = true;

    useEffect(() => {
        console.log('i fire once');
        fetchProfileData();
    }, [runOnce]);

    const fetchProfileData = async () => {
        try {
            const response = await axiosPrivate.get(GET_PROFILE_DATA, {});
            console.log(JSON.stringify(response?.data));
            const fetchStatus = response?.data?.status;
            const fetchSuccess = response?.data?.success;

            if (fetchSuccess) {
                setProfileData(response?.data?.data?.company);
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

    function handleInput(event, key, section) {
        const newObj = { ...profileData, [key]: event.target.value };
        if (section === 'basic') {

        } else if (section === 'business') {
            newObj.business[key] = event.target.value;
        } else if (section === 'contact') {
            newObj.contant[key] = event.target.value;
        }
        setProfileData(newObj);
    }

    function handleProfilePictureSelect(event) {
        var fileInput = document.getElementById('fileProfileImage');
        fileInput.value = '';
        fileInput.click();
    }

    /**
     * 
     * @param {*} event 
     */
    const handleProfilePictureUpload = async (event) => {
        const selectedFile = event.target.files[0];
        // const toBase64 = file => new Promise((resolve, reject) => {
        //     const reader = new FileReader();
        //     reader.readAsDataURL(file);
        //     reader.onload = () => resolve(reader.result);
        //     reader.onloadend = () => {
        //         document.getElementById('imgCompanyProfile').src = reader.result;
        //     };
        //     reader.onerror = error => reject(error);
        // });

        // var readerUpload = new FileReader();
        // var fileBinary = readerUpload.readAsArrayBuffer(selectedFile);
        // var payload = {
        //     'image': await toBase64(selectedFile),
        //     'image_name': selectedFile.name,
        //     'image_type': selectedFile.type
        // };

        const payload = new FormData();
        payload.append('image', selectedFile);
        payload.append('image_name', selectedFile?.name);
        payload.append('image_type', selectedFile?.name.split(".").pop());

        try {
            const response = await axiosPrivate.post(SAVE_PROFILE_IMAGE, payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            console.log(JSON.stringify(response?.data));
            const saveStatus = response?.data?.status;
            const saveSuccess = response?.data?.success;

            if (saveSuccess) {
                alert("Profile image uploaded successfully");
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

    /**
     * 
     * @param {*} event 
     */
    const handleEditCompanyProfile = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');

        if (form.checkValidity() === false) {

        } else {
            try {
                const response = await axiosPrivate.post(UPDATE_PROFILE_DATA, JSON.stringify(profileData));
                console.log(JSON.stringify(response?.data));
                const saveStatus = response?.data?.status;
                const saveSuccess = response?.data?.success;

                if (saveSuccess) {
                    alert("Profile updated successfully");
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
    }

    function handleCencelEditProfile(event) {
        document.getElementById("frmEditCompanyProfile").reset();
        navigate('/Company/Dashboard');
    }

    return (
        <>
            <div className='container mt-3 mb-3' style={{ maxWidth: '95%', height: 'max-content' }}>
                <div className='row rounded-5 ps-4 pt-2 pe-4 pb-2' style={{ backgroundColor: 'white' }}>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <form id="frmEditCompanyProfile" className="row g-3 mt-4 ms-auto needs-validation" onSubmit={handleEditCompanyProfile} noValidate>
                        <div className="row md-3">
                            <div className='col col-sm-2 text-center mt-auto mb-auto'>
                                <img id='imgCompanyProfile' src={JSON.parse(window.sessionStorage.getItem('loggedInUserProfileImageLink'))?.profileImage} alt='Candidate Profile' className='mb-2 rounded-circle' style={{ height: '150px', width: '150px' }} />
                                <div className='w-100 text-center'>
                                    <input id='fileProfileImage' name='fileProfileImage' type='file' accept="image/x-png,image/gif,image/jpeg" onChange={handleProfilePictureUpload} style={{ display: 'none' }} />
                                    <button type="button" className="btn btn-success rounded-pill fw-medium w-auto me-2 fs-6" onClick={handleProfilePictureSelect}><i className="fa-solid fa-pencil"></i>&nbsp;Update image</button>
                                </div>
                            </div>

                            <div className="col-sm">
                                <div className="row">
                                    <div className='col-sm'>
                                        <label htmlFor="txtCompanyName" className="col-form-label fw-medium text-end fs-5">
                                            <i className="fas fa-building"></i>&nbsp;Company name
                                        </label>
                                        <div className="input-group has-validation">
                                            <input type="text" className="form-control fw-lighter fs-5" id="txtCompanyName" value={profileData?.name} onChange={(event) => handleInput(event, 'name', 'base')} required />
                                        </div>
                                    </div>
                                    <div className='col-sm'>
                                        <label htmlFor="txtIdentification" className="col-form-label fw-medium text-end fs-5">
                                            <i className="fas fa-fingerprint"></i>&nbsp;Identification
                                        </label>
                                        <div className="input-group has-validation">
                                            <input type="text" className="form-control fw-lighter fs-5" id="txtIdentification" value={profileData?.businessId} onChange={(event) => handleInput(event, 'businessId', 'base')} required />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm'>
                                        <label htmlFor="txtAddress" className="col-form-label fw-medium text-end fs-5">
                                            <i className="fas fa-map-marker-alt"></i>&nbsp;Address
                                        </label>
                                        <div className="input-group has-validation">
                                            <input type="text" className="form-control fw-lighter fs-5" id="txtAddress" value={profileData?.address} onChange={(event) => handleInput(event, 'address', 'base')} required />
                                        </div>
                                    </div>
                                    <div className='col-sm'>
                                        <label htmlFor="txtCity" className="col-form-label fw-medium text-end fs-5">
                                            <i className="fas fa-city"></i>&nbsp;City
                                        </label>
                                        <div className="input-group has-validation">
                                            <input type="text" className="form-control fw-lighter fs-5" id="txtCity" value={profileData?.city} onChange={(event) => handleInput(event, 'city', 'base')} required />
                                        </div>
                                    </div>
                                    <div className='col-sm'>
                                        <label htmlFor="txtCountry" className="col-form-label fw-medium text-end fs-5">
                                            <i className="fas fa-flag"></i>&nbsp;Country
                                        </label>
                                        <div className="input-group has-validation">
                                            <input type="text" className="form-control fw-lighter fs-5" id="txtCountry" value={profileData?.country} onChange={(event) => handleInput(event, 'country', 'base')} required />
                                        </div>
                                    </div>
                                    <div className='col-sm'>
                                        <label htmlFor="txtPostCode" className="col-form-label fw-medium text-end fs-5">
                                            <i className="fas fa-signs-post"></i>&nbsp;Post code
                                        </label>
                                        <div className="input-group has-validation">
                                            <input type="text" className="form-control fw-lighter fs-5" id="txtPostCode" value={profileData?.postcode} onChange={(event) => handleInput(event, 'postcode', 'base')} required />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm'>
                                        <label htmlFor="txtAbout" className="col-form-label fw-medium text-end fs-5">
                                            <i className="fas fa-circle-info"></i>&nbsp;About company
                                        </label>
                                        <div className="input-group has-validation">
                                            <input type="text" className="form-control fw-lighter fs-5" id="txtAbout" required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='row mt-3 ms-auto me-auto'>
                            <p className='fw-medium text-start mt-2 fs-4'>
                                <i className='fas fa-id-card'></i> &nbsp;Business Highlights
                            </p>
                            <div className="row">
                                <div className='col-sm'>
                                    <label htmlFor="txtIndustry" className="col-form-label fw-medium text-end fs-5">
                                        <i className="fas fa-industry"></i>&nbsp;Industry
                                    </label>
                                    <div className="input-group has-validation">
                                        <input type="text" className="form-control fw-lighter fs-5" id="txtIndustry" value={profileData?.business?.industry} onChange={(event) => handleInput(event, 'industry', 'business')} required />
                                    </div>
                                </div>
                                <div className='col-sm'>
                                    <label htmlFor="txtSubindustry" className="col-form-label fw-medium text-end fs-5">
                                        <i className="fas fa-building"></i>&nbsp;Sub-industry
                                    </label>
                                    <div className="input-group has-validation">
                                        <input type="text" className="form-control fw-lighter fs-5" id="txtSubindustry" value={profileData?.business?.sub_industry} onChange={(event) => handleInput(event, 'sub_industry', 'business')} required />
                                    </div>
                                </div>
                                <div className='col-sm'>
                                    <label htmlFor="txtRevenue" className="col-form-label fw-medium text-end fs-5">
                                        <i className="fas fa-sack-dollar"></i>&nbsp;Annual revenue
                                    </label>
                                    <div className="input-group has-validation">
                                        <input type="text" className="form-control fw-lighter fs-5" id="txtRevenue" value={profileData?.business?.annualRevenue} onChange={(event) => handleInput(event, 'annualRevenue', 'business')} required />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className='col-sm'>
                                    <label htmlFor="txtEmployeeCount" className="col-form-label fw-medium text-end fs-5">
                                        <i className="fas fa-users"></i>&nbsp;Total employees
                                    </label>
                                    <div className="input-group has-validation">
                                        <input type="number" className="form-control fw-lighter fs-5" id="txtEmployeeCount" value={profileData?.business?.employeeCount} onChange={(event) => handleInput(event, 'employeeCount', 'business')} required />
                                    </div>
                                </div>
                                <div className='col-sm'>
                                    <label htmlFor="txtLinkedin" className="col-form-label fw-medium text-end fs-5">
                                        <i className="fas fa-link"></i>&nbsp;Linkedin address
                                    </label>
                                    <div className="input-group has-validation">
                                        <input type="text" className="form-control fw-lighter fs-5" id="txtLinkedin" value={profileData?.business?.likedinPage} onChange={(event) => handleInput(event, 'likedinPage', 'business')} required />
                                    </div>
                                </div>
                                <div className='col-sm'>
                                    <label htmlFor="txtTwitter" className="col-form-label fw-medium text-end fs-5">
                                        <i className="fas fa-anchor"></i>&nbsp;Twitter handle
                                    </label>
                                    <div className="input-group has-validation">
                                        <input type="text" className="form-control fw-lighter fs-5" id="txtTwitter" value={profileData?.business?.twitterHandle} onChange={(event) => handleInput(event, 'twitterHandle', 'business')} required />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='row mt-3 ms-auto me-auto'>
                            <p className='fw-medium text-start mt-2 fs-4'>
                                <i className='fas fa-id-card'></i> &nbsp;Business Contact Information
                            </p>
                            <div className="row">
                                <div className='col-sm'>
                                    <label htmlFor="txtCotactName" className="col-form-label fw-medium text-end fs-5">
                                        <i className="fas fa-user"></i>&nbsp;Contact person name
                                    </label>
                                    <div className="input-group has-validation">
                                        <input type="text" className="form-control fw-lighter fs-5" id="txtCotactName" value={profileData?.contant?.name} onChange={(event) => handleInput(event, 'name', 'contact')} required />
                                    </div>
                                </div>
                                <div className='col-sm'>
                                    <label htmlFor="txtContactTitle" className="col-form-label fw-medium text-end fs-5">
                                        <i className="fas fa-chair"></i>&nbsp;Title / Designation
                                    </label>
                                    <div className="input-group has-validation">
                                        <input type="text" className="form-control fw-lighter fs-5" id="txtContactTitle" value={profileData?.contant?.designation} onChange={(event) => handleInput(event, 'designation', 'contact')} required />
                                    </div>
                                </div>
                                <div className='col-sm'>
                                    <label htmlFor="txtContactNumber" className="col-form-label fw-medium text-end fs-5">
                                        <i className="fas fa-phone"></i>&nbsp;Contact number
                                    </label>
                                    <div className="input-group has-validation">
                                        <input type="text" className="form-control fw-lighter fs-5" id="txtContactNumber" value={profileData?.contant?.phone} onChange={(event) => handleInput(event, 'phone', 'contact')} required />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-sm'>
                                    <label htmlFor="txtAlternateNumber" className="col-form-label fw-medium text-end fs-5">
                                        <i className="fas fa-mobile"></i>&nbsp;Alternate number
                                    </label>
                                    <div className="input-group has-validation">
                                        <input type="text" className="form-control fw-lighter fs-5" id="txtAlternateNumber" value={profileData?.contant?.alternatePhone} onChange={(event) => handleInput(event, 'alternatePhone', 'contact')} required />
                                    </div>
                                </div>
                                <div className='col-sm'>
                                    <label htmlFor="txtContactEmail" className="col-form-label fw-medium text-end fs-5">
                                        <i className="fas fa-at"></i>&nbsp;Email
                                    </label>
                                    <div className="input-group has-validation">
                                        <input type="text" className="form-control fw-lighter fs-5" id="txtContactEmail" value={profileData?.contant?.name} onChange={(event) => handleInput(event, 'email', 'contact')} required />
                                    </div>
                                </div>
                                <div className='col-sm'>
                                    <label htmlFor="txtContactAddress" className="col-form-label fw-medium text-end fs-5">
                                        <i className="fas fa-location"></i>&nbsp;Contact person location
                                    </label>
                                    <div className="input-group has-validation">
                                        <input type="text" className="form-control fw-lighter fs-5" id="txtContactAddress" value={profileData?.contant?.address} onChange={(event) => handleInput(event, 'address', 'contact')} required />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-sm'>
                                    <label htmlFor="txtContactCity" className="col-form-label fw-medium text-end fs-5">
                                        <i className="fas fa-city"></i>&nbsp;City
                                    </label>
                                    <div className="input-group has-validation">
                                        <input type="text" className="form-control fw-lighter fs-5" id="txtContactCity" value={profileData?.contant?.city} onChange={(event) => handleInput(event, 'city', 'contact')} required />
                                    </div>
                                </div>
                                <div className='col-sm'>
                                    <label htmlFor="txtContactCountry" className="col-form-label fw-medium text-end fs-5">
                                        <i className="fas fa-flag"></i>&nbsp;Country
                                    </label>
                                    <div className="input-group has-validation">
                                        <input type="text" className="form-control fw-lighter fs-5" id="txtContactCountry" value={profileData?.contant?.country} onChange={(event) => handleInput(event, 'country', 'contact')} required />
                                    </div>
                                </div>
                                <div className='col-sm'>
                                    <label htmlFor="txtContactPostCode" className="col-form-label fw-medium text-end fs-5">
                                        <i className="fas fa-signs-post"></i>&nbsp;Post code
                                    </label>
                                    <div className="input-group has-validation">
                                        <input type="text" className="form-control fw-lighter fs-5" id="txtContactPostCode" value={profileData?.contant?.postcode} onChange={(event) => handleInput(event, 'postcode', 'contact')} required />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='d-flex justify-content-center'>
                            <button type="submit" className="btn btn-success rounded-4 w-auto me-2"><i className="fa-solid fa-floppy-disk"></i>&nbsp;Update</button>
                            <button type="button" className="btn btn-danger rounded-4" onClick={handleCencelEditProfile}><i className="fa-solid fa-ban"></i>&nbsp;Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
export default CompanyProfileEdit