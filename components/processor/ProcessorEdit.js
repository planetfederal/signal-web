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

export class ProcessorEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.processor,
      capabilities: props.capabilities
    };

    this.save = this.save.bind(this);
    this.onOptionChange = this.onOptionChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onOutputChange = this.onOutputChange.bind(this);
    this.onOutputValueChange = this.onOutputValueChange.bind(this);
    this.getOutput = this.getOutput.bind(this);
  }

  onOptionChange(e) {
    this.setState({ repeated: e.target.value === "repeat_on" });
  }

  onNameChange(e) {
    this.setState({ name: e.target.value });
  }

  onDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  onOutputChange(e) {
    const o = R.find(
      R.propEq("type", e.target.value),
      this.props.capabilities.outputs
    );
    this.setState({
      definition: {
        ...this.state.definition,
        output: o
      }
    });
  }

  onOutputValueChange(key, e) {
    const output = R.merge(this.state.definition.output, {
      [key]: e.target.value
    });
    this.setState({
      definition: {
        ...this.state.definition,
        output
      }
    });
  }

  getOutput(outputType) {
    switch (outputType) {
      case "email":
        return (
          <EmailEdit
            onChange={this.onOutputValueChange}
            value={this.state.definition.output}
          />
        );
      case "webhook":
        return (
          <WebhookEdit
            onChange={this.onOutputValueChange}
            value={this.state.definition.output}
          />
        );
    }
  }

  save() {
    const newProcessor = {
      ...this.props.processor,
      name: this.state.name,
      description: this.state.description,
      repeated: this.state.repeated,
      persistent: this.state.persistent,
      definition: this.state.definition
    };
    const errors = validate(newProcessor);
    this.props.actions.updateProcessorErrors(errors);
    if (!Object.keys(errors).length) {
      this.props.onSave(newProcessor);
    }
  }

  render() {
    const { errors, cancel } = this.props;
    return (
      <div className="side-form">
        <div className="form-group">
          <label htmlFor="processor-name">Name:</label>
          <input
            id="processor-name"
            type="text"
            className="form-control"
            onChange={this.onNameChange}
            value={this.state.name}
          />
          {errors.name ? <p className="text-danger">{errors.name}</p> : ""}
        </div>
        <div className="form-group">
          <label htmlFor="processor-description">Description:</label>
          <textarea
            id="processor-description"
            className="form-control"
            rows="3"
            onChange={this.onDescriptionChange}
            value={this.state.description}
          />
          {errors.description ? (
            <p className="text-danger">{errors.description}</p>
          ) : (
            ""
          )}
        </div>
        <div className="form-group">
          <label htmlFor="store-repeated">Repeated:</label>
          <div className="radio">
            <label htmlFor="repeat_off">
              <input
                type="radio"
                name="repeated"
                id="repeat_off"
                value="repeat_off"
                checked={!this.state.repeated}
                onChange={this.onOptionChange}
              />
              Alert Once
            </label>
          </div>
          <div className="radio">
            <label htmlFor="repeat_on">
              <input
                type="radio"
                name="repeated"
                id="repeat_on"
                value="repeat_on"
                defaultChecked={this.state.repeated}
                onChange={this.onOptionChange}
              />
              Alert Always
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Output</label>
          <select
            id="store-type"
            className="form-control"
            value={this.state.definition.output.type}
            onChange={this.onOutputChange}
          >
            {this.state.capabilities.outputs.map(output => (
              <option key={output.type} value={output.type}>
                {output.type}
              </option>
            ))}
          </select>
          {this.getOutput(this.state.definition.output.type)}
          {errors.store_type ? (
            <p className="text-danger">{errors.store_type}</p>
          ) : (
            ""
          )}
        </div>

        {!!this.props.errors.length && (
          <p className="text-danger">{this.props.errors}</p>
        )}
        <div className="btn-toolbar">
          <button className="btn btn-sc" onClick={this.save}>
            Save
          </button>
          <button className="btn btn-default" onClick={cancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

ProcessorEdit.propTypes = {
  processor: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  cancel: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired
};

export default ProcessorEdit;
