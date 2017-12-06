import React, { PropTypes } from "react";
import { Link } from "react-router";

const HttpDetails = ({ input }) => (
  <div>
    <p>ID:{input.id}</p>
    <p>Name:{input.name}</p>
    <p>Description:{input.description}</p>
    <p>Definition</p>
    <p>URL:{input.definition.url}</p>
    <p>Interval:{input.definition.interval}</p>
  </div>
);

HttpDetails.propTypes = {
  input: PropTypes.object.isRequired
};

export default HttpDetails;
