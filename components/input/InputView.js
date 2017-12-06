import React, { Component, PropTypes } from "react";
import "./../../style/Processors.less";
import HttpView from "./HttpView";

class InputView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { input } = this.props;
    return (
      <div className="processor-details">
        <section className="processor-props">
          <HttpView input={input} />
        </section>
      </div>
    );
  }
}

InputView.propTypes = {
  input: PropTypes.object.isRequired
};

export default InputView;
