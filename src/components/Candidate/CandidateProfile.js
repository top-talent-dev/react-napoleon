import { useState, useEffect, useRef } from 'react';
import { useLocation, useMatch } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import CadidateProfileKeyInfoEditDialog from './CadidateProfileKeyInfoEditDialog';
import CadidateProfileBasicInfoEditDialog from './CadidateProfileBasicInfoEditDialog';
import CadidateProfileSkillInfoEditDialog from './CadidateProfileSkillInfoEditDialog';
import CadidateProfileDiversityInfoEditDialog from './CadidateProfileDiversityInfoEditDialog';
import CadidateProfileEducationInfoEditDialog from './CadidateProfileEducationInfoEditDialog';
import CadidateProfileExperienceInfoEditDialog from './CadidateProfileExperienceInfoEditDialog';
import CadidateProfileEducationInfoAddDialog from './CadidateProfileEducationInfoAddDialog';
import CadidateProfileExperienceInfoAddDialog from './CadidateProfileExperienceInfoAddDialog';

const GET_PROFILE_DATA_BASE = '/candidate/getProfile';
const GET_PROFILE_IMAGE_BASE = '/candidate/getProfileImage';
const GET_PROFILE_DATA_ADMIN = '/superadmin/getCandidateDetails';
const GET_RESUME_BASE = '/candidate/getCv';
const SAVE_PROFILE_IMAGE = '/candidate/uploadProfileImage';
const SAVE_PROFILE_CV = '/candidate/uploadCv';

