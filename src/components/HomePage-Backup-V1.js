import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage(props) {
    const navigate = useNavigate();

    function handleCandidateSignin(event) {
        navigate('/Login');
    }

    function handleCompanySignin(event) {
        navigate('/Login');
    }

    function handleAdminSignin(event) {
        navigate('/Login');
    }

    return (
        <div className='container-fluid'>
            <div className='row ms-auto CenterContent loginSectionWidth' style={{ minWidth: '35%' }}>
                <div className='col-sm rounded-4 align-middle ms-auto me-auto pb-3' style={{ backgroundColor: 'white' }}>
                    <div className='text-center ms-auto me-auto p-2'>
                        <img src={require('../images/Logo.png')} alt='Napoleon Logo' className='mb-1' />
                        <p className='text-left fs-3 fw-light mb-3'>Sign in to continue</p>
                        <button type='button' className='btn btn-primary mt-2 mb-2 w-100' onClick={handleCandidateSignin}>
                            <i className='fa-solid fa-user fs-5 me-2'></i>
                            Signin as Candidate
                        </button>
                        <button type='button' className='btn btn-info mt-2 mb-2 w-100' onClick={handleCompanySignin}>
                            <i className='fa-solid fa-industry fs-5 me-2'></i>
                            Signin as Company
                        </button>
                        <button type='button' className='btn btn-secondary mt-2 mb-2 w-100' onClick={handleAdminSignin}>
                            <i className='fa-solid fa-screwdriver-wrench fs-5 me-2'></i>
                            Signin as Administrator
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}