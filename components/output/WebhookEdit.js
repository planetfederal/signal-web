import React, { PropTypes } from "react";
import { Link } from "react-router";
import * as R from "ramda";

const WebhookForm = props => {
  const { url, verb } = props.value;
  return (
    <div className="form-group">
      <label htmlFor="recipients">URL</label>
      <input
        id="url"
        type="text"
        className="form-control"
        onChange={R.partial(props.onChange, ["url"])}
        value={url}
      />
      <select
        id="verb"
        className="form-control"
        value={verb}
        onChange={R.partial(props.onChange, ["verb"])}
      >
        <option key="get" value="get">
          GET
        </option>
        <option key="post" value="post">
          POST
        </option>
      </select>

      {/* {errors.email ? <p className="text-danger">{errors.email}</p> : ""} */}
    </div>
  );
};

WebhookForm.propTypes = {};

export default WebhookForm;
