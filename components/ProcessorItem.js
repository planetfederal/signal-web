import React, { PropTypes } from "react";
import { Link } from "react-router";
import PropertyListItem from "./PropertyListItem";
import EmailItem from "./output/EmailItem";
import WebhookItem from "./output/WebhookItem";

function getOutput(output) {
  switch (output.type) {
    case "email":
      return <EmailItem output={output} />;
    case "webhook":
      return <WebhookItem output={output} />;
  }
}

const ProcessorItem = ({ processor }) => (
  <div className="form-item">
    <h4>
      <Link to={`/processors/${processor.id}`}>{processor.name}</Link>
    </h4>
    <p>{processor.description}</p>
    {getOutput(processor.definition.output)}
  </div>
);

ProcessorItem.propTypes = {
  processor: PropTypes.object.isRequired
};

export default ProcessorItem;
