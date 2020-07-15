import React from 'react';
import axios from 'axios';
import API_URI from "../config"

import './login.css';

class Nav extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user: { email: "", password: "" },
            err: ''
        }
    }

    impVal = (e) => {
        this.state.user[e.target.name] = e.target.value
        this.setState({})
    }
    login = async () => {
        let user = this.state.user;
        console.log('User', user);
        // console.log('API_URL', configs.API_URL);
        axios.post(`${API_URI}/login`, { user }).then((res) => {
            console.log('Login response', res);
            if (res.headers["x-auth-token"]) {
                localStorage.setItem("x-auth-token", res.headers["x-auth-token"]);
                this.props.history.push({ pathname: "/dashboard" });
            }
        }).catch((err) => {
            console.log('Failed in login', err);
            this.setState({ err: err.response.data })
        });
    }
    render() {
        return (
            <div>

                <div className="container">


                    <input type="text" placeholder="Enter Email" name="email" onChange={this.impVal} required />


                    <input type="password" placeholder="Enter Password" name="password" onChange={this.impVal} required />


                    <div style={{ color: "red" }}>{this.state.err}</div>
                    <div className="clearfix">
                        <button type="submit" className="signupbtn" onClick={this.login} id="bbb">Login</button>
                    </div>
                </div>

            </div>

        )
    }
}
export default Nav;
