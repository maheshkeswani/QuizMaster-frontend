import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import spinner from "../../Images/spinner.gif";
import Result from "../Result/Result";
import "../Quiz/Quiz.css";
import Cookies from "js-cookie";

function Quiz() {
  const { CategoryName, CategoryId } = useParams();
  const [categoryQuestions, setCategoryQuestions] = useState([]);
  const [quesNo, setQuesNo] = useState(0);
  const [score, setScore] = useState(0);
  const [array, setArray] = useState([]);
  const [select, setSelect] = useState("");
  const [activeOption, setActiveOption] = useState([]);
  // const [activeOption, setActiveOption] = useState("");
  const [result, setResult] = useState(false);

  const API = `${process.env.REACT_APP_BACKEND_SERVER}/quizMaster/question/${CategoryId}`;

  const fetchCategoryQuestions = async () => {
    try {
      // const headers = { authorization: Cookies.get("token") }; // for cookie
      // const axiosConfig = { withCredentials: true }; // for cookie
      // const res = await axios.get(API, { headers, axiosConfig }); // for cookie

      const res = await axios.get(API); // for without cookie

      setCategoryQuestions(res.data.questions);
      // console.log("questions is: ", res.data.questions);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategoryQuestions();
    setActiveOption([categoryQuestions.length]);
  }, [result]);

  useEffect(() => {
    makeArray();
  }, [quesNo, categoryQuestions]);

  let x = [];

  const makeArray = () => {
    if (categoryQuestions.length !== 0) {
      x = [
        categoryQuestions[quesNo].correctAnswer,
        ...categoryQuestions[quesNo].incorrectAnswer,
      ];

      let currentIndex = x.length,
        randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [x[currentIndex], x[randomIndex]] = [x[randomIndex], x[currentIndex]];
      }

      setArray(x);

      console.log("ans array is: ", x);
    }
  };

  const checkAnswer = (choice) => {
    if (categoryQuestions[quesNo].correctAnswer === choice) {
      setScore(score + 1);
    } else {
      setScore(score);
    }
  };

  const setActiveOptionFun = (item, quesNo) => {
    const x = [...activeOption];
    x[quesNo] = item;
    setActiveOption(x);
  };

  return (
    <div>
      {result === true ? (
        <Result
          score={score}
          totalques={categoryQuestions.length}
          setQuesNo={setQuesNo}
          setResult={setResult}
          setScore={setScore}
          setActiveOption={setActiveOption}
          setSelect={setSelect}
          setArray={setArray}
        />
      ) : (
        <div className="QuizDiv">
          <div>
            <h1 className="quizH1">Category: {CategoryName}</h1>
          </div>
          <div>
            <h2 className="quizH2">
              {quesNo + 1}/{categoryQuestions.length}
            </h2>
          </div>

          {categoryQuestions.length === 0 ? (
            <div>
              <img src={spinner} alt="" />
            </div>
          ) : (
            <div>
              <div className="questionDiv">
                <h1 className="quizH1">
                  {categoryQuestions[quesNo].statement}
                </h1>
              </div>

              {array.map((item) => (
                <label key={item}>
                  <div>
                    <div
                      className={
                        activeOption[quesNo] === item
                          ? "block__section__questionBox-answers-indiv-fakedisplay-active"
                          : "block__section__questionBox-answers-indiv-fakedisplay"
                      }
                    >
                      <input
                        type="radio"
                        onClick={() => {
                          setSelect(item);
                          setActiveOptionFun(item, quesNo);
                        }}
                        value={item}
                        style={{ display: "none" }}
                      />
                      <span className="optionName">{item}</span>
                    </div>
                  </div>
                </label>
              ))}

              <div className="NavigationDiv">
                <div className="NavigationButton">
                  {quesNo !== 0 ? (
                    <button
                      onClick={() => setQuesNo(quesNo - 1)}
                      className="resultButtonHome"
                    >
                      PREV
                    </button>
                  ) : (
                    <button className="inActive">PREV</button>
                  )}
                </div>

                <div className="NavigationButton">
                  {quesNo !== categoryQuestions.length - 1 ? (
                    <button
                      onClick={() => {
                        checkAnswer(select);
                        setQuesNo(quesNo + 1);
                      }}
                      className="resultButtonHome"
                    >
                      NEXT
                    </button>
                  ) : null}
                </div>

                <div className="NavigationButton">
                  {quesNo === categoryQuestions.length - 1 &&
                  result === false ? (
                    <button
                      onClick={() => {
                        checkAnswer(select);
                        setResult(true);
                      }}
                      className="resultButtonHome"
                    >
                      Check Result
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Quiz;
