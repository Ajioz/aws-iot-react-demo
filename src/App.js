import "./App.css";
import React from "react";
import { withAuthenticator } from "aws-amplify-react";
import MQTTDisplay from "./MQTTDisplay";
import Form from "./Form";

// import AuthDisplay from './AuthDisplay';
// import Display from "./Display";
// import logo from "./logo.svg";

function App(props) {
  return (
    <div className="App">
      <div className="container">
        <MQTTDisplay {...props} />
        <Form />
      </div>
      {/* <AuthDisplay {...props} /> */}
    </div>
  );
}

export default withAuthenticator(App, true);
