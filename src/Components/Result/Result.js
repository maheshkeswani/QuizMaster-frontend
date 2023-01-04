import React from "react";
import { Modal } from "react-bootstrap";
import "../Result/Result.css";
import { Link } from "react-router-dom";

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static" //the modal will not close when clicking outside it
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1 className="h1">Score</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="resultPara">You answered</p>
        <h1 className="h1">
          {props.score}/{props.totalques}
        </h1>
        <p className="resultPara">question correct</p>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="resultButton resBtn"
          onClick={() => {
            props.setscore(0);
            props.setactiveoption([0]);
            props.setresult(false);
            props.setquesno(0);
            props.setselect("");
            props.setArray([]);
          }}
        >
          Play Again
        </button>

        <Link to={"/"} className="resultAnchor">
          <p className="resultButton">Back to Home</p>
        </Link>
      </Modal.Footer>
    </Modal>
  );
}

function Result({
  score,
  totalques,
  setQuesNo,
  setResult,
  setScore,
  setActiveOption,
  setSelect,
  setArray,
}) {
  const [modalShow, setModalShow] = React.useState(true);

  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        score={score}
        totalques={totalques}
        setquesno={setQuesNo}
        setresult={setResult}
        setscore={setScore}
        setactiveoption={setActiveOption}
        setselect={setSelect}
        setArray={setArray}
      />
    </>
  );
}

export default Result;
