import React, { useState, useEffect } from "react";
import Amplify, { Auth } from "aws-amplify";
import awsmobile from "./aws-exports";
import AWSIoTData from "aws-iot-device-sdk";
import AWSConfiguration from "./aws-iot-configuration.js";
import MQTTSubscription from "./MQTTSubscription.jsx";
import { useGlobalContext } from "./context";

Amplify.configure(awsmobile);

/*
Note - I attempted to use Amplify PubSub for IoT message handling but found that
it lacked adequate functionality to handle multiple subscriptions easily. Therefore, 
I opted to use aws-iot-devide-sdk which proved much easier to use. 
*/

//######################################################################################
function arrayRemove(arr, value) {
  // REMOVE SPECIFIC ITEM BY VALUE FROM AN ARRAY
  //https://love2dev.com/blog/javascript-remove-from-array/
  return arr.filter(function (ele) {
    return ele !== value;
  });
}
//######################################################################################

let types = [{ name: "Select" }];
let savedItems = [];
let value;

function MQTTDisplay(props) {
  const { saveItem } = useGlobalContext();

  // ALLOW USER TO SUBSCRIBE TO MQTT TOPICS
  const [desiredSubscriptionTopic, setDesiredSubscriptionTopic] = useState("#");
  const [desiredPublishTopic, setDesiredPublishTopic] = useState("?");
  const [desiredPublishMessage, setDesiredPublishMessage] = useState(
    `{ "message": "Hello, world!" }`
  );
  const [subscribedTopics, setSubscribedTopics] = useState([]);

  // isConnected and mqttClient strictly used for publishing;
  // Subscriptions are instead handled in child MQTTSubscription components
  const [isConnected, setIsConnected] = useState(false);
  const [mqttClient, setMqttClient] = useState();

  useEffect(() => {
    connectToAwsIot();
    if (saveItem.length > 0) {
      savedItems = JSON.parse(saveItem);
      savedItems.map((item) => types.push(item));
    }
  }, [saveItem]); // the empty [] ensures only run once

  async function connectToAwsIot() {
    // This connection/function is only for publishing messages;
    // Subscriptions each get their own child object with separate connections.

    // mqtt clients require a unique clientId; we generate one below
    let clientId =
      "iotcognito-cp-sampleapp-" + Math.floor(Math.random() * 100000 + 1);

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
      "Publisher trying to connect to AWS IoT for clientId:",
      clientId
    );
    // On connect, update status
    newMqttClient.on("connect", function () {
      setIsConnected(true);
      console.log("Publisher connected to AWS IoT for clientId:", clientId);
    });
    // update state to track mqtt client
    setMqttClient(newMqttClient);
  }

  function removeSubscription(topic) {
    // This function is passed to child components
    setSubscribedTopics(arrayRemove(subscribedTopics, topic));
  }

  const filterSubscription = (arr, topic) => {
    // This function is passed to child components
    let restSub = arr.filter((item) => item === topic);
    setSubscribedTopics(restSub);
  };

  function handleSubscriptionRequest() {
    // stop submit button from refreshing entire page

    if (subscribedTopics.includes(desiredSubscriptionTopic)) {
      console.log(
        `You are already subscribed to topic '${desiredSubscriptionTopic}'!`
      );
    } else {
      setSubscribedTopics((prevTopics) => [
        ...prevTopics,
        desiredSubscriptionTopic,
      ]);
      console.log(`Subscribed to topic '${desiredSubscriptionTopic}'!`);
    }
  }

  function handlePublishRequest(e) {
    // stop submit button from refreshing entire page
    e.preventDefault();
    mqttClient.publish(desiredPublishTopic, desiredPublishMessage);
  }

  const handleSubscriptions = (e) => {
    value = e.target.value;
    setDesiredPublishTopic(value);
    setDesiredSubscriptionTopic(value);
    filterSubscription(subscribedTopics, value);
  };

  useEffect(() => {
    let clear = setTimeout(() => {
      handleSubscriptionRequest();
      // console.log({ pub: desiredPublishTopic, sub: desiredSubscriptionTopic });
    }, 2000);
    return () => {
      clearTimeout(clear);
    };
  }, [desiredSubscriptionTopic]);

  return (
    <div className="MQTTDisplay">
      <div className="mqtt-display">
        <p>
          Publisher status:{" "}
          <strong>{isConnected ? "Connected" : "Not Connected"}</strong>
        </p>
        <form onSubmit={handlePublishRequest} className="mqtt-form">
          <label>Publish Message</label>
          <div>
            <div className="form-group">
              <input
                className="form-field"
                value={desiredPublishMessage}
                onChange={(e) => setDesiredPublishMessage(e.target.value)}
                placeholder="IoT Topic"
                type="text"
                name="desiredPublishTopic"
                required
              />
              <span onClick={handlePublishRequest} type="submit">
                Publish
              </span>
            </div>
          </div>
        </form>
      </div>

      <div className="mqtt-display">
        <form
          // onSubmit={handleSubscriptionRequest}
          className="form-group mqtt-display"
        >
          <h5>Subscribed to {`${desiredPublishTopic}`} Topic</h5>
          <div className="select">
            <select
              name="type"
              id="standard-select"
              onChange={handleSubscriptions}
            >
              {types.map((items, index) => (
                <option
                  key={index}
                  value={
                    items.hasOwnProperty("dbName") ? items.dbName : items.name
                  }>
                  {items.name}
                </option>
              ))}
            </select>
          </div>
        </form>
        <h4>Subscriptions:</h4>
        <br />
        {subscribedTopics.map((topic) => {
          return (
            <MQTTSubscription
              key={topic}
              topic={topic}
              removeSubscription={removeSubscription}
            />
          );
        })}
      </div>
    </div>
  );
}

export default MQTTDisplay;
