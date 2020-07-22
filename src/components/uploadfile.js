import React from "react"
import axios from "axios"
import API_URI from "../config"
// import Modal from "./modal"
import "./upload.css"
import { ReactComponent as FILE } from '../images/pdf.svg'
// import { ReactComponent as TIFF } from '../images/tiff.svg'
import { ReactComponent as DELETE } from '../images/delete.svg'
import { ReactComponent as DOWNLOAD } from '../images/download.svg'
import { ReactComponent as SEARCH } from '../images/search.svg'
import { Button, Modal } from 'react-bootstrap';
const { createWorker } = require('tesseract.js');


class Upload extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            images: [],
            selectedFile: null,
            documents: null,
            keyWord: "|all|",
            filesLength: 0,
            message: null,
            text: null,
            show: false
        }


    }
    componentDidMount() {
        this.getData()
    }

    getData = () => {
        const { keyWord } = this.state
        if (keyWord != "") {
            this.setState({ filesLength: "loading files....." })
            const token = localStorage.getItem("x-auth-token")
            fetch(`${API_URI}/getFiles/${keyWord.toLocaleLowerCase()}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "x-auth-token": token,
                },
            }).then(response => response.json()).then(res => {
                console.log(res);
                this.setState({ documents: res, filesLength: `${res.length} files found ` })
            })
        }
    }
    readFile = (textId) => {
        const { keyWord } = this.state
        const token = localStorage.getItem("x-auth-token")
        fetch(`${API_URI}/readDocument/${textId}`, {
            headers: {
                'Content-Type': 'application/json',
                "x-auth-token": token,
            },
        }).then(response => response.json()).then(res => {
            // console.log(res.text);

            let text = res.text
            const parts = text.split(new RegExp(`(${keyWord})`, 'gi'));
            const higText = <span> {parts.map((part, i) =>
                <span key={i} style={part.toLowerCase() === keyWord.toLowerCase() ? { backgroundColor: "yellow" } : {}}>
                    {part}
                </span>)
            } </span>;



            this.setState({ text: higText, show: true })
        })

    }
    delDocument = (name, txtname) => {
        const token = localStorage.getItem("x-auth-token")
        this.setState({ text: "file is deleting...", show: true })
        fetch(`${API_URI}/remove/${name}/${txtname}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "x-auth-token": token,
            },
        }).then(res => {
            this.getData()
            this.setState({ show: false })
        })

    }
    onKeyWordHandler = (e) => {
        this.setState({ keyWord: e.target.name }, () => {

            this.getData()
        })
    }
    onChangeHandler = (event) => {
        // console.log(event.target.files[0]);
        var reader = new FileReader();
        this.setState({ images: event.target.files[0] }, () => {
            reader.onload = (e) => {
                this.setState({ selectedFile: e.target.result })
            }
            reader.readAsDataURL(this.state.images)
        })
    }

    onClickHandler = async () => {
        // console.log(this.state.selectedFile);
        try {
            const worker = createWorker({
                logger: m => {
                    // console.log(m.status);
                    this.setState({ message: "uploading to ORC..." })
                    if (m.status == "recognizing text") {
                        const prog = m.progress * 100 + ""
                        this.setState({ message: `file is scanning... ${prog.substring(0, 4)}%` })
                    }
                }
            });
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const { data: { text } } = await worker.recognize(this.state.selectedFile);

            // console.log(text);

            this.setState({ selectedFile: null })
            this.setState({ message: "uploading to the cloude storage please wait..." })
            const token = localStorage.getItem("x-auth-token")
            const data = new FormData()
            data.append("file", this.state.images)

            axios.post(`${API_URI}/upload?textData=${text}`, data, { headers: { 'x-auth-token': token } })
                .then(response => {
                    // console.log(response.data);
                    this.setState({ message: null })
                    this.getData()
                    // this.setState({ succ: response.data, err: null })
                }).catch((err) => {
                    // this.setState({ message: err })
                    this.setState({ message: "uploading failed..." })
                });
        } catch (ex) {
            this.setState({ message: "scanning failed..." })
        }
    }
    downloadFile(documentId) {
        const token = localStorage.getItem("x-auth-token")
        axios.get(`${API_URI}/download/${documentId}`, { headers: { 'x-auth-token': token } })
            .then(response => {
                // console.log(response.data);
                const link = document.createElement('a');
                link.href = response.data
                document.body.appendChild(link);
                link.click();
            });
    }
    searchInput = (e) => {
        // console.log(e.target.value);
        this.setState({ keyWord: e.target.value })
    }
    handleClose = () => { this.setState({ show: false }) }

    render() {
        const { show, text, selectedFile, message, filesLength, keyWord, documents } = this.state
        return (
            <div >
                <Modal show={show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{text}</Modal.Body>
                </Modal>
                <div className="image" >
                    <img src={selectedFile}></img>
                </div>
                <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    capture="camera"
                    onChange={this.onChangeHandler}
                />
                <br />
                {selectedFile && <button onClick={this.onClickHandler} className="btn btn-success">Upload to the cloude</button>}

                < h1 style={{ color: "red" }}> {message && message}</h1 >

                <br />
                <div className="btn-group" role="group" aria-label="Basic example">
                    <button onClick={this.onKeyWordHandler} name="|all|" className="btn btn-warning">All</button>
                    <button onClick={this.onKeyWordHandler} name="payment" className="btn btn-secondary">payment</button>
                    <button onClick={this.onKeyWordHandler} name="receipt" className="btn btn-secondary">receipt</button>
                    <button onClick={this.onKeyWordHandler} name="sales" className="btn btn-secondary">sales</button>
                    <button onClick={this.onKeyWordHandler} name="invoice" className="btn btn-secondary">invoice</button>
                    <button onClick={this.onKeyWordHandler} name="purchase" className="btn btn-secondary">purchase</button>
                </div>

                <input style={{ width: "300px" }} type='text' placeholder="type keyword..." className="form-control" onChange={this.searchInput} />
                <button onClick={this.getData} className="btn btn-success">Search</button>
                <br />
                {keyWord !== "|all|" && <span style={{ backgroundColor: "yellow", fontSize: "24px" }}>{keyWord}</span>}

                <h2 className="text-info">{filesLength}</h2>
                <div>
                    {
                        documents && documents.map((item, index) => {
                            return (
                                <div key={index} className="document-item">
                                    <h4>{item.documentName}</h4>
                                    <FILE />
                                    <div className="line">
                                        <SEARCH className="icon" onClick={() => this.readFile(item.textId)} />
                                        <DOWNLOAD className="icon" onClick={() => this.downloadFile(item.documentId)} />
                                        <DELETE className="icon" onClick={() => this.delDocument(item.documentId, item.textId)} />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div >
        )
    }
}
export default Upload
