import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage(props) {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('homeBgImage');
    }, []);

    function handleLogin(event) {
        navigate('/PreLogin');
    }

    return (
        <>
            <div className='container-fluid'>
                {/* <img src={require('../images/HomePage-Background.png')} alt='Napoleon Logo' style={{height: '200px'}} /> */}
                {/* Screen size laptop, desktop and tablet */}
                <div className='d-none d-sm-block'>
                    <div className='row w-100'>
                        <div className='d-flex flex-row'>
                            <div className="rhombusTop-1" />
                            <div className="rhombusTop-2" />
                        </div>
                    </div>
                    <div className='row CenterContent w-100'>
                        <div className='col-sm text-center w-50'>
                            <img src={require('../images/NapoleonLogo-2.png')} alt='Napoleon Logo' width='30%' />
                            <p className='text-left fs-4 fw-normal mt-4' style={{ color: '#FFF' }}>
                                The new platform that gets qualified <br /> professionals and employers together.
                            </p>
                            <button type='button' className='btn btn-danger rounded-pill border-0 mt-5 mb-2' style={{ width: '15%' }} onClick={handleLogin}>
                                Login
                            </button>
                        </div>
                    </div>
                    <div className='row w-100'>
                        <div className='d-flex flex-row'>
                            <div className="rhombusBottom-1" />
                            <div className="rhombusBottom-2" />
                        </div>
                    </div>
                </div>

                {/* Screen size mobile */}
                <div className='row d-md-none'>
                    <div className='row w-100'>
                        <div className='d-flex flex-row'>
                            <div className="rhombusTopMobile-1" />
                            <div className="rhombusTopMobile-2" />
                        </div>
                    </div>
                    <div className='row CenterContentMobile w-100'>
                        <div className='col-sm text-center w-100'>
                            <img src={require('../images/NapoleonLogo-2.png')} alt='Napoleon Logo' className='w-75' />
                            <p className='text-left fs-4 fw-normal mt-4' style={{ color: '#FFF' }}>
                                The new platform that gets qualified <br /> professionals and employers together.
                            </p>
                            <button type='button' className='btn btn-danger rounded-pill border-0 mt-5 mb-2' style={{ width: '50%' }} onClick={handleLogin}>
                                Login
                            </button>
                        </div>
                    </div>
                    <div className='row w-100'>
                        <div className='d-flex flex-row'>
                            <div className="rhombusBottomMobile-1" />
                            <div className="rhombusBottomMobile-2" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}