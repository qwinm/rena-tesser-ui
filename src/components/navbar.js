import React from 'react';
import { Link } from "react-router-dom"
import './navbar.css';

class Nav extends React.Component {
    render() {
        return (
            <div>
                <ul className='uul'>
                    <li className='lli'><Link to="/dashboard">Home</Link></li>
                    <li className='lli'><Link to="/create">Create new User</Link></li>
                    <li className='lli'><Link to="/">Logout</Link></li>
                </ul>
            </div>

        )
    }
}
export default Nav;
