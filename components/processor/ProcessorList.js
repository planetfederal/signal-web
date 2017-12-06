import React, { PropTypes } from "react";
import ProcessorListLabel from "./ProcessorListLabel";
import "./../../style/FormList.less";

const ProcessorList = ({ spatial_processors }) => (
  <div className="form-list">
    {Object.keys(spatial_processors).map(k => (
      <ProcessorListLabel
        key={spatial_processors[k].id}
        processor={spatial_processors[k]}
      />
    ))}
  </div>
);

ProcessorList.propTypes = {
  spatial_processors: PropTypes.object.isRequired
};

export default ProcessorList;
