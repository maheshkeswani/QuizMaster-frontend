import { Button } from "react-bootstrap";
import Cookies from "js-cookie";
import React from "react";
import { useState } from "react";
import axios from "axios";
import "../addQuestion/AddQuestion.css";

function AddQuestion() {
  const [questionAdd, setQuestionAdd] = useState({
    statement: "",
    correctAnswer: "",
    incorrectAnswer: ["", "", ""],
    category: "",
  });

  const [op, setOp] = useState({ op1: "", op2: "", op3: "" });
  const [errMsg, setErrMsg] = useState("");

  const changeHandlerLogin = (e) => {
    setQuestionAdd({
      ...questionAdd,
      [e.target.name]: e.target.value,
    });
  };

  const changeHandlerLoginOp = (e) => {
    setOp({
      ...op,
      [e.target.name]: e.target.value,
    });
  };

  const submitQuestion = async () => {
    try {
      let options = {
        headers: { "Content-Type": "application/json" },
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER}/quizMaster/category/categoryName`,
        { categoryName: questionAdd.category },
        options
      );

      options = {
        headers: {
          "Content-Type": "application/json",
          authorization: Cookies.get("token"),
        },
        axiosConfig: { withCredentials: true },
      };

      console.log("categoryId response is: ", response.data);
      console.log("question details is: ", questionAdd);

      const addQues = axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER}/quizMaster/question/${response.data._id}`,
        {
          statement: questionAdd.statement,
          correctAnswer: questionAdd.correctAnswer,
          incorrectAnswer: questionAdd.incorrectAnswer,
        },
        options
      );

      console.log("addQues is: ", addQues);
    } catch (err) {
      console.log(err);
    }
  };

  const getToken = async () => {
    try {
      let option = {
        headers: { "Content-Type": "application/json" },
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER}/quizMaster/token`,
        { refreshTokenId: Cookies.get("refreshToken") },
        option
      );
      Cookies.set("token", response.data.token, {
        expires: 5 / (60 * 24), //5min
        sameSite: "Strict",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const submitLoginDetails = (e) => {
    e.preventDefault();
    questionAdd.incorrectAnswer[0] = op.op1;
    questionAdd.incorrectAnswer[1] = op.op2;
    questionAdd.incorrectAnswer[2] = op.op3;

    if (Cookies.get("refreshToken")) {
      if (Cookies.get("token")) {
        submitQuestion();
      } else {
        getToken();
        submitQuestion();
      }
      setQuestionAdd({
        statement: "",
        correctAnswer: "",
        incorrectAnswer: ["", "", ""],
        category: "",
      });
      setOp({ op1: "", op2: "", op3: "" });
      setErrMsg("");
      alert("Question Added Successfully");
    } else {
      setErrMsg("*You have to login first, to add a question.");
    }
  };

  return (
    <div>
      <div className="formDiv">
        <h1 className="Quesheading">Question</h1>
        <form className="form" onSubmit={submitLoginDetails}>
          <div className="modalListItemQues">
            <label className="modalListItemLabelQues">Category Name* </label>
            <input
              className="modalListItemInputFeild"
              type="text"
              name="category"
              value={questionAdd.category}
              onChange={changeHandlerLogin}
              required
            ></input>
          </div>
          <div className="modalListItemQues">
            <label className="modalListItemLabelQues">
              Problem Statement*{" "}
            </label>
            <input
              className="modalListItemInputFeild"
              type="text"
              name="statement"
              value={questionAdd.statement}
              onChange={changeHandlerLogin}
              required
            ></input>
          </div>
          <div className="modalListItemQues">
            <label className="modalListItemLabelQues">Correct Answer* </label>
            <input
              className="modalListItemInputFeild"
              type="text"
              name="correctAnswer"
              value={questionAdd.correctAnswer}
              onChange={changeHandlerLogin}
              required
            ></input>
          </div>
          <div className="modalListItemQues">
            <label className="modalListItemLabelQues">
              Incorrect Answers*{" "}
            </label>

            <input
              className="modalListItemInputFeild modalListItemInputFeildQues"
              type="text"
              name="op1"
              value={op.op1}
              onChange={changeHandlerLoginOp}
              required
            ></input>

            <input
              className="modalListItemInputFeild modalListItemInputFeildQues"
              type="text"
              name="op2"
              value={op.op2}
              onChange={changeHandlerLoginOp}
              required
            ></input>

            <input
              className="modalListItemInputFeild modalListItemInputFeildQues"
              type="text"
              name="op3"
              value={op.op3}
              onChange={changeHandlerLoginOp}
              required
            ></input>
          </div>
          <div className="modalListItem">
            <span className="ErrorMsg">{errMsg}</span>
          </div>
          <div className="buttonDiv">
            <Button className="buttonQues" type="submit">
              submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddQuestion;
