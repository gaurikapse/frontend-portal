import React from "react";
import { connect } from "react-redux";
import { reduxLogin } from "../../../redux/actions/userActions";
import { apiCall } from "../../../api/functions";
import METextField from "../Widgets/METextField";
//import createImagefromInitials from '../../AutoGeneratedIcon.js';
import "react-image-crop/dist/ReactCrop.css";
import MEFileSelector from "../Widgets/MEFileSelector";
import MELightFooter from "../Widgets/MELightFooter";
/********************************************************************/
/**                        SUBSCRIBE FORM                          **/
/********************************************************************/

class EditingProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      full_name: props.full_name ? props.full_name : "",
      preferred_name: props.preferred_name ? props.preferred_name : "",
      email: props.email ? props.email : "",
      delete_account: false,
      change_password: false,
      are_you_sure: false,
      //image is the object representing the user's profile picture on the server
      image: props.user?.profile_picture?.url,
      color: props.user?.preferences?.color || "#fd7e14",
      imageReset: null,
    };
    this.onChange = this.onChange.bind(this);
  }

  //updates the state when form elements are changed (not including image)
  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      error: null,
    });
  }

  onSubmit = (event) => {
    event && event.preventDefault();
    if (this.state.delete_account && this.state.are_you_sure) {
      this.deleteAccount();
    } else {
      const body = {
        user_id: this.props.user.id,
        full_name: this.state.full_name,
        preferred_name: this.state.preferred_name,
      };
      if (this.state.imageReset) {
        body.profile_picture = this.state.image;
      }
      this.setState({ loading: true });
      /** Collects the form data and sends it to the backend */
      apiCall("users.update", body)
        .then((json) => {
          if (json.success && json.data) {
            this.props.reduxLogin(json.data);
            this.props.closeForm();
            this.setState({ loading: false, imageReset: null });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  deleteAccount() {
    this.setState({ error: "Sorry, we don't support deleting profiles yet" });
  }

  render() {
    const { loading } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <div className="z-depth-float me-anime-open-in edit-profile-root">
          <div className="edit-profile-content">
            <h5>Edit Your Profile</h5>
            {this.state.error ? (
              <p className="text-danger">{this.state.error}</p>
            ) : null}
            <small>
              Full Name <span className="text-danger">*</span>
            </small>
            <METextField
              type="text"
              name="full_name"
              defaultValue={this.state.full_name}
              onChange={this.onChange}
              required={true}
            />

            <small>
              Preferred Name <span className="text-danger">*</span>
            </small>
            <METextField
              type="text"
              name="preferred_name"
              defaultValue={this.state.preferred_name}
              onChange={this.onChange}
              required={true}
            />
            <br />
            {/* <small>Profile Picture</small> */}
            <MEFileSelector
              placeholder="Choose a profile picture"
              onFileSelected={(data, reset) =>
                this.setState({
                  image: data?.file?.data || "reset",
                  imageReset: reset,
                })
              }
              name="Your profile pic..."
              allowCrop
              circleCrop
              ratioWidth={1}
              ratioHeight={1}
              previewClassName="profile-pic-preview"
              defaultValue={this.state.image !== "reset" && this.state.image}
            />
          </div>

          <MELightFooter
            okText={loading ? "UPDATING..." : "SUBMIT"}
            onConfirm={() => this.onSubmit()}
            onCancel={(e) => {
              e.preventDefault();
              this.props.closeForm();
            }}
          />
        </div>
      </form>
    );
  }
}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
  };
};
export default connect(mapStoreToProps, { reduxLogin })(EditingProfileForm);
