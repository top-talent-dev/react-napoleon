import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation, useMatch } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';

var GET_PROFILE_DATA = '/company/getCompProfile';

const CompanyProfile = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const { state } = useLocation();
    var isAdminRoute = useMatch("/Admin/Dashboard/CompanyProfile");
    const [displayMode, setDisplayMode] = useState({
        displayProfileEdit: auth.roles[0] === 'company' ? 'block' : 'none'
    });
    const [profileData, setProfileData] = useState({});

    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const runOnce = true;

    useEffect(() => {
        console.log('i fire once');
        if (state?.id && isAdminRoute) {
            console.log('Company ID: ' + state.id);
            GET_PROFILE_DATA = '/superadmin/getCompanyDetails' + '/' + state.id;
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

    function handleCencelProfileView(event) {
        if (isAdminRoute) {
            navigate('/Admin/Dashboard');
        } else {
            navigate('/Company/Dashboard');
        }
    }

    return (
        <>
            <div className='container mt-3' style={{ maxWidth: '95%', height: 'max-content' }}>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <div className='row rounded-5 ps-4 pt-2 pe-4 pb-2' style={{ height: '100%', backgroundColor: 'white', borderRadius: '20px' }}>
                    <div className='col col-lg-2 text-center m-0'>
                        <img src={profileData.image} alt='Company Profile' className='mt-3 mb-2 rounded-circle' style={{ height: '150px', width: '150px' }} />
                    </div>
                    <div className='col text-start m-0'>
                        <div className='d-flex'>
                            <p className='fs-3 fw-bold text-start mt-4 mb-1 me-auto' style={{ color: '#B18818' }}>{profileData.name}</p>
                            <Link to="/Company/Profile/Edit" className="link-primary" style={{ display: displayMode.displayProfileEdit }}>
                                <i className='fa-solid fa-pencil fs-4 mt-3 me-2'></i>
                            </Link>
                        </div>
                        <p className='fs-5 fw-light text-start'>
                            {/* <i className='fa-thin fa-map-marker-alt'></i>&nbsp; */}
                            {profileData?.address}, {profileData?.city}, {profileData?.country}, {profileData?.postcode}
                        </p>
                        <p className='fw-normal text-start fs-5'>
                            Company description to be added by service
                        </p>
                        <p className='fw-light text-start fs-5' >
                            {/* <i className='fa-thin fa-fingerprint'></i>&nbsp; */}
                            {profileData.businessId}</p>
                    </div>

                    <div className='col col-lg-12 mt-4 text-center'>
                        <p className='fw-bolder text-start ms-4 fs-4'>Business Highlights</p>
                        <div className='row g-3 ms-3'>
                            <div className='col-md-3 mt-2'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-industry mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Interview date
                                        </label>
                                        <p className='fw-normal text-start mb-1 fs-5'>{profileData?.business?.industry}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3 mt-2'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-building mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Sub-industry
                                        </label>
                                        <p className='fw-normal text-start mb-1 fs-5'>{profileData?.business?.sub_industry}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3 mt-2'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-sack-dollar mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Annual revenue
                                        </label>
                                        <p className='fw-normal text-start mb-1 fs-5'>{profileData?.business?.annualRevenue}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3 mt-2'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-users mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Total employees
                                        </label>
                                        <p className='fw-normal text-start mb-1 fs-5'>{profileData?.business?.employeeCount}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3 mt-2'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-link mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Linkedin address
                                        </label>
                                        <p className='fw-normal text-start mb-1 fs-5'>{profileData?.business?.likedinPage}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3 mt-2'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-anchor mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Twitter handle
                                        </label>
                                        <p className='fw-normal text-start mb-1 fs-5'>{profileData?.business?.twitterHandle}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='col col-lg-12 mt-4 m-0 text-center'>
                        <p className='fw-bolder text-start mt-2 ms-4 fs-4'>Business Contact Information</p>
                        <form className='row g-3 ms-3'>
                            <div className='col-md-3'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-user mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Contact name
                                        </label>
                                        <p className='fw-normal text-start mb-1 fs-5'>{profileData?.contant?.name}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3 mt-2'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-chair mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Title / Designation
                                        </label>
                                        <p className='fw-normal text-start mb-1 fs-5'>{profileData?.contant?.designation}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3 mt-2'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-phone mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Contact number
                                        </label>
                                        <p className='fw-normal text-start mb-1 fs-5'>{profileData?.contant?.phone}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3 mt-2'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-mobile mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Alternate contact number
                                        </label>
                                        <p className='fw-normal text-start mb-1 fs-5'>{profileData?.contant?.alternatePhone}</p>
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
                                        <p className='fw-normal text-start mb-1 fs-5'>{profileData?.contant?.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3 mt-2'>
                                <div className="d-flex flex-row">
                                    <i className="fa-thin fa-location mt-1 formIcon"></i>
                                    <div className='d-flex flex-column ms-2'>
                                        <label htmlFor="txtExperience" className="col-form-label fw-bold text-start fs-5 p-0">
                                            Contact person location
                                        </label>
                                        <p className='fw-normal text-start mb-1 fs-5'>{profileData?.contant?.address}, {profileData?.contant?.city}, {profileData?.contant?.country}, {profileData?.contant?.postcode}</p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="mt-3 text-center">
                        <button type="button" className="btn btn-success mb-3" onClick={handleCencelProfileView}>
                            <i className="fa-solid fa-arrow-left"></i>&nbsp;Go back
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CompanyProfile