import { useState } from "react";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { saveAuthentication, validateCredentials } from "./utils/auth";

const AuthModal = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      setError("Both fields are required");
      return;
    }

    if (validateCredentials(username, password)) {
      saveAuthentication();
      onSuccess();
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl animate-scale-in">
        <h2 className="text-xl font-semibold text-center mb-4">
          Authentication Required
        </h2>

        {error && (
          <p className="text-sm text-red-600 mb-3 text-center">{error}</p>
        )}

        <div className="space-y-3">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
          onClick={handleLogin}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default AuthModal;
