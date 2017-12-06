import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import find from "lodash/find";
import InputView from "../components/input/InputView";
import * as inputActions from "../ducks/input";

class InputDetailsContainer extends Component {
  componentDidMount() {
    if (!this.props.input) {
      this.props.actions.loadInput(this.props.id);
    }
  }

  render() {
    return (
      <section className="main noPad">
        {this.props.input ? <InputView {...this.props} /> : null}
      </section>
    );
  }
}

InputDetailsContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  input: PropTypes.object,
  id: PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  id: ownProps.params.id,
  input: find(state.sc.input.inputs, {
    id: ownProps.params.id
  }),
  menu: state.sc.menu
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(inputActions, dispatch)
});

// connect this "smart" container component to the redux store
export default connect(mapStateToProps, mapDispatchToProps)(
  InputDetailsContainer
);
