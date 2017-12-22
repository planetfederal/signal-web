import React, {Component, PropTypes} from 'react';
import './../../style/Processors.less';
import HttpView from './HttpView';
import InputEdit from './InputEdit';

class InputView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editingView: false,
    };
    this.onDelete = this.onDelete.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  onEdit() {
    this.setState({editingView: true});
  }

  onDelete() {
    this.props.actions.deleteInput(this.props.input);
  }

  onSave(i) {
    this.props.actions.updateInput(i);
  }

  render() {
    const {input} = this.props;
    if (this.state.editingView) {
      return (
        <div className="wrapper">
          <section className="main">
            <InputEdit input={input} onSave={this.onSave} />
          </section>
        </div>
      );
    }
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
  input: PropTypes.object.isRequired,
};

export default InputView;
