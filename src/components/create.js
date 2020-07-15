import React from 'react';
import axios from 'axios';
import configs from '../config.js';
class Create extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: { name: "", email: "", password: "" },
            err: null,
            succ: null
        }
    }
    impVal = (e) => {
        this.state.user[e.target.name] = e.target.value
        this.setState({})
    }
    create = async () => {
        let user = this.state.user
        const token = localStorage.getItem("x-auth-token")
        /////////////////

        axios.post(`${configs.API_URL}/create`, { user }, { headers: { 'x-auth-token': token } })
            .then(response => {
                console.log(response.data);
                this.setState({ succ: response.data, err: null })
            }).catch((err) => {
                console.log(err.response.data);
                this.setState({ err: err.response.data })
            });
    }
    render() {
        return (
            <div>

                <div className="container">


                    <input type="text" placeholder="Enter Name" name="name" onChange={this.impVal} required />
                    <input type="text" placeholder="Enter Email" name="email" onChange={this.impVal} required />


                    <input type="password" placeholder="Enter Password" name="password" onChange={this.impVal} required />


                    <h1 style={{ color: "green" }}>{this.state.succ}</h1>
                    <div style={{ color: "red" }}>{this.state.err}</div>


                    <div className="clearfix">
                        <button type="submit" className="signupbtn" onClick={this.create} id="bbb">Create</button>
                    </div>
                </div>

            </div>



        )
    }
}

export default Create
