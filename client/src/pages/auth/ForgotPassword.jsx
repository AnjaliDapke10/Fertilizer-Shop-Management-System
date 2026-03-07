import { useState } from "react";

const ForgotPassword = () => {

  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Reset password for:", username);
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h2>Forgot Password</h2>
        <p>Enter your username to reset password</p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <button className="btn-primary full-width">
            Reset Password
          </button>

        </form>

      </div>
    </div>
  );
};

export default ForgotPassword;