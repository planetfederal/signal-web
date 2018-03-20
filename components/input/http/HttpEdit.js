import React from "react";
import * as R from "ramda";

const HttpEdit = ({ definition, stateChange }) => (
  <div>
    <div className="form-group">
      <label htmlFor="input-http-interval">Interval</label>
      <input
        id="input-http-interval"
        type="text"
        className="form-control"
        onChange={e =>
          stateChange(
            ["definition", "interval"],
            R.assocPath(["target", "value"], parseInt(e.target.value), e)
          )
        }
        value={definition.interval}
      />
    </div>
    <div className="form-group">
      <label htmlFor="input-http-url">Url (GET)</label>
      <input
        id="input-http-url"
        type="text"
        className="form-control"
        onChange={R.partial(stateChange, [["definition", "url"]])}
        value={definition.url}
      />
    </div>
  </div>
);

export default HttpEdit;
