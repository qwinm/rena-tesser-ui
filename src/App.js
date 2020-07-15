import React from 'react';
import Upload from "./components/uploadfile"
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Login from "./components/login"
import Create from "./components/create"
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
          <Route path="/dashboard" component={Upload} />
          <Route path="/create" component={Create} />
        </Router>
      </div>

    )
  }
}

export default App;
