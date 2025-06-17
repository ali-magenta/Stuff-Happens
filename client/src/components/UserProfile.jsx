import { useEffect } from "react";
import { useNavigate } from "react-router";

function UserProfile(props) {
  useEffect(() => {
    props.setCheckProfile(true);
  }, []);

  return (
    <>
      <h3>Hello {props.user.email}</h3>
    </>
  );
}

export default UserProfile;
