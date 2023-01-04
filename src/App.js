import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Home from "./Components/Home/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Quiz from "./Components/Quiz/Quiz";
import OTPModal from "./Components/OTPModal/OTPModal";
import { useEffect, useState } from "react";
import AddQuestion from "./Components/addQuestion/AddQuestion";
import Cookies from "js-cookie";

function App() {
  const [loginDetails, setLoginDetails] = useState({ password: "", email: "" });
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userSignUP, setUserSignUP] = useState(false);

  useEffect(() => {
    if (Cookies.get("refreshToken")) {
      setUserLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            exact
            element={
              <Home
                setLoginDetails={setLoginDetails}
                loginDetails={loginDetails}
                userLoggedIn={userLoggedIn}
                setUserLoggedIn={setUserLoggedIn}
                userSignUP={userSignUP}
              />
            }
          ></Route>
          <Route path="/:CategoryName/:CategoryId" element={<Quiz />}></Route>
          <Route
            path="/email-activation"
            element={
              <OTPModal
                loginDetails={loginDetails}
                setLoginDetails={setLoginDetails}
                setUserSignUP={setUserSignUP}
              />
            }
          ></Route>
          <Route path="/addQuestion" element={<AddQuestion />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
