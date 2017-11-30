import React, { PropTypes } from "react";
import NotificationItem from "./NotificationItem";
import "../style/FormList.less";

const NotificationList = ({ spatial_processors }) => (
  <div className="form-list">
    {Object.keys(spatial_processors).map(k => (
      <NotificationItem
        key={spatial_processors[k].id}
        notification={spatial_processors[k]}
      />
    ))}
  </div>
);

NotificationList.propTypes = {
  spatial_processors: PropTypes.object.isRequired
};

export default NotificationList;
