import React, {PropTypes} from "react";
import {Link} from "react-router";

const MQTTDetails = ({input}) => (
  <div className="form-item">
    <div className="properties">
      <p>ID{input.id}</p>
      <p>Name{input.name}</p>
      <p>Description{input.description}</p>
      <p>Topic{input.topic}</p>
    </div>
  </div>
);

MQTTDetails.propTypes = {
  input : PropTypes.object.isRequired
};

export default MQTTDetails;

