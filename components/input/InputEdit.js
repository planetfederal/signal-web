import React, { Component, PropTypes } from "react";
import without from "lodash/without";
import { isEmail } from "../../utils";
import WebhookEdit from "./../output/WebhookEdit";
import EmailEdit from "./../output/EmailEdit";
import * as R from "ramda";

export const validate = values => {
  const errors = {};

  if (!values.name) {
    errors.name = "Required";
  }

  if (!values.description) {
    errors.description = "Required";
  }

  return errors;
};

export class InputEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.input,
      capabilities: props.capabilities
    };
    this.cancel = this.cancel.bind(this);
    this.save = this.save.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
  }

  cancel() {}

  save() {
    this.props.onSave(this.state);
  }

  onStateChange(path, e) {
    if (R.is(Array, path)) {
      this.setState(R.assocPath(path, e.target.value, this.state));
    } else {
      this.setState({ [path]: e.target.value });
    }
  }

  render() {
    const { errors, cancel } = this.props;
    return (
      <div className="side-form">
        <div className="form-group">
          <label htmlFor="input-name">Name</label>
          <input
            id="input-name"
            type="text"
            className="form-control"
            onChange={R.partial(this.onStateChange, ["name"])}
            value={this.state.name}
          />
        </div>
        <div className="form-group">
          <label htmlFor="input-desc">Description</label>
          <input
            id="input-desc"
            type="text"
            className="form-control"
            onChange={R.partial(this.onStateChange, ["description"])}
            value={this.state.description}
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select
            id="input-type"
            className="form-control"
            value={this.state.definition.type}
            onChange={R.partial(this.onStateChange, ["type"])}
          >
            <option key="http" value="http">
              http
            </option>
            <option key="mqtt" value="http">
              mqtt
            </option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="input-http-interval">Interval</label>
          <input
            id="input-http-interval"
            type="text"
            className="form-control"
            onChange={e =>
              this.onStateChange(
                ["definition", "interval"],
                R.assocPath(["target", "value"], parseInt(e.target.value), e)
              )
            }
            value={this.state.definition.interval}
          />
        </div>
        <div className="form-group">
          <label htmlFor="input-http-url">Url (GET)</label>
          <input
            id="input-http-url"
            type="text"
            className="form-control"
            onChange={R.partial(this.onStateChange, [["definition", "url"]])}
            value={this.state.definition.url}
          />
        </div>
        <div className="btn-toolbar">
          <button className="btn btn-sc" onClick={this.save}>
            Save
          </button>
          <button className="btn btn-default" onClick={this.cancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

InputEdit.propTypes = {};

export default InputEdit;
