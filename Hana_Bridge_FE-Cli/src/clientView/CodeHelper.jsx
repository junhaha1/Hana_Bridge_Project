import React from "react";
import '../css/main/CodeHelper.css';
import { useNavigate } from 'react-router-dom';

const CodeHelper = () => {
  const navigate = useNavigate(); 

  return (
    <div className="code-helper-container">
      <button className="code-helper-button" onClick={() =>  navigate(`/aiChat`)}>
        <img
          src="../images/CodeHelper.svg" // public 폴더 기준 경로
          alt="Code Helper"
          className="code-helper-image"
        />
      </button>
    </div>
  );
};

export default CodeHelper;
