import React, { PropTypes } from "react";
import { Link } from "react-router";

const WebhookItem = ({ output }) => (
  <div>
    <p>{output.type}</p>
    <p>{output.url}</p>
  </div>
);

WebhookItem.propTypes = {
  output: PropTypes.object.isRequired
};

export default WebhookItem;
