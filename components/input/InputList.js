import React, { PropTypes } from "react";
import InputListLabel from "./InputListLabel";
import "./../../style/FormList.less";

const InputList = ({ inputs }) => (
  <div className="form-list">
    {inputs.map(i => <InputListLabel key={i.id} input={i} />)}
  </div>
);

InputList.propTypes = {
  inputs: PropTypes.array.isRequired
};

export default InputList;
