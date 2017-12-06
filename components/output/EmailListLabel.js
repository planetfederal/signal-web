import React, { PropTypes } from "react";
import { Link } from "react-router";

const EmailItem = ({ output }) => (
  <div>
    <p>Output Type:{output.type}</p>
    <p>Recipients:{output.recipients}</p>
  </div>
);

EmailItem.propTypes = {
  output: PropTypes.object.isRequired
};

export default EmailItem;
