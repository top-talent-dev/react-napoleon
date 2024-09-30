import { Link } from "react-router-dom";

const NavbarPreLogin = () => {
    return (
        <>
            <nav className='navbar navbar-expand-lg p-0 pt-2 pb-2' style={{ backgroundColor: 'black' }}>
                <div className='container-fluid'>
                    <Link className='nav-link' to='/'>
                        <img src={require('../images/Logo.png')} alt='Napoleon Logo' className='NavbarLogo' />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fas fa-bars" style={{ color: 'white' }}></i>
                    </button>
                    <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                        <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
                            <li className='nav-item ms-2 me-2'>
                                <Link className='nav-link active' aria-current='page' to='/KnowMore' style={{ color: 'white' }}>
                                    <i className='fas fa-circle-info fs-6'></i>&nbsp;&nbsp;Know us more
                                </Link>
                            </li>
                            <li className='nav-item ms-2 me-2'>
                                <Link className='nav-link' to='/Mission' style={{ color: 'white' }}>
                                    <i className='fas fa-bullseye fs-6'></i>&nbsp;&nbsp;Our mission
                                </Link>
                            </li>
                            <li className='nav-item ms-2 me-2'>
                                <Link className='nav-link' to='/Contact' style={{ color: 'white' }}>
                                    <i className='fas fa-comment fs-6'></i>&nbsp;&nbsp;Contact us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}
export default NavbarPreLogin