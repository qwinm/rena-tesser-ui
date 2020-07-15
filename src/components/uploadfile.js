import React from "react"
import axios from "axios"
import API_URI from "../config"
import "./upload.css"
import { ReactComponent as PDF } from '../images/pdf.svg'
import { ReactComponent as TIFF } from '../images/tiff.svg'
import { ReactComponent as DELETE } from '../images/delete.svg'
import { ReactComponent as DOWNLOAD } from '../images/download.svg'
import { ReactComponent as SEARCH } from '../images/search.svg'



class Upload extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            images: [],
            allOrders: [],
            selectedFile: null,
            documents: null,
            keyWord: "all"
        }


    }
    componentDidMount() {
        this.getData()
    }

    getData = () => {
        const token = localStorage.getItem("x-auth-token")
        fetch(`${API_URI}/getFiles/${this.state.keyWord}`, {
            headers: {
                'Content-Type': 'application/json',
                "x-auth-token": token,
            },
        }).then(response => response.json()).then(res => {
            console.log(res);
            this.setState({ documents: res })
        })


    }

    delDocument = (name, txtname) => {
        const token = localStorage.getItem("x-auth-token")
        fetch(`${API_URI}/remove/${name}/${txtname}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "x-auth-token": token,
            },
        }).then(res => {
            this.getData()
        })

    }
    onKeyWordHandler = (e) => {
        this.setState({ keyWord: e.target.name }, () => {

            this.getData()
        })

    }
    onChangeHandler = (event) => {

        var reader = new FileReader();
        this.setState({ images: event.target.files[0] }, () => {

            reader.onload = (e) => {
                this.setState({ selectedFile: e.target.result })
            }
            reader.readAsDataURL(this.state.images)
        })
    }
    onClickHandler = () => {
        const data = new FormData()

        data.append("file", this.state.images)

        const token = localStorage.getItem("x-auth-token")
        /////////////////

        axios.post(`${API_URI}/upload`, data, { headers: { 'x-auth-token': token } })
            .then(response => {
                this.setState({ selectedFile: null })
                //////////
                this.getData()
                ////////
                console.log(response.data);
                // this.setState({ succ: response.data, err: null })
            }).catch((err) => {
                // console.log(err.response.data);
                // this.setState({ err: err.response.data })
            });
    }


    render() {
        return (
            <div>

                <div className="vvv ">
                    <ul>
                        <li>
                            <div className="divType">load image</div>
                            <div className="left">
                                <img src={this.state.selectedFile}></img>
                            </div>
                            <div className="divTableStyle">
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={this.onChangeHandler}
                                />

                            </div>
                        </li>
                        <li>
                            <div className="divType">Upload to cloude</div>
                            <div className="divTableStyle">
                                <input
                                    type="button"
                                    value="upload"
                                    onClick={this.onClickHandler}
                                    className="btn-success"
                                />
                            </div>
                        </li>
                    </ul>

                </div>
                <button onClick={this.onKeyWordHandler} name="all">All</button>
                <button onClick={this.onKeyWordHandler} name="ttt">ttt</button>
                <button onClick={this.onKeyWordHandler} name="rrr">rrr</button>
                <button onClick={this.onKeyWordHandler} name="app">app</button>
                <button onClick={this.onKeyWordHandler} name="Payment">Payment</button>
                <button onClick={this.onKeyWordHandler} name="receipt">receipt</button>
                <button onClick={this.onKeyWordHandler} name="sales">sales</button>
                <button onClick={this.onKeyWordHandler} name="invoice">invoice</button>
                <button onClick={this.onKeyWordHandler} name="purchase">purchase</button>
                <button onClick={this.onKeyWordHandler} name="invoice">invoice</button>
                <div style={{ color: "red" }}>{this.state.keyWord}</div>
                <div>
                    {
                        this.state.documents && this.state.documents.map((item, index) => {
                            return (
                                <div key={index} className="document-item">
                                    <h4>{item.documentName.substr(0, 20)}</h4>
                                    {item.documentName.split('.')[1] === 'pdf' ? <PDF className='pdf-icon' /> : item.documentName.split('.')[1] === 'tif' ? <TIFF className='pdf-icon' /> : <img src={`${item.documentURL}`} alt="Document img" />}
                                    <div className="line">
                                        <SEARCH className="icon" onClick={() => this.readFile(item.textId)} />
                                        <a href={`${item.documentURL}`}>
                                            <DOWNLOAD className="icon" />
                                        </a>

                                        <DELETE className="icon" onClick={() => this.delDocument(item.documentId, item.textId)} />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
export default Upload
