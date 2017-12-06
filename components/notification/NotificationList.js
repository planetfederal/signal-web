import React, { PropTypes } from "react";
import NotificationListLabel from "./NotificationListLabel";
import "./../../style/FormList.less";

const NotificationList = ({ notifications }) => (
  <div className="form-list">
    {notifications.map(n => (
      <NotificationListLabel key={n.id} notification={n} />
    ))}
  </div>
);

NotificationList.propTypes = {
  notifications: PropTypes.object.isRequired
};

export default NotificationList;
