import React, { PropTypes } from "react";
import { Link } from "react-router";

const HttpDetails = ({ input }) => (
  <div className="form-item">
    <div className="properties">
      <p>ID{input.id}</p>
      <p>Name{input.name}</p>
      <p>Description{input.description}</p>
      <p>Definition</p>
      <p>URL{input.definition.url}</p>
      <p>Interval{input.definition.interval}</p>
    </div>
  </div>
);

HttpDetails.propTypes = {
  input: PropTypes.object.isRequired
};

export default HttpDetails;
