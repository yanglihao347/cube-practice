import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import './common.scss';
import HomePage from './components/HomePage';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <Router>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          {/* <Route path="/about">
            <About />
          </Route> */}
          {/* <Route path="/video">
            <VideoPlayer />
          </Route> */}
          <Route path="/">
            <HomePage />
          </Route>
          
          
          {/* <Route path="/">
            <Home />
          </Route> */}
        </Switch>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));