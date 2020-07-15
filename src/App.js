import React from 'react';
import Upload from "./components/uploadfile"
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Login from "./components/login"
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Router>
          <Route path="/" component={Login} exact />
          <Route path="/dashboard" component={Upload} exact />
        </Router>
      </div>

    )
  }
}

export default App;
