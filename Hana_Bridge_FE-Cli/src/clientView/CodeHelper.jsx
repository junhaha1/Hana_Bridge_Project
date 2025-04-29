import React from "react";
import { useNavigate } from 'react-router-dom';

const CodeHelper = () => {
  const navigate = useNavigate(); 

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
      }}
    >
      <button
        onClick={() =>  navigate(`/aiChat`)} // 원하는 기능 연결
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <img
          src="../images/CodeHelper.svg" // public 폴더 기준 경로
          alt="Code Helper"
          style={{ width: "142px", height: "52px" }}
        />
      </button>
    </div>
  );
};

export default CodeHelper;
