import React from "react";

const MQTTEdit = ({ definition, stateChange  }) => (
  <div>
    <div className="form-group">
      <label htmlFor="input-mqtt-topic">Topic</label>
      <input
        id="input-mqtt-topic"
        type="text"
        className="form-control"
        onChange={e => stateChange(
          ["definition","topic"],e)
        }
        value={definition.topic}
      />
    </div>
  </div>
);

export default MQTTEdit;
