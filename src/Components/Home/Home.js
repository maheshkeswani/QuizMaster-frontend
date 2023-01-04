import axios from "axios";
import React, { useEffect, useState } from "react";
import CategoryI from "../Category/Category";
import { Link, useNavigate } from "react-router-dom";
import spinner from "../../Images/spinner.gif";
import "../Home/Home.css";
import logo from "../../Images/logo.svg";
import { Menu2, User } from "tabler-icons-react";
import Cookies from "js-cookie"; // npm package for cookie in frontend

import { Modal, Button } from "react-bootstrap";

import GoogleLogin from "react-google-login";

function MyVerticallyCenteredModal(props) {
  const [SigninOrSignUp, setSigninOrSignUp] = useState("Log In");
  const [WrongPassOrEmail, setWrongPassOrEmail] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const loginAPIEndPoint = `${process.env.REACT_APP_BACKEND_SERVER}/quizMaster/user/login`;
  const signUpAPIEndPoint = `${process.env.REACT_APP_BACKEND_SERVER}/quizMaster/user/signUp`;

  useEffect(() => {
    props.setLoginDetails({
      email: "",
      password: "",
    });
    setConfirmPassword("");
  }, [SigninOrSignUp]);

  const navigate = useNavigate();

  const changeHandlerLoginCP = (e) => {
    // console.log("confirm Password is: ", confirmPassword);
    setConfirmPassword(e.target.value);
  };

  const changeHandlerLogin = (e) => {
    props.setLoginDetails({
      ...props.loginDetails,
      [e.target.name]: e.target.value,
    });
  };

  const submitLoginDetails = (e) => {
    e.preventDefault();

    if (
      confirmPassword !== props.loginDetails.password &&
      SigninOrSignUp === "Sign Up"
    ) {
      setWrongPassOrEmail("Confirm Password is wrong");
      return;
    }

    setWrongPassOrEmail("");

    // POST request using fetch with error handling
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props.loginDetails),
    };

    if (SigninOrSignUp === "Sign Up") {
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
          } else {
            // props.setLoginDetails({ password: "", email: "" });
            setWrongPassOrEmail("");
          }
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
      navigate("/email-activation");
    } else if (SigninOrSignUp === "Log In") {
      fetch(loginAPIEndPoint, requestOptions)
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
          } else {
            props.setUserLoggedIn(true);
            props.onHide();

            Cookies.set("token", data.token, {
              expires: 5 / (60 * 24), //5min
              sameSite: "Strict",
            }); // set cookie from frontend

            Cookies.set("refreshToken", data.refreshToken, {
              expires: 7, // 7 days
              sameSite: "Strict",
            });

            props.setLoginDetails({ password: "", email: "" });
            setWrongPassOrEmail("");
          }
        })
        .catch((error) => {
          console.error("There was an error!", error);
          setWrongPassOrEmail("*Username or password is wrong");
        });
    }
  };

  //google login

  const googleSignUp = async (email) => {
    try {
      let option = {
        headers: { "Content-Type": "application/json" },
      };

      const result = await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER}/quizMaster/user/googleUser/signUp`,
        { email: email },
        option
      );

      console.log(result);
    } catch (err) {
      console.log("google err is: ", err);
    }
  };

  const googleLogin = async (email) => {
    try {
      let option = {
        headers: { "Content-Type": "application/json" },
      };

      const result = await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER}/quizMaster/user/googleUser/login`,
        { email: email },
        option
      );

      // console.log("google user login result is: ", result);

      props.setUserLoggedIn(true);
      props.onHide();

      Cookies.set("token", result.data.token, {
        expires: 5 / (60 * 24), //5min
        sameSite: "Strict",
      }); // set cookie from frontend

      Cookies.set("refreshToken", result.data.refreshToken, {
        expires: 7, // 7 days
        sameSite: "Strict",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const responseGoogle = async function (response) {
    try {
      const email = response.profileObj.email;
      // console.log("response: ", response);
      googleSignUp(email);
      googleLogin(email);
    } catch (err) {
      console.log("google error is: ", err);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <div className="loginDiv">
        <form onSubmit={submitLoginDetails}>
          <div className="signbox">
            <div
              className={
                SigninOrSignUp === "Log In"
                  ? "signIn activeSign"
                  : "signIn deactiveSign"
              }
              onClick={() => setSigninOrSignUp("Log In")}
            >
              <h2 className="signText">Log in</h2>
            </div>
            <div
              className={
                SigninOrSignUp === "Sign Up"
                  ? "signUp activeSign"
                  : "signUp deactiveSign"
              }
              onClick={() => {
                setSigninOrSignUp("Sign Up");
                setWrongPassOrEmail("");
              }}
            >
              <h2 className="signText">Sign Up</h2>
            </div>
          </div>
          <div className="modalListItem">
            <label className="modalListItemLabel">Email</label>
            <input
              className="modalListItemInputFeild"
              type="text"
              name="email"
              value={props.loginDetails.email}
              onChange={changeHandlerLogin}
            />
          </div>
          <div className="modalListItem">
            <label className="modalListItemLabel">Password</label>
            <input
              className="modalListItemInputFeild"
              type="password"
              name="password"
              value={props.loginDetails.password}
              onChange={changeHandlerLogin}
            />
          </div>
          {SigninOrSignUp === "Sign Up" && (
            <div className="modalListItem">
              <label className="modalListItemLabel">Confirm Password</label>
              <input
                className="modalListItemInputFeild"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={changeHandlerLoginCP}
              />
            </div>
          )}
          <div className="modalListItem">
            <span className="ErrorMsg">{WrongPassOrEmail}</span>
          </div>
          <div className="buttonDiv">
            {SigninOrSignUp === "Sign Up" ? (
              <Button className="button" type="submit">
                {SigninOrSignUp}
              </Button>
            ) : (
              <Button className="button" type="submit">
                {SigninOrSignUp}
              </Button>
            )}
          </div>
        </form>

        <div className="or">
          <p>or</p>
        </div>
        <div className="GoogleLogin">
          <GoogleLogin
            className="GoogleLoginbutton"
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID} //CLIENTID NOT CREATED YET
            buttonText="Sign Up With Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
          />
        </div>
      </div>
    </Modal>
  );
}

function Home({
  setLoginDetails,
  loginDetails,
  userLoggedIn,
  setUserLoggedIn,
  userSignUP,
}) {
  const [Category, setCategory] = useState([]);
  const [chooseCategory, setChooseCategorty] = useState("");
  const [chooseCategoryName, setChooseCategortyName] = useState("");
  const [burgerMenu, setBurgerMenu] = useState(false);
  const API = `${process.env.REACT_APP_BACKEND_SERVER}/quizMaster/category`;

  const [modalShow, setModalShow] = React.useState(false);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(API);
      setCategory(response.data.category);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategory();
    if (userSignUP && !userLoggedIn) {
      setModalShow(true);
    }
  }, []);

  const deleteCookie = () => {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
  };

  // console.log("userLoggedIn: ", userLoggedIn);

  return (
    <div>
      {Category.length === 0 ? (
        <div className="spinnerImg">
          <img src={spinner} alt="" />
        </div>
      ) : (
        <div className="wholeDiv">
          {/* login html */}

          <MyVerticallyCenteredModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            setLoginDetails={setLoginDetails}
            loginDetails={loginDetails}
            userLoggedIn={userLoggedIn}
            setUserLoggedIn={setUserLoggedIn}
            userSignUP={userSignUP}
          />

          {/* Burger Menu html  */}
          <div className="BurgerMenu">
            <div className={!userLoggedIn && "Hamburger"}>
              <Menu2
                size={30}
                color="#d56f85"
                onClick={() => setBurgerMenu(!burgerMenu)}
                style={{ cursor: "pointer" }}
              />
            </div>
            {userLoggedIn && (
              <div className="userLogo">
                {" "}
                <User size={30} color="#d56f85" />
              </div>
            )}
          </div>

          {!burgerMenu ? (
            <div className="Sidebar Sidebar--closed animateSidebar--closed "></div>
          ) : (
            <div>
              <label
                className="Sidebar_mask"
                onClick={() => setBurgerMenu(!burgerMenu)}
              />
              <div className="Sidebar animateSidebar">
                <ul className="ulList">
                  <div className="listitemDiv">
                    <li className="listitem">Home</li>
                  </div>
                  <div
                    className={
                      !userLoggedIn ? "listitemDiv" : "listitemDiv inactive"
                    }
                    onClick={() => {
                      setBurgerMenu(!burgerMenu);
                      setModalShow(true);
                    }}
                  >
                    <li className="listitem">Log in</li>
                  </div>

                  <Link
                    to="/addQuestion"
                    style={{ textDecoration: "none", width: "100%" }}
                  >
                    <div className="listitemDiv">
                      <li className="listitem">Add Question</li>
                    </div>
                  </Link>

                  <div
                    className={
                      userLoggedIn ? "listitemDiv" : "listitemDiv inactive"
                    }
                    onClick={() => {
                      setBurgerMenu(!burgerMenu);
                      deleteCookie();
                      setUserLoggedIn(false);
                    }}
                  >
                    <li className="listitem">Log out</li>
                  </div>
                </ul>
              </div>
            </div>
          )}

          {/* quiz html */}

          <div className="imgDiv">
            <img className="logo" src={logo} alt="logo"></img>

            <div className="h3Div">
              <h3 className="h3">
                Choose one from the categories below and see how many questions
                you can answer correctly out of total questions!
              </h3>
            </div>

            <div className="categorysDiv">
              {Category.map((item) => (
                <div
                  key={item._id}
                  className={
                    chooseCategoryName === item.categoryName
                      ? "categoryDivSelected"
                      : "categoryDiv"
                  }
                >
                  <CategoryI
                    categoryName={item.categoryName}
                    id={item._id}
                    setChooseCategorty={setChooseCategorty}
                    setChooseCategortyName={setChooseCategortyName}
                  />
                </div>
              ))}
            </div>

            <Link
              className="resultAnchor"
              to={`/${chooseCategoryName}/${chooseCategory}`}
            >
              <p className="p">
                <p className="resultButtonHome ">Start Quiz</p>
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
