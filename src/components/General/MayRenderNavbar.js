import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth';

export default function MayRenderNavbar({ children }) {
    const { auth } = useAuth();
    const location = useLocation();
    const [showNavbar, setShowNavbar] = useState(false);

    useEffect(() => {
        if (auth && auth.roles) {
            if (auth.roles[0] === 'company' || auth.roles[0] === 'candidate' || auth.roles[0] === 'admin') {
                setShowNavbar(true);
            } else {
                setShowNavbar(false);
            }
        } else {
            setShowNavbar(false);
        }
    }, [location]);

    return (
        <div>{showNavbar && children}</div>
    )
}