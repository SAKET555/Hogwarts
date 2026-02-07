import React, { useEffect, useState } from "react";
import "../styles/Loader.css";

const Loader = () => {
  const [text, setText] = useState("Platform 9¾");

  useEffect(() => {
    const timer = setTimeout(() => {
      setText("Hogwarts Express");
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="loader-root">
      <div className="fog-layer" />

      <div className="loader-content">
        <div className="sign">
          <span className="sign-main">9¾</span>
          <span className="sign-sub">{text}</span>
        </div>

        <div className="divider" />

        <div className="train-silhouette">
          <div className="smoke" />
        </div>

        <p className="loading-text">Preparing departure</p>
      </div>
    </div>
  );
};

export default Loader;
