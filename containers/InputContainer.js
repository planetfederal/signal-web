import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import find from "lodash/find";
import InputView from "../components/input/InputView";
import * as inputActions from "../reducers/input";
import InputList from "../components/input/InputList";
import InputEdit from "../components/input/InputEdit";

class InputContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adding: false
    };
    this.add = this.add.bind(this);
    this.create = this.create.bind(this);
  }

  add() {
    this.setState({ adding: !this.state.adding });
  }

  create(input) {
    this.setState({ adding: false });
    this.props.actions.addInput(input);
  }

  cancel() {
    this.setState({ adding: false });
  }

  componentDidMount() {
    this.props.actions.loadInputs();
  }

  render() {
    const { children } = this.props;
    if (children) {
      return <div className="wrapper">{children}</div>;
    }
    const emptyInput = {
      name: "",
      description: "",
      type: "http",
      definition: {
        url: "",
        interval: 0
      }
    };
    return (
      <div className="wrapper">
        <section className="main">
          {this.state.adding ? (
            <InputEdit
              input={emptyInput}
              cancel={this.cancel}
              onSave={this.create}
            />
          ) : (
            <div className="btn-toolbar">
              <button className="btn btn-sc" onClick={this.add}>
                Add Input
              </button>
            </div>
          )}
          <InputList {...this.props} />
        </section>
      </div>
    );
  }
}

InputContainer.propTypes = {
  actions: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  auth: state.sc.auth,
  id: ownProps.params.id,
  inputs: state.sc.input.inputs,
  menu: state.sc.menu
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(inputActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(InputContainer);
