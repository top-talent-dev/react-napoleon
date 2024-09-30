import { Link } from "react-router-dom";

const NavbarCompanyLogin = () => {
    return (
        <>
            <nav className='navbar navbar-expand-lg p-0 pt-2 pb-2' style={{ backgroundColor: '#93131D' }}>
                <div className='container-fluid'>
                    <Link className='nav-link' to='/'>
                        <img src={require('../../images/Logo.png')} alt='Napoleon Logo' className='NavbarLogo' />
                    </Link>
                </div>
            </nav>
        </>
    )
}
export default NavbarCompanyLogin