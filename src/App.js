import logo from './logo.svg';
import './App.css';
import {TopNavbar} from "./elements/navbars";
import {TilStat} from "./pages/tilstat";

import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from "react-bootstrap";
import {Switch, Route, BrowserRouter as Router, Redirect} from "react-router-dom"
import {TilStatHof} from "./pages/tilstathof";

/**
 * The options array should contain objects.
 * Required keys are "name" and "value" but you can have and use any number of key/value pairs.
 */

/* Simple example */


function App() {
  return <Router>
    <TopNavbar />
    <Container className="main-cont">
      <Switch>
        <Route path="/" exact>
          <Redirect to="/tilstat" />
        </Route>
        <Route path="/tilstat" exact>
          <TilStat />
        </Route>
        <Route path="/tilstat/hof" exact>
          <TilStatHof />
        </Route>
      </Switch>
    </Container>
  </Router>
}

export default App;
