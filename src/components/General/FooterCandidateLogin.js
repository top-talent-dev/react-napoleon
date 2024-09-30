import { Link } from "react-router-dom";

const FooterCandidateLogin = () => {
    return (
        <>
            <footer id="sticky-footer" className="flex-shrink-0 w-100 text-center text-white fs-5 py-2" style={{ backgroundColor: '#135340', position: 'absolute', bottom: 0 }}>
                <ul className='ms-auto me-auto mb-2 mb-lg-0 d-inline-block' style={{ listStyleType: 'none' }}>
                    <li className='nav-item ms-2 me-2' style={{ float: 'left' }}>
                        <Link className='nav-link active' aria-current='page' to='/KnowMore' style={{ color: 'white' }}>
                            Napoleone 2023
                        </Link>
                    </li>
                    <li className='nav-item ms-2 me-2' style={{ float: 'left' }}>
                        <Link className='nav-link' to='/Mission' style={{ color: 'white' }}>
                            About
                        </Link>
                    </li>
                    <li className='nav-item ms-2 me-2' style={{ float: 'left' }}>
                        <Link className='nav-link' to='/Contact' style={{ color: 'white' }}>
                            User Agreement
                        </Link>
                    </li>
                    <li className='nav-item ms-2 me-2' style={{ float: 'left' }}>
                        <Link className='nav-link' to='/Contact' style={{ color: 'white' }}>
                            Privacy Policy
                        </Link>
                    </li>
                    <li className='nav-item ms-2 me-2' style={{ float: 'left' }}>
                        <Link className='nav-link' to='/Contact' style={{ color: 'white' }}>
                            Cookie Policy
                        </Link>
                    </li>
                    <li className='nav-item ms-2 me-2' style={{ float: 'left' }}>
                        <Link className='nav-link' to='/Contact' style={{ color: 'white' }}>
                            Copyright Policy
                        </Link>
                    </li>
                    <li className='nav-item ms-2 me-2' style={{ float: 'left' }}>
                        <Link className='nav-link' to='/Contact' style={{ color: 'white' }}>
                            Brand Policy
                        </Link>
                    </li>
                    <li className='nav-item ms-2 me-2' style={{ float: 'left' }}>
                        <Link className='nav-link' to='/Contact' style={{ color: 'white' }}>
                            Help
                        </Link>
                    </li>
                </ul>
            </footer>
        </>
    )
}
export default FooterCandidateLogin