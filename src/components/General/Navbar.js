import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ConfirmLogoutDialog from './ConfirmLogoutDialog'
import useAuth from "../../hooks/useAuth";
import { axiosPrivate } from "../../api/axios";

const GET_COMPANY_PROFILE_IMAGE = '/company/getProfileImage';
const GET_CANDIDATE_PROFILE_IMAGE = '/candidate/getProfileImage';
let loggedinUserId = '';
let loggedinUserName = '';

const Navbar = () => {
    const { auth } = useAuth();
    const [menuLinks, setMenuLinks] = useState({
        homeLink: '',
        profileLink: ''
    });

    const [menuVisibility, setMenuVisibility] = useState({
        homeLinkDisplay: 'block',
        profileLinkDisplay: 'block'
    });

    const [imageLink, setImageLink] = useState('');
    const [userName, setUserName] = useState('');
    const runOnce = true;

    useEffect(() => {
        if (auth && auth.roles) {
            if (auth.roles[0] === 'company') {
                setMenuLinks({
                    homeLink: '/Company/Dashboard',
                    profileLink: '/Company/Profile'
                });
                loggedinUserId = JSON.parse(window.sessionStorage.getItem('loggedInUserDetails')).id;
                loggedinUserName = JSON.parse(window.sessionStorage.getItem('loggedInUserDetails')).contact_person + ' (' + JSON.parse(window.sessionStorage.getItem('loggedInUserDetails')).comp_name + ')';
            } else if (auth.roles[0] === 'admin') {
                setMenuLinks({
                    homeLink: '/Admin/Dashboard'
                });
                setMenuVisibility({
                    homeLinkDisplay: 'block',
                    profileLinkDisplay: 'none'
                });

                // loggedinUserName = 'System Administrator';
                loggedinUserId = JSON.parse(window.sessionStorage.getItem('loggedInUserDetails')).id;
                loggedinUserName = JSON.parse(window.sessionStorage.getItem('loggedInUserDetails')).first_name + ' ' + JSON.parse(window.sessionStorage.getItem('loggedInUserDetails')).last_name;
            } else if (auth.roles[0] === 'candidate') {
                setMenuLinks({
                    homeLink: '/Candidate/Dashboard',
                    profileLink: '/Candidate/Profile'
                });
                loggedinUserId = JSON.parse(window.sessionStorage.getItem('loggedInUserDetails')).id;
                loggedinUserName = JSON.parse(window.sessionStorage.getItem('loggedInUserDetails')).first_name + ' ' + JSON.parse(window.sessionStorage.getItem('loggedInUserDetails')).last_name;
            } else {
                setMenuLinks({
                    homeLink: '',
                    profileLink: ''
                });
            }

            setUserName(loggedinUserName);
        }
        fetchUserImage(loggedinUserId);
    }, [runOnce]);

    const fetchUserImage = async (loggedinUserId) => {
        try {
            var GET_PROFILE_IMAGE_URL = '';
            if (auth.roles[0] === 'company') {
                GET_PROFILE_IMAGE_URL = GET_COMPANY_PROFILE_IMAGE + "/" + loggedinUserId;
            } else if (auth.roles[0] === 'candidate') {
                GET_PROFILE_IMAGE_URL = GET_CANDIDATE_PROFILE_IMAGE + "/" + loggedinUserId;
            }

            const response = await axiosPrivate.get(GET_PROFILE_IMAGE_URL, {});
            console.log(JSON.stringify(response?.data));
            const fetchStatus = response?.data?.status;
            const fetchSuccess = response?.data?.success;

            if (fetchSuccess) {
                setImageLink(response?.data?.data?.profile_image?.image);
                var profileImage = {'profileImage': response?.data?.data?.profile_image?.image};
                window.sessionStorage.setItem('loggedInUserProfileImageLink', JSON.stringify(profileImage));
            }
        } catch (err) {
            if (!err?.response) {
                console.log('No Server Response');
            } else if (err.response?.status === 400) {
                console.log('Missing Username or Password');
            } else if (err.response?.status === 401) {
                console.log('Unauthorized');
            } else {
                console.log('Login Failed');
            }
        }
    }

    function handleImageLoadError(event) {
        event.target.src = null;
        event.target.src = require('../../images/ProfileImage.png');
    }

    return (
        <>
            <ConfirmLogoutDialog title='Confirm Logout' message='Are you sure to logout?' />
            <nav className='navbar navbar-expand-lg p-0 pt-2 pb-2' style={{ backgroundColor: 'BLACK' }}>
                <div className='container-fluid'>
                    <img src={require('../../images/Logo.png')} alt='Napoleon Logo' className='NavbarLogo' />
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fas fa-bars" style={{ color: 'white' }}></i>
                    </button>
                    <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                        <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
                            <li className='nav-item ms-5 me-2' style={{ display: menuVisibility.homeLinkDisplay }}>
                                <Link className='nav-link active' aria-current='page' to={menuLinks.homeLink} style={{ color: 'white' }}>
                                    {/* <i className='fas fa-house fs-6'></i>&nbsp;&nbsp; */}
                                    Home
                                </Link>
                            </li>
                            <li className='nav-item ms-2 me-2' style={{ display: menuVisibility.profileLinkDisplay }}>
                                <Link className='nav-link' to={menuLinks.profileLink} style={{ color: 'white' }}>
                                    {/* <i className='fas fa-user fs-6'></i>&nbsp;&nbsp; */}
                                    Profile
                                </Link>
                            </li>
                        </ul>
                        <span className='fs-5 fw-medium' style={{ color: 'white' }}>Welcome {userName}</span>&nbsp;&nbsp;
                        <div className="btn-group">
                            <button type="button" className="btn dropdown-toggle pe-0" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                <img src={imageLink} className='rounded-circle' style={{ width: '40px', height: '40px' }} onError={(event) => handleImageLoadError(event)} />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end ">
                                <li>
                                    <button className="dropdown-item" type="button" data-bs-toggle="modal" data-bs-target="#confirmDialog">
                                        <i className="fas fa-sign-out"></i>Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}
export default Navbar