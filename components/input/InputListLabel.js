import React, { PropTypes } from "react";
import { Link } from "react-router";
import format from "date-fns/format";
import PropertyListItem from "./../PropertyListItem";
import "./../../style/FormList.less";

const dateFormat = "dddd, MMMM Do YYYY, h:mm:ss a";

const InputListLabel = ({ input }) => (
  <div className="form-item">
    <h4>
      <Link to={`/inputs/${input.id}`}>{input.name}</Link>
    </h4>
    <p>{input.description}</p>
    <p>Type: {input.type}</p>
  </div>
);

InputListLabel.propTypes = {
  input: PropTypes.object.isRequired
};

export default InputListLabel;
