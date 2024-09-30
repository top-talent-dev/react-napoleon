import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PreLoginPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.remove('homeBgImage');
        document.body.classList.add('PreLoginBgImage');
    }, []);

    function handleCandidateSignin(event) {
        navigate('/LoginCandidate', {
            state: {
                userRole: 'candidate'
            }
        });
    }

    function handleCompanySignin(event) {
        navigate('/LoginCompany', {
            state: {
                userRole: 'company'
            }
        });
    }

    return (
        <>
            <div className='container-fluid w-100'>
                <img src={require('../images/NapoleonLogo-2.png')} alt='Napoleon Logo' className='ms-4 mt-4' style={{ minWidth: '10%', width: '15%' }} />
                <div className='d-none d-sm-block w-50 text-center PreLoginLeftContent'>
                    <button type="button" className="btn rounded-4 fs-4 fw-bold PreLoginButtonGreen" onClick={handleCandidateSignin}>Professionals</button>
                    <p className='text-left fs-4 fw-normal mt-2' style={{ color: '#B18818' }}>
                        Make a difference in your career <br /> and in the world
                    </p>
                </div>

                <div className='d-none d-sm-block w-50 text-center PreLoginRightContent'>
                    <p className='text-left fs-4 fw-normal mt-2' style={{ color: '#FFFFFF' }}>
                        Every candidate you find <br /> brings us one step closer to success
                    </p>
                    <button type="button" className="btn rounded-4 fs-4 fw-bold PreLoginButtonRed" onClick={handleCompanySignin}>Employers</button>
                </div>

                {/* Screen size mobile */}
                <div className='row d-md-none text-center PreLoginLeftContentMobile'>
                    <button type="button" className="btn rounded-4 fs-5 fw-bold ms-auto me-auto PreLoginButtonGreen" onClick={handleCandidateSignin}>Professionals</button>
                    <p className='text-left fs-5 fw-normal mt-2' style={{ color: '#B18818' }}>
                        Make a difference in your career <br /> and in the world
                    </p>
                </div>

                <div className='row d-md-none text-center PreLoginRightContentMobile'>
                    <button type="button" className="btn rounded-4 fs-5 fw-bold ms-auto me-auto PreLoginButtonRed" onClick={handleCompanySignin}>Employers</button>
                    <p className='text-left fs-5 fw-normal mt-2' style={{ color: '#FFFFFF' }}>
                        Make a difference in your career <br /> and in the world
                    </p>
                </div>
            </div>
        </>
    );
}
export default PreLoginPage