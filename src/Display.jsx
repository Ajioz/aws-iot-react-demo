import React from "react";
// import MQTTSubscription from "./MQTTSubscription";

const Display = ({ message }) => {
  return (
    <div className="display">
      <h4>{message}</h4>
    </div>
  );
};

export default Display;
