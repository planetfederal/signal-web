import React, { PropTypes } from "react";
import { Link } from "react-router";
import PropertyListItem from "./../PropertyListItem";
import EmailListLabel from "./../output/EmailListLabel";
import WebhookListLabel from "./../output/WebhookListLabel";

function getOutput(output) {
  switch (output.type) {
    case "email":
      return <EmailListLabel output={output} />;
    case "webhook":
      return <WebhookListLabel output={output} />;
  }
}

const ProcessorListLabel = ({ processor }) => (
  <div className="form-item">
    <h4>
      <Link to={`/processors/${processor.id}`}>{processor.name}</Link>
    </h4>
    <p>{processor.description}</p>
    {getOutput(processor.definition.output)}
  </div>
);

ProcessorListLabel.propTypes = {
  processor: PropTypes.object.isRequired
};

export default ProcessorListLabel;
