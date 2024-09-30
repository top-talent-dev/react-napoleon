import { Link } from "react-router-dom";

const NavbarCandidateLogin = () => {
    return (
        <>
            <nav className='navbar navbar-expand-lg p-0 pt-2 pb-2' style={{ backgroundColor: '#135441' }}>
                <div className='container-fluid'>
                    <Link className='nav-link' to='/'>
                        <img src={require('../../images/Logo.png')} alt='Napoleon Logo' className='NavbarLogo' />
                    </Link>
                </div>
            </nav>
        </>
    )
}
export default NavbarCandidateLogin