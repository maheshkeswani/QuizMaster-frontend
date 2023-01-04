import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "../OTPModal/OTP.css";

function MyVerticallyCenteredModalOTP(props) {
  const emailActivationEnpPoint = `${process.env.REACT_APP_BACKEND_SERVER}/quizMaster/user/email-activate`;
  const signUpAPIEndPoint = `${process.env.REACT_APP_BACKEND_SERVER}/quizMaster/user/signUp`;

  const navigate = useNavigate();

  const changeHandlerLogin = (e) => {
    props.setUserOTP({
      ...props.userOTP,
      [e.target.name]: e.target.value,
    });
  };

  const submitLoginDetails = (e) => {
    e.preventDefault();

    const requestOptionsEmailActivation = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props.userOTP),
    };

    fetch(emailActivationEnpPoint, requestOptionsEmailActivation)
      .then(async (response) => {
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson && (await response.json());

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        props.setLoginDetails({ password: "", email: "" });
        props.setUserSignUP(true);
        navigate("/");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const submitResendDetails = () => {
    // POST request using fetch with error handling
    console.log("resend OTP details is: ", props.loginDetails);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(props.loginDetails),
    };

    fetch(signUpAPIEndPoint, requestOptions)
      .then(async (response) => {
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson && (await response.json());

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static" //the modal will not close when clicking outside it
    >
      <form onSubmit={submitLoginDetails}>
        <div className="modalListItem OTPmodalListItem">
          <label className="modalListItemLabel">OTP</label>

          <input
            className="modalListItemInputFeild"
            type="text"
            name="userOTP"
            value={props.userOTP.userOTP}
            onChange={changeHandlerLogin}
          />
        </div>
        <div className="OTPbuttonDiv">
          <Button className="button" type="submit">
            Verify
          </Button>
        </div>
      </form>
      <div className="or">
        <p>or</p>
      </div>
      <div className="OTPbuttonDiv OTPlastbuttonDiv">
        <Button className="button" onClick={submitResendDetails}>
          Resend the OTP
        </Button>
      </div>
    </Modal>
  );
}

function OTPModal({ loginDetails, setLoginDetails, setUserSignUP }) {
  const [modalShowOTP, setModalShowOTP] = React.useState(true);
  const [userOTP, setUserOTP] = useState({
    userOTP: "",
    email: loginDetails.email,
    password: loginDetails.password,
  });

  return (
    <>
      <MyVerticallyCenteredModalOTP
        show={modalShowOTP}
        onHide={() => setModalShowOTP(false)}
        userOTP={userOTP}
        setUserOTP={setUserOTP}
        loginDetails={loginDetails}
        setLoginDetails={setLoginDetails}
        setUserSignUP={setUserSignUP}
      />
    </>
  );
}

export default OTPModal;
