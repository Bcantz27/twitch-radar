// React core
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch} from "react-router-dom"

import {NavBar} from "../Core Elements";
import Game from "../Game/Game";
import LandingPage from "../../containers/LandingPage/LandingPage";

class App extends Component {

  render() {
    const containerStyle = {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      padding: '0px',
    };

    return (
      <div className="container" style={containerStyle}>
        <Router>
          <NavBar />
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/app" component={Game} />
          </Switch>
        </Router>
      </div>
    );
  }

}

export default App;