const CandidateProfile = () => {
    const { auth } = useAuth();
    const { state } = useLocation();
    var isAdminRoute = useMatch('/Admin/Dashboard/CandidateProfile');
    const [displayMode, setDisplayMode] = useState({
        displayProfileEdit: auth.roles[0] === 'candidate' ? 'inline-block' : 'none'
    });

    const [profileData, setProfileData] = useState({});
    const [imageLink, setImageLink] = useState(JSON.parse(window.sessionStorage.getItem('loggedInUserProfileImageLink'))?.profileImage);
    const [resume, setResume] = useState({});
    const [editIndex, setEditIndex] = useState(-1);
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const runOnce = true;
    var GET_PROFILE_DATA = '';
    var GET_PROFILE_IMAGE = '';
    var GET_RESUME = '';

    useEffect(() => {
        console.log('i fire once');
        if (state?.id && isAdminRoute) {
            console.log('Candidate ID: ' + state.id);
            GET_PROFILE_DATA = GET_PROFILE_DATA_ADMIN + '/' + state.id;
        } else {
            GET_PROFILE_DATA = GET_PROFILE_DATA_BASE;
        }
        fetchProfileData();
    }, [runOnce]);

    const fetchProfileData = async () => {
        try {
            const response = await axiosPrivate.get(GET_PROFILE_DATA, {});
            console.log(JSON.stringify(response?.data));
            const fetchStatus = response?.data?.status;
            const fetchSuccess = response?.data?.success;

            if (fetchSuccess) {
                setProfileData(response?.data?.data?.candidate);
                if (auth.roles[0] === 'admin') {
                    setImageLink(response?.data?.data?.candidate?.basicInfo?.image);
                    // GET_PROFILE_IMAGE = GET_PROFILE_IMAGE_BASE + '/' + response?.data?.data?.candidate?.candidateId;
                    // const imageResponse = await axiosPrivate.get(GET_PROFILE_IMAGE, {});
                    // console.log(JSON.stringify(imageResponse?.data));
                    // const imageFetchStatus = imageResponse?.data?.status;
                    // const imageFetchSuccess = imageResponse?.data?.success;
                    // if (imageFetchSuccess) {
                    //     setImageLink(imageResponse?.data?.profile_image?.image);
                    // }
                }

                if (!isAdminRoute) {
                    GET_RESUME = GET_RESUME_BASE + '/' + response?.data?.data?.candidate?.candidateId;
                    const resumeResponse = await axiosPrivate.get(GET_RESUME, {});
                    console.log(JSON.stringify(resumeResponse?.data));
                    const resumeFetchStatus = resumeResponse?.data?.status;
                    const resumeFetchSuccess = resumeResponse?.data?.success;
                    if (resumeFetchSuccess) {
                        setResume(resumeResponse?.data?.cv);
                    }
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
        if (classList.contains('fa-square-plus')) {
            classList.remove('fa-square-plus');
            classList.add('fa-square-minus');
        } else if (classList.contains('fa-square-minus')) {
            classList.remove('fa-square-minus');
            classList.add('fa-square-plus');
        }
    }

    function handleProfilePictureSelect(event) {
        var fileInput = document.getElementById('fileProfileImage');
        fileInput.value = '';
        fileInput.click();
    }

    const handleProfilePictureUpload = async (event) => {
        const selectedFile = event.target.files[0];
        const payload = new FormData();
        payload.append('image', selectedFile);
        payload.append('image_name', selectedFile?.name);
        payload.append('image_type', selectedFile?.name.split('.').pop());

        try {
            const response = await axiosPrivate.post(SAVE_PROFILE_IMAGE, payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            console.log(JSON.stringify(response?.data));
            const saveStatus = response?.data?.status;
            const saveSuccess = response?.data?.success;

            if (saveSuccess) {
                alert('Profile image uploaded successfully');
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

    function handleResumeSelect(event) {
        var fileInput = document.getElementById('fileResume');
        fileInput.value = '';
        fileInput.click();
    }

    const handleResumeUpload = async (event) => {
        const selectedFile = event.target.files[0];
        const payload = new FormData();
        payload.append('cv', selectedFile);
        payload.append('cv_name', selectedFile?.name);
        payload.append('cv_type', selectedFile?.name.split('.').pop());

        try {
            const response = await axiosPrivate.post(SAVE_PROFILE_CV, payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            console.log(JSON.stringify(response?.data));
            const saveStatus = response?.data?.status;
            const saveSuccess = response?.data?.success;

            if (saveSuccess) {
                alert('Resume uploaded successfully');
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

    function setIndex(index) {
        setEditIndex(index);
    }

    return (
        <>
            <Tooltip id='napoleon-tooltip' />
            <CadidateProfileKeyInfoEditDialog keyInfo={profileData} />
            <CadidateProfileBasicInfoEditDialog keyInfo={profileData} />
            <CadidateProfileExperienceInfoAddDialog keyInfo={profileData} />
            <CadidateProfileExperienceInfoEditDialog keyInfo={profileData} />
            <CadidateProfileEducationInfoAddDialog keyInfo={profileData} />
            <CadidateProfileEducationInfoEditDialog keyInfo={profileData} />
            <CadidateProfileSkillInfoEditDialog keyInfo={profileData} />
            <CadidateProfileDiversityInfoEditDialog keyInfo={profileData} />

            <div className='container pt-2 pb-2' style={{ maxWidth: '95%', height: '85%' }}>
                <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'>{errMsg}</p>
                <div className='row' style={{ height: '100%' }}>
                    <div className='col col-lg-3 rounded-5 text-center ps-4 pt-2 pe-4 pb-2' style={{ backgroundColor: 'white' }}>
                        <div className='w-100 text-end me-1'>
                            <i className='fa-solid fa-pencil fs-5' style={{ cursor: 'pointer', display: displayMode.displayProfileEdit }} data-bs-toggle='modal' data-bs-target='#editCandidateProfileKeyInfoDialog' data-tooltip-id='napoleon-tooltip' data-tooltip-content='Edit profile key info'></i>
                        </div>
                        <img src={imageLink} alt='Candidate Profile' className='mb-2' style={{ height: '150px', width: '150px', borderRadius: '50%', cursor: 'pointer', marginTop: '-5%' }} onClick={handleProfilePictureSelect} />
                        <input id='fileProfileImage' name='fileProfileImage' type='file' accept='image/x-png,image/gif,image/jpeg' onChange={handleProfilePictureUpload} style={{ display: 'none' }} />
                        <p className='fs-3 fw-bold text-center mb-0'>{profileData?.basicInfo?.firstName} {profileData?.basicInfo?.lastName}</p>
                        <p className='fs-5 fw-semibold text-center mb-0'>{profileData?.basicInfo?.currentJobTitle}</p>
                        <p className='fs-5 fw-normal text-center mb-2'><i className='fas fa-map-marker-alt'></i>&nbsp;{profileData?.basicInfo?.city}, {profileData?.basicInfo?.country}</p>
                        <p className='fw-normal text-justify fs-5'>{profileData?.basicInfo?.briefExperience}</p>
                        <hr className='w-75 ms-auto me-auto' style={{ borderTop: '1px dotted black' }} />
                        <p className='fw-bolder fs-5 text-center mt-3'><i className='fas fa-handshake'></i>&nbsp;Diversity & inclusion consents</p>
                        <div class='form-check form-switch mt-1 ps-1'>
                            <label className='form-check-label text-start fs-6 mb-2' htmlFor='flexSwitchCheckDefault' style={{ float: 'left', width: '85%' }}>Do you consent to providing diversity & inclusion information?</label>
                            <input className='form-check-input me-2' type='checkbox' role='switch' id='flexSwitchCheckDefault' style={{ float: 'right' }} checked={profileData?.consent?.provideDIInfo ? 'checked' : ''} disabled />
                        </div>
                        <div class='form-check form-switch mt-2 ps-1'>
                            <label className='form-check-label text-start fs-6 mb-2' htmlFor='flexSwitchCheckDefault' style={{ float: 'left', width: '85%' }}>Do you identify as a diversity & inclusion candidate?</label>
                            <input className='form-check-input me-2' type='checkbox' role='switch' id='flexSwitchCheckDefault' style={{ float: 'right' }} checked={profileData?.consent?.diCandidate ? 'checked' : ''} disabled />
                        </div>
                        <div class='form-check form-switch mt-2 ps-1'>
                            <label className='form-check-label text-start fs-6 mb-2' htmlFor='flexSwitchCheckDefault' style={{ float: 'left', width: '85%' }}>Do you consent to us utilizing this information to find you matiching job?</label>
                            <input className='form-check-input me-2' type='checkbox' role='switch' id='flexSwitchCheckDefault' style={{ float: 'right' }} checked={profileData?.consent?.shareProfile ? 'checked' : ''} disabled />
                        </div>
                        <div className='d-flex w-100 text-center mt-4'>
                            <p className='fw-normal text-center fs-4 mt-2 ms-auto me-auto'>
                                <a href={resume?.cv} className='fs-4'><i className='fa-solid fa-download fs-3 me-1' />Download resume</a>
                            </p>
                        </div>
                        <div className='d-flex w-100 text-center mt-1'>
                            <p className='fw-bolder text-start fs-4 ms-auto me-auto'>
                                <button type='submit' className='btn btn-secondary fs-5 me-2' onClick={handleResumeSelect}>
                                    <i className='fa-solid fa-upload fs-5' style={{ cursor: 'pointer', display: displayMode.displayProfileEdit }} />&nbsp;Update resume
                                </button>
                                <input id='fileResume' name='fileResume' type='file' accept='application/msword, application/pdf' onChange={handleResumeUpload} style={{ display: 'none' }} />
                            </p>
                        </div>
                    </div>
                    <div className='col ms-3 pe-0'>
                        <div className='row rounded-5 ps-4 pt-2 pe-4 pb-2 mb-3 w-100' style={{ backgroundColor: 'white', height: 'max-content' }}>
                            <div className='col text-center m-0'>
                                <div className='row'>
                                    <div className='col col-sm-8 text-start pt-1'>
                                        <p className='fw-bolder fs-4 text-start m-0'>
                                            {/* <i className='fas fa-info-circle'></i> */}
                                            Basic Information
                                        </p>
                                    </div>
                                    <div className='col col-sm-4 text-end'>
                                        <i className='fa-solid fa-pencil fs-5 ms-4' style={{ cursor: 'pointer', display: displayMode.displayProfileEdit }} data-bs-toggle='modal' data-bs-target='#editCandidateProfileBasicInfoDialog'></i>
                                    </div>
                                </div>
                                <div className='text-center mt-3'>
                                    <form className='row g-3'>
                                        <div className='col-md-3 mt-2'>
                                            <div className="d-flex flex-row">
                                                <i className="fa-thin fa-mobile mt-1 formIcon"></i>
                                                <div className='d-flex flex-column ms-2'>
                                                    <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                        Mobile
                                                    </label>
                                                    <p className='fw-normal text-start fs-5 mb-1'>{profileData?.basicInfo?.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-3 mt-2'>
                                            <div className="d-flex flex-row">
                                                <i className="fa-thin fa-at mt-1 formIcon"></i>
                                                <div className='d-flex flex-column ms-2'>
                                                    <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                        Email
                                                    </label>
                                                    <p className='fw-normal text-start fs-5 mb-1'>{profileData?.basicInfo?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-3 mt-2'>
                                            <div className="d-flex flex-row">
                                                <i className="fa-thin fa-tachometer mt-1 formIcon"></i>
                                                <div className='d-flex flex-column ms-2'>
                                                    <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                        Experience
                                                    </label>
                                                    <p className='fw-normal text-start fs-5 mb-1'>{profileData?.basicInfo?.experience}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-md-3 mt-2'>
                                            <div className="d-flex flex-row">
                                                <i className="fa-thin fa-venus-mars mt-1 formIcon"></i>
                                                <div className='d-flex flex-column ms-2'>
                                                    <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                        Gender
                                                    </label>
                                                    <p className='fw-normal text-start fs-5 mb-1'>{profileData?.basicInfo?.gender}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-md-3 mt-2'>
                                            <div className="d-flex flex-row">
                                                <i className="fa-thin fa-globe mt-1 formIcon"></i>
                                                <div className='d-flex flex-column ms-2'>
                                                    <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                        Citizenship
                                                    </label>
                                                    <p className='fw-normal text-start fs-5 mb-1'>{profileData?.basicInfo?.citizenship}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-3 mt-2'>
                                            <div className="d-flex flex-row">
                                                <i className="fa-thin fa-passport mt-1 formIcon"></i>
                                                <div className='d-flex flex-column ms-2'>
                                                    <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                        Visa
                                                    </label>
                                                    <p className='fw-normal text-start fs-5 mb-1'>{profileData?.basicInfo?.visa}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-3 mt-2'>
                                            <div className="d-flex flex-row">
                                                <i className="fa-thin fa-money-check mt-1 formIcon"></i>
                                                <div className='d-flex flex-column ms-2'>
                                                    <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                        Annual salary
                                                    </label>
                                                    <p className='fw-normal text-start fs-5 mb-1'>{profileData?.basicInfo?.annualSalary}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-3 mt-2'>
                                            <div className="d-flex flex-row">
                                                <i className="fa-thin fa-id-card mt-1 formIcon"></i>
                                                <div className='d-flex flex-column ms-2'>
                                                    <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                        SSN (last 4 digits)
                                                    </label>
                                                    <p className='fw-normal text-start fs-5 mb-1'>{profileData?.basicInfo?.ssn}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-6 mt-2'>
                                            <div className="d-flex flex-row">
                                                <i className="fa-thin fa-map-marked mt-1 formIcon"></i>
                                                <div className='d-flex flex-column ms-2'>
                                                    <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                        Current address in US
                                                    </label>
                                                    <p className='fw-normal text-start fs-5 mb-1'>{profileData?.basicInfo?.address} {profileData?.basicInfo?.city} {profileData?.basicInfo?.country} {profileData?.basicInfo?.postcode}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className='row rounded-5 ps-4 pt-2 pe-4 pb-2 mb-3 w-100' style={{ backgroundColor: 'white', height: 'max-content' }}>
                            <div className='col text-center m-0'>
                                <div className='row'>
                                    <div className='col col-sm-8 text-start pt-1'>
                                        <p className='fw-bolder fs-4 text-start m-0'>
                                            {/* <i className='fas fa-clipboard-question'></i> */}
                                            Experiences
                                        </p>
                                    </div>
                                    <div className='col col-sm-4 text-end'>
                                        <i className='fa-solid fa-pencil fs-5' style={{ cursor: 'pointer', display: displayMode.displayProfileEdit }} data-bs-toggle='modal' data-bs-target='#editCandidateProfileExperienceInfoDialog' data-tooltip-id='napoleon-tooltip' data-tooltip-content='Edit experience info' />
                                        <i className='fa-solid fa-circle-plus fs-4 ms-3' style={{ cursor: 'pointer' }} data-bs-toggle='modal' data-bs-target='#addCandidateProfileExperienceInfoDialog'></i>
                                    </div>
                                </div>
                                <div className='text-center mt-3'>
                                    <form className='row g-3'>
                                        {
                                            (profileData?.experience)?.map((workEx, key) =>
                                                <div className='col-md-6 mt-2'>
                                                    <p className='fw-medium fs-5 fw-bold text-start mb-0'>
                                                        {/* <i className='fas fa-building'></i>&nbsp; */}
                                                        {workEx?.company}
                                                    </p>
                                                    <p className='fw-normal fs-5 text-start mb-1'>{workEx?.roleDescription}</p>
                                                </div>
                                            )
                                        }
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className='row rounded-5 ps-4 pt-2 pe-4 pb-2 mb-3 w-100' style={{ backgroundColor: 'white', height: 'max-content' }}>
                            <div className='col text-center m-0'>
                                <div className='row'>
                                    <div className='col col-sm-8 text-start pt-1'>
                                        <p className='fw-bolder fs-4 text-start m-0'>
                                            {/* <i className='fas fa-clipboard-question'></i> */}
                                            Education
                                        </p>
                                    </div>
                                    <div className='col col-sm-4 text-end'>
                                        <i className='fa-solid fa-pencil fs-5' style={{ cursor: 'pointer', display: displayMode.displayProfileEdit }} data-bs-toggle='modal' data-bs-target='#editCandidateProfileEducationInfoDialog' data-tooltip-id='napoleon-tooltip' data-tooltip-content='Edit education info' />
                                        <i className='fa-solid fa-circle-plus fs-4 ms-3' style={{ cursor: 'pointer' }} data-bs-toggle='modal' data-bs-target='#addCandidateProfileEducationInfoDialog'></i>
                                        {/* <button className='btn' type='button' data-bs-toggle='collapse' data-bs-target='#divEducationCertificationsCollapsible' aria-expanded='false' aria-controls='multiCollapseExample2' onClick={toggleCollapseIcon}> */}
                                        {/* <i id='iconCollapseInterviewDetails' style={{ cursor: 'pointer' }} className='fw-medium fas fa-square-plus fs-4 ms-3 mt-1' data-bs-toggle='collapse' data-bs-target='#divEducationCertificationsCollapsible' aria-expanded='false' aria-controls='multiCollapseExample2' onClick={toggleCollapseIcon}></i> */}
                                        {/* </button> */}
                                    </div>
                                </div>
                                <div className='text-center mt-2' id='divEducationCertificationsCollapsible'>
                                    <form className='row g-3'>
                                        {
                                            (profileData?.education)?.map((degree, key) =>
                                                <div className='col-md-4'>
                                                    <p className='fw-medium fs-5 fw-bold text-start mb-0'>
                                                        {/* <i className='fas fa-certificate'></i>&nbsp; */}
                                                        {degree?.degree}
                                                    </p>
                                                    <p className='fw-normal fs-5 text-start mb-1'>{degree?.institute}, {degree?.country} in {degree?.year}</p>
                                                </div>
                                            )
                                        }
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className='row rounded-5 ps-4 pt-2 pe-4 pb-2 mb-3 w-100' style={{ backgroundColor: 'white', height: 'max-content' }}>
                            <div className='col text-center m-0'>
                                <div className='row'>
                                    <div className='col col-sm-8 text-start m-0'>
                                        <p className='fw-bolder fs-4 text-start m-0'>
                                            {/* <i className='fas fa-briefcase'></i> */}
                                            Skills
                                        </p>
                                    </div>
                                    <div className='col col-sm-4 text-end'>
                                        <i className='fa-solid fa-pencil fs-5' style={{ cursor: 'pointer', display: displayMode.displayProfileEdit }} data-bs-toggle='modal' data-bs-target='#editCandidateProfileSkilInfoDialog' data-tooltip-id='napoleon-tooltip' data-tooltip-content='Edit skill info' />
                                        <i className='fa-solid fa-circle-plus fs-4 ms-3' style={{ cursor: 'pointer', display: displayMode.displayProfileEdit }} data-bs-toggle='modal' data-bs-target='#editCandidateProfileSkilInfoDialog'></i>
                                        {/* <button className='btn' type='button' data-bs-toggle='collapse' data-bs-target='#divSkillsCollapsible' aria-expanded='false' aria-controls='multiCollapseExample2' onClick={toggleCollapseIcon}> */}
                                        {/* <i id='iconCollapseInterviewDetails' style={{ cursor: 'pointer' }} className='fw-medium fas fa-square-plus fs-4 ms-3' data-bs-toggle='collapse' data-bs-target='#divSkillsCollapsible' aria-expanded='false' aria-controls='multiCollapseExample2' onClick={toggleCollapseIcon}></i> */}
                                        {/* </button> */}
                                    </div>
                                </div>
                                <div className='text-start mt-3' id='divSkillsCollapsible'>
                                    <form className='row g-3 fs-5'>
                                        {
                                            (profileData?.skill)?.map((topSkill, key) =>
                                                <div className='col-md-4 mt-2'>
                                                    <p className='fw-medium fs-5 fw-bold text-start mb-0'>
                                                        {/* <i className='fas fa-certificate'></i>&nbsp; */}
                                                        {topSkill?.skillName}
                                                        {/* <i className='fa-solid fa-pencil fs-5 ms-4' style={{ cursor: 'pointer', display: displayMode.displayProfileEdit }} data-bs-toggle='modal' data-bs-target='#editCandidateProfileSkilInfoDialog' /> */}
                                                    </p>
                                                    {/* <p className='fw-normal fs-5 text-start mb-1'>{topSkill?.proficiency}</p> */}
                                                </div>
                                            )
                                        }
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className='row rounded-5 ps-4 pt-2 pe-4 pb-2 w-100' style={{ backgroundColor: 'white', height: 'max-content' }}>
                            <div className='col m-0'>
                                <div className='row'>
                                    <div className='col col-sm-8 pt-1'>
                                        <p className='fw-bolder fs-4 text-start m-0'>
                                            {/* <i className='fas fa-clipboard-question'></i> */}
                                            Diversity & Inclusion Information
                                        </p>
                                    </div>
                                    <div className='col col-sm-4 text-end'>
                                        <i className='fa-solid fa-pencil fs-5' style={{ cursor: 'pointer', display: displayMode.displayProfileEdit }} data-bs-toggle='modal' data-bs-target='#editCandidateProfileDiversityInfoDialog'></i>
                                        {/* <button className='btn' type='button' data-bs-toggle='collapse' data-bs-target='#divDiversityInclusionCollapsible' aria-expanded='false' aria-controls='multiCollapseExample2' onClick={toggleCollapseIcon}> */}
                                        {/* <i id='iconCollapseInterviewDetails' style={{ cursor: 'pointer' }} className='fw-medium fas fa-square-plus fs-4 ms-3' data-bs-toggle='collapse' data-bs-target='#divDiversityInclusionCollapsible' aria-expanded='false' aria-controls='multiCollapseExample2' onClick={toggleCollapseIcon}></i> */}
                                        {/* </button> */}
                                    </div>
                                </div>
                                <div className='text-center mt-4' id='divDiversityInclusionCollapsible'>
                                    <form className='row g-3'>
                                        <div className='col-md-3 mt-1'>
                                            <div className="d-flex flex-row">
                                                <i className="fa-thin fa-globe mt-1 formIcon"></i>
                                                <div className='d-flex flex-column ms-2'>
                                                    <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                        Cultural diversity
                                                    </label>
                                                    <p className='fw-normal text-start fs-5 mb-1'>{profileData?.diversityInfo?.culture ? 'Yes' : 'No'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-3 mt-1'>
                                            <div className="d-flex flex-row">
                                                <i className="fa-thin fa-face-smile mt-1 formIcon"></i>
                                                <div className='d-flex flex-column ms-2'>
                                                    <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                        Racial diversity
                                                    </label>
                                                    <p className='fw-normal text-start fs-5 mb-1'>{profileData?.diversityInfo?.racial ? 'Yes' : 'No'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-3 mt-1'>
                                            <div className="d-flex flex-row">
                                                <i className="fa-thin fa-hands-praying mt-1 formIcon"></i>
                                                <div className='d-flex flex-column ms-2'>
                                                    <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                        Religious diversity
                                                    </label>
                                                    <p className='fw-normal text-start fs-5 mb-1'>{profileData?.diversityInfo?.culture ? 'Yes' : 'No'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-3 mt-1'>
                                            <div className="d-flex flex-row">
                                                <i className="fa-thin fa-stairs mt-1 formIcon"></i>
                                                <div className='d-flex flex-column ms-2'>
                                                    <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                        Age diversity
                                                    </label>
                                                    <p className='fw-normal text-start fs-5 mb-1'>{profileData?.diversityInfo?.age ? 'Yes' : 'No'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-3 mt-1'>
                                            <div className="d-flex flex-row">
                                                <i className="fa-thin fa-venus-mars mt-1 formIcon"></i>
                                                <div className='d-flex flex-column ms-2'>
                                                    <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                        Gender diversity
                                                    </label>
                                                    <p className='fw-normal text-start fs-5 mb-1'>{profileData?.diversityInfo?.gender ? 'Yes' : 'No'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-3 mt-1'>
                                            <div className="d-flex flex-row">
                                                <i className="fa-thin fa-people-group mt-1 formIcon"></i>
                                                <div className='d-flex flex-column ms-2'>
                                                    <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                        Sexual diversity
                                                    </label>
                                                    <p className='fw-normal text-start fs-5 mb-1'>{profileData?.diversityInfo?.sexual ? 'Yes' : 'No'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-3 mt-1'>
                                            <div className="d-flex flex-row">
                                                <i className="fa-thin fa-wheelchair mt-1 formIcon"></i>
                                                <div className='d-flex flex-column ms-2'>
                                                    <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                                        Disability                                                    
                                                    </label>
                                                    <p className='fw-normal text-start fs-5 mb-1'>{profileData?.diversityInfo?.disability ? 'Yes' : 'No'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CandidateProfile