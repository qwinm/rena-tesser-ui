import React from 'react';
import { Button, Modal } from 'react-bootstrap';




class TextShow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            show: this.props.show
        }
    }


    handleClose = () => this.setState({ show: false })
    handleShow = () => this.setState({ show: true })
    render() {
        return (<div>
            {/* <Button variant="primary" onClick={this.handleShow}>
                Launch demo modal
      </Button> */}

            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.props.text}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
          </Button>
                    <Button variant="primary" onClick={this.handleClose}>
                        Save Changes
          </Button>
                </Modal.Footer>
            </Modal>
        </div>
        )
    }
}

export default TextShow;
