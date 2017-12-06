import React, { PropTypes } from "react";
import * as R from "ramda";
import { Link } from "react-router";

const EmailEdit = props => {
  const { recipients } = props.value;
  return (
    <div className="form-group">
      <label htmlFor="recipients">Email Recipients</label>
      <textarea
        id="recipients"
        className="form-control"
        rows="3"
        onChange={e =>
          R.partial(props.onChange, ["recipients"])(
            R.assocPath(["target", "value"], R.split("\n", e.target.value), e)
          )
        }
        value={R.join("\n", recipients ? recipients : [])}
      />
      {/* {errors.email ? <p className="text-danger">{errors.email}</p> : ""} */}
    </div>
  );
};

EmailEdit.propTypes = {};

export default EmailEdit;
