// src/components/CodeHelperButton.jsx
import React from "react";

const CodeHelper = () => {
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
        onClick={() => alert("도움이 필요하신가요?")} // 원하는 기능 연결
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
