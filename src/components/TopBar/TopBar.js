import React from "react";
import { Icon, Image } from "semantic-ui-react";
import { Link,useNavigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import { getAuth,signOut } from "firebase/auth";
import "firebase/auth";
import UserImage from "../../assets/png/user.png";

import "./TopBar.scss";

function TopBar(props) {
  const { user } = props;
  const navigate = useNavigate();
  const goBack = () => {
    // history.goBack();
    navigate(-1);
  };

  const logout = () => {
   signOut(getAuth());
  };

  return (
    <div className="top-bar">
      <div className="top-bar__left">
        <Icon name="angle left" onClick={goBack} />
      </div>

      <div className="top-bar__right">
        <Link to="/settings">
          <Image src={user.photoURL ? user.photoURL : UserImage} />
          {user.displayName}
        </Link>
        <Icon name="power off" onClick={logout} />
      </div>
    </div>
  );
}

export default withRouter(TopBar);
