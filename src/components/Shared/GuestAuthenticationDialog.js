import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { apiCall } from "../../api/functions";
import { fetchUserContent } from "../../redux/actions/authActions";
import { reduxLogin } from "../../redux/actions/userActions";
import { emailIsInvalid, GUEST_USER_KEY } from "../Pages/Auth/shared/utils";
import MEButton from "../Pages/Widgets/MEButton";
import MEModal from "../Pages/Widgets/MEModal";
import METextField from "../Pages/Widgets/METextField";

function GuestAuthenticationDialog(props) {
  const { community, putUserInRedux } = props;
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const authenticateGuest = () => {
    setError("");
    if (emailIsInvalid(email))
      return setError("Please provide a valid email to proceed as guest");
    const name = email.split("@")[0];
    const data = {
      full_name: name,
      preferred_name: name,
      email,
      community_id: community?.id,
      accepts_terms_and_conditions: false,
      is_vendor: false,
    };
    setLoading(true);
    apiCall("/users.create", data)
      .then((response) => {
        const data = response.data; 
        setLoading(false);
        if(!response.success) return setError(response?.error?.message)
        console.log("I am the response my gee", response);
        putUserInRedux(response.data);
        localStorage.setItem(GUEST_USER_KEY, email);
      })
      .catch((e) => {
        setLoading(false);
        console.log("GUEST_AUTHENTICATION_ERROR", e);
      });
  };

  return (
    <MEModal {...props} v2>
      <div className="guest-dialog-container">
        <div className="guest-dialog-content">
          <p className="responsive-p">
            Please input your{" "}
            <span style={{ color: "var(--app-theme-orange)" }}>email</span>{" "}
            below. That's all you would have to do for now.
          </p>

          <METextField
            placeholder="example@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && (
            <small style={{ color: "maroon", marginTop: 5 }}>{error}</small>
          )}
        </div>
        <div className="guest-dialog-footer">
          <MEButton
            loading={loading}
            onClick={() => authenticateGuest()}
            containerStyle={{ marginLeft: "auto" }}
          >
            Start As Guest
          </MEButton>
        </div>
      </div>
    </MEModal>
  );
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      putUserInRedux: reduxLogin,
    },
    dispatch
  );
};
export default connect(null, mapDispatchToProps)(GuestAuthenticationDialog);
