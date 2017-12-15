import React, { Component, PropTypes } from "react";
import "./../../style/Processors.less";
import HttpView from "./HttpView";

class InputView extends Component {
  constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);
    this.onEdit = this.onEdit.bind(this);
  }

  onEdit() {}

  onDelete() {}

  render() {
    const { input } = this.props;
    return (
      <div className="processor-details">
        <div className="processor-props">
          <HttpView input={input} />
          <div className="btn-toolbar">
            <button className="btn btn-sc" onClick={this.onEdit}>
              Edit Input
            </button>
            <button className="btn btn-danger" onClick={this.onDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
}

InputView.propTypes = {
  input: PropTypes.object.isRequired
};

export default InputView;
