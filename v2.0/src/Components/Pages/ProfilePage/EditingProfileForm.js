import React from "react";
import { connect } from "react-redux";
import { reduxLogin } from "../../../redux/actions/userActions";
import { apiCall } from "../../../api/functions";
import MEButton from "../Widgets/MEButton";
import METextField from "../Widgets/METextField";
//import createImagefromInitials from '../../AutoGeneratedIcon.js';
import 'react-image-crop/dist/ReactCrop.css';
/********************************************************************/
/**                        SUBSCRIBE FORM                          **/
/********************************************************************/

class EditingProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      full_name: props.full_name ? props.full_name : "",
      preferred_name: props.preferred_name ? props.preferred_name : "",
      email: props.email ? props.email : "",
      delete_account: false,
      change_password: false,
      are_you_sure: false, 
      //image is the object representing the user's profile picture on the server
      image: props.user.profile_picture && props.user.profile_picture.url ? props.user.profile_picture.url : null,
      color: props.user.preferences && props.user.preferences.color ? props.user.preferences.color : "#135dfe"
    };
    this.onChange = this.onChange.bind(this);
  }

  //updates image in state when it is changed in form
  handleImageChange = (e) => {
    
    this.setState({
      image: e.target.files[0]
    });
    //upload image to server ON SUBMIT
    //other fields are probably unnecessary?
    //const body = {
    //  user_id: this.props.user.id,
    //  full_name: this.state.full_name,
    //  profile_picture: this.state.image,
    //  preferred_name: this.state.preferred_name
    //};
    // apiCall("users.update", body)
    //.then((json) => {
    //  if (json.success && json.data) {
    //    this.props.reduxLogin(json.data);
    //    this.props.closeForm();
    //  }
    //})
    //.catch((error) => {
    //  console.log(error);
    //});

    //crop the image to the aspect ratio we want: in this case, 1:1
    const outputImageAspectRatio = 1;
    const inputImage = new Image();
    if (this.state.image && this.state.image.url) {
      inputImage.src = "https://massenergize-files.s3.amazonaws.com/media/linkedin_photo.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAS6NKUZRIBLQKY5VX%2F20210702%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20210702T224855Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=2b7ad9d6eeadb882bde1e4327131d302725444f0c81cc84f896d471f675a1f4c";
    }
    inputImage.onload = () => {
      // let's store the width and height of our image
      const inputWidth = inputImage.naturalWidth;
      console.log('input width', inputWidth)
      const inputHeight = inputImage.naturalHeight;
        // get the aspect ratio of the input image
      const inputImageAspectRatio = inputWidth / inputHeight;

      // if it's bigger than our target aspect ratio
      let outputWidth = inputWidth;
      let outputHeight = inputHeight;
      if (inputImageAspectRatio > outputImageAspectRatio) {
        outputWidth = inputHeight * outputImageAspectRatio;
      } else if (inputImageAspectRatio < outputImageAspectRatio) {
        outputHeight = inputWidth / outputImageAspectRatio;
      }

      // create a canvas that will present the output image
      const outputImage = document.createElement("canvas");
      
      // set it to the same size as the image
      outputImage.width = outputWidth;
      outputImage.height = outputHeight;

      // draw our image at position 0, 0 on the canvas
      const ctx = outputImage.getContext("2d");
      ctx.drawImage(inputImage, 0, 0);

      //show the canvas
      document.body.appendChild(inputImage);
      document.body.appendChild(outputImage);
      console.log('no exceptions, we got here');
      console.log(outputImage);
      }
    

  };

  //updates the state when form elements are changed (not including image)
  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      error: null,
    });
  }

  onSubmit = (event) => {
    event.preventDefault();
    if (this.state.delete_account && this.state.are_you_sure) {
      this.deleteAccount();
    } else {
      const body = {
        user_id: this.props.user.id,
        full_name: this.state.full_name,
        profile_picture: this.state.image,
        preferred_name: this.state.preferred_name
      };

      /** Collects the form data and sends it to the backend */
      apiCall("users.update", body)
        .then((json) => {
          if (json.success && json.data) {
            this.props.reduxLogin(json.data);
            this.props.closeForm();
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
    console.log("state.image");
    console.log(this.state.image);
    return (
      <form onSubmit={this.onSubmit}>
        <div
          className="z-depth-float me-anime-open-in"
          style={{
            border: "solid 1px 1px solid rgb(243, 243, 243)",
            borderRadius: 10,
            padding: 30,
          }}
        >
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

          {/* <small>
            Email ( Not Editable ) <span className="text-default">*</span>
          </small>
          <METextField
            type="email"
            name="email"
            defaultValue={this.state.email}
            onChange={this.onChange}
            required={true}
            readonly="true"
          /> */}

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
          <small>
            Profile Picture
          </small>
          {this.state.image ?
          <img src={this.state.image}></img>
          :
          <div>None</div>}
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={this.handleImageChange}
          >
          </input>
          <br />
          <MEButton type="submit">{"Submit"}</MEButton>
          <MEButton
            variation="accent"
            type="button"
            onClick={() => this.props.closeForm()}
          >
            {" "}
            Cancel{" "}
          </MEButton>
        </div>
      </form>
    );
  }
}

const mapStoreToProps = (store) => {
  //console.log(store.user.info);
  return {
    user: store.user.info,
    auth: store.firebase.auth,
  };
};
export default connect(mapStoreToProps, { reduxLogin })(EditingProfileForm);

