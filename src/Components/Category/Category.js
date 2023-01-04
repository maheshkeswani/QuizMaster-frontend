import React from "react";
import book from "../../Images/books.svg";
import Anime from "../../Images/movie.svg";
import "../Category/Category.css";

function Category({
  categoryName,
  id,
  setChooseCategorty,
  setChooseCategortyName,
}) {
  return (
    <div>
      <div>
        {categoryName === "General Knowledge" && (
          <div
            className="categoryImgDiv"
            onClick={() => {
              setChooseCategorty(id);
              setChooseCategortyName(categoryName);
            }}
          >
            <img
              src={book}
              alt="category"
              style={{ width: "100%", height: "100%" }}
            ></img>
            <p className="categoryName">{categoryName}</p>
          </div>
        )}
      </div>
      <div>
        {categoryName === "Anime" && (
          <div
            className="categoryImgDiv"
            onClick={() => {
              setChooseCategorty(id);
              setChooseCategortyName(categoryName);
            }}
          >
            <img
              src={Anime}
              alt="category"
              style={{ width: "100%", height: "100%" }}
            ></img>
            <p className="categoryName">{categoryName}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Category;
