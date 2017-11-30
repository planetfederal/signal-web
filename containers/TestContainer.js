import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as processorActions from "../ducks/processors";
import Home from "../components/Home";

class TestContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      val: ""
    };

    this.send = this.send.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({ val: e.target.value });
  }

  send(val) {
    this.props.actions.sendTest(this.state.val);
  }

  render() {
    return (
      <div className="form-group">
        <label htmlFor="recipients">Test</label>
        <input
          id="url"
          type="text"
          className="form-control"
          onChange={this.onChange}
          value={this.state.val}
        />
        <div className="btn-toolbar">
          <button className="btn btn-sc" onClick={this.send}>
            Send
          </button>
        </div>
      </div>
    );
  }
}

TestContainer.propTypes = {
  processorActions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  spatial_processors: state.sc.processors.spatial_processors
});

const mapDispatchToProps = dispatch => ({
  processorActions: bindActionCreators(processorActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(TestContainer);
