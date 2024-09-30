import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage(props) {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.backgroundImage = 'none';
    }, []);

    function handleCandidateSignin(event) {
        navigate('/Login', {
            state: {
                userRole: 'candidate'
            }
        });
    }

    function handleCompanySignin(event) {
        navigate('/Login', {
            state: {
                userRole: 'company'
            }
        });
    }

    function handleAdminSignin(event) {
        navigate('/Login', {
            state: {
                userRole: 'admin'
            }
        });
    }

    return (
        <>
            <div className='container-fluid'>
                {/* Screen size laptop, desktop and tablet */}
                <div className='w-100 d-none d-sm-block'>
                    <div className='row CenterContent w-100'>
                        <div className='col-sm text-center' style={{ position: 'relative' }}>
                            <div className="rhombus-1" style={{ position: 'relative', zIndex: 3, marginTop: '-20%' }}></div>
                            <img src={require('../images/HomePageImage-1.png')} alt='Napoleon Logo' width='50%' style={{ position: 'absolute', top: '15%', zIndex: 1, transform: 'translate(-50%, 0%)' }} />
                            <div className="rhombus-2" style={{ position: 'relative', zIndex: 3, marginLeft: '70%', marginTop: '15%' }}></div>
                        </div>
                        <div className='col-sm text-center w-100'>
                            <p className='text-left fs-1 fw-bold mb-1' style={{ color: '#32775E'}}>Welcome to</p>
                            <img src={require('../images/Logo.png')} alt='Napoleon Logo' width='50%' className='mb-3' />
                            <p className='text-left fs-5 fw-normal mb-3' style={{ color: '#32775E' }}>
                                The new platform that gets qualified <br /> professionals and employers together.
                            </p>
                            <div className='row'>
                                <div className='col-sm align-middle ms-auto me-auto pb-3'>
                                    <button type='button' className='btn btn-secondary rounded-pill border-0 mt-2 mb-2 w-75' style={{ backgroundColor: '#32775E', color: '#E2BF4B', height: '45px' }} onClick={handleCandidateSignin}>
                                        <i className='fa-solid fa-user fs-5 me-2'></i>
                                        Looking for my next dream job!
                                    </button>
                                    <button type='button' className='btn btn-secondary rounded-pill border-0 mt-2 mb-2 w-75' style={{ backgroundColor: '#A21825', color: '#E2BF4B', height: '45px' }} onClick={handleCompanySignin}>
                                        <i className='fa-solid fa-industry fs-5 me-2'></i>
                                        Searching for best talent
                                    </button>
                                    <button type='button' className='btn btn-secondary rounded-pill border-0 mt-2 mb-2 w-75' style={{ backgroundColor: '#E2BF4B', color: '#32775E', height: '45px' }} onClick={handleAdminSignin}>
                                        <i className='fa-solid fa-screwdriver-wrench fs-5 me-2'></i>
                                        Administrator
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Screen size mobile */}
                <div className='row d-md-none CenterContentMobile ms-auto me-auto' style={{ maxWidth: '95%' }}>
                    <div className='col-sm'>
                        <div className='text-center'>
                            <p className='text-left fs-1 fw-bold mb-3' style={{ color: '#32775E' }}>Welcome to</p>
                            <img src={require('../images/Logo.png')} alt='Napoleon Logo' className='mb-3' />

                            <div className='row'>
                                <div className='col-sm align-middle ms-auto me-auto pb-3'>
                                    <button type='button' className='btn btn-secondary rounded-pill border-0 mt-2 mb-2 w-100' style={{ backgroundColor: '#32775E', color: '#E2BF4B', height: '45px' }} onClick={handleCandidateSignin}>
                                        <i className='fa-solid fa-user fs-5 me-2'></i>
                                        Looking for my next dream job!
                                    </button>
                                    <button type='button' className='btn btn-secondary rounded-pill border-0 mt-2 mb-2 w-100' style={{ backgroundColor: '#A21825', color: '#E2BF4B', height: '45px' }} onClick={handleCompanySignin}>
                                        <i className='fa-solid fa-industry fs-5 me-2'></i>
                                        Searching for best talent
                                    </button>
                                    <button type='button' className='btn btn-secondary rounded-pill border-0 mt-2 mb-2 w-100' style={{ backgroundColor: '#E2BF4B', color: '#32775E', height: '45px' }} onClick={handleAdminSignin}>
                                        <i className='fa-solid fa-screwdriver-wrench fs-5 me-2'></i>
                                        Administrator
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}