import React, { useState, useEffect } from "react";
import AWSConfiguration from "./aws-iot-configuration.js";
import { Auth } from "aws-amplify";
import AWSIoTData from "aws-iot-device-sdk";

import Display from "./Display.jsx";

const MQTTSubscription = (props) => {
  const [isConnected, setIsConnected] = useState(false);
  const [mqttClient, setMqttClient] = useState();
  const [messages, setMessages] = useState();

  useEffect(() => {
    connectToAwsIot();
    return () => {
      // this gets called when component is destroyed...
      //https://github.com/mqttjs/MQTT.js/blob/master/README.md#end
      console.log(`Ended subscription to '${props.topic}'...`);
    };
  }, []); // the "[]" causes this to execute just once

  async function connectToAwsIot() {
    // mqtt clients require a unique clientId; we generate one below
    let clientId = "mqtt-explorer-" + Math.floor(Math.random() * 100000 + 1);

    // get credentials and, from them, extract key, secret key, and session token
    // Amplify's auth functionality makes this easy for us...
    let currentCredentials = await Auth.currentCredentials();
    let essentialCredentials = Auth.essentialCredentials(currentCredentials);

    // Create an MQTT client
    let newMqttClient = AWSIoTData.device({
      region: AWSConfiguration.region,
      host: AWSConfiguration.host,
      clientId: clientId,
      protocol: "wss",
      maximumReconnectTimeMs: 8000,
      debug: true,
      accessKeyId: essentialCredentials.accessKeyId,
      secretKey: essentialCredentials.secretAccessKey,
      sessionToken: essentialCredentials.sessionToken,
      });
      console.log(
      "Subscriber trying to connect to AWS IoT for clientId:",
      clientId
    );

    // On connect, update status
    newMqttClient.on("connect", function () {
      setIsConnected(true);
      newMqttClient.subscribe(props.topic);
      console.log("Connected to AWS IoT for clientId:", clientId);
      console.log(`Subscribed to ${props.topic}`);
    });

    // add event handler for received messages
    newMqttClient.on("message", function (topic, payload) {
      // let myDate = `${new Date().toLocaleDateString()}${new Date().toLocaleTimeString()}`;
      // let newMessage = `${myDate} - topic '${topic}' - \n ${payload.toString()}`;
      let rawMessage = payload.toString();
      //   let newMessage = JSON.parse(payload);
      let newMessage = rawMessage.split(":")[1];
      let finalMsg = newMessage.split("}")[0];
      setMessages(finalMsg);
      // console.log(finalMsg);
    });
    // update state to track mqtt client
    setMqttClient(newMqttClient);
  }

  function handleUnsubscribe(e) {
    // stop submit button from refreshing entire page
    e.preventDefault();
    // end subscription; I think this could be added to the return() of the useEffect(), as an "onUnmount" handler,
    // but I received an erropr when I tried it. I might be doing something wrong but for now, it works with the commands
    // below...
    mqttClient.end(false);
    setIsConnected(false);
    // remove subscription from parent component, thus killing this component...
    props.removeSubscription(props.topic);
  }

  return (
    <div className="MQTTSubscription">
      <h4>
        Status: "{props.topic}" ({isConnected ? "connected" : "not connected"})
      </h4>
      <form onSubmit={handleUnsubscribe}>
        <button className="btn" type="submit">
          Unsubscribe
        </button>
      </form>
      <Display message={messages} />
    </div>
  );
};

export default MQTTSubscription;
