import React from "react";

function AuthFooter({ children, back }) {
  return (
    <div className="auth-footer-root">
      <button
        onClick={() => back && back()}
        className="auth-btns touchable-opacity"
        style={{
          background: "black",
          borderBottomLeftRadius: 5,
          margin: 0,
        }}
      >
        BACK
      </button>
      {children}
    </div>
  );
}

export default AuthFooter;
