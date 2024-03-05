import "./App.css";
import React, { useState } from "react";
import { withAuthenticator } from "aws-amplify-react";
import MQTTDisplay from "./MQTTDisplay";
import Form from "./Form";

function App(props) {
  const [isConnected, setIsConnected] = useState(false);
  return (
    <div className="App">
      <div className="container">
        <MQTTDisplay
          {...props}
          setIsConnected={setIsConnected}
          isConnected={isConnected}
        />
        <Form isConnected={isConnected} />
      </div>
    </div>
  );
}

export default withAuthenticator(App, true);
