"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setError("");
      router.push("/leads");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Painel de Login</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>

          <button type="submit">Entrar</button>
        </form>

        <p className="signup-text">
          Não tem conta? <a href="#">Cadastre-se</a>
        </p>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #6b73ff 0%, #000dff 100%);
          padding: 1rem;
        }

        .login-card {
          background: #fff;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .login-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }

        h1 {
          text-align: center;
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1.5rem;
        }

        .error-message {
          background-color: #ffe5e5;
          color: #d8000c;
          padding: 0.8rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #555;
          font-weight: 500;
        }

        input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid #ccc;
          font-size: 1rem;
          transition: border 0.3s, box-shadow 0.3s;
        }

        input:focus {
          outline: none;
          border-color: #6b73ff;
          box-shadow: 0 0 0 3px rgba(107, 115, 255, 0.2);
        }

        button {
          width: 100%;
          padding: 0.75rem;
          background: #6b73ff;
          color: #fff;
          font-weight: 600;
          border: none;
          border-radius: 0.75rem;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.3s, transform 0.2s;
        }

        button:hover {
          background: #5a63e0;
          transform: translateY(-2px);
        }

        .signup-text {
          text-align: center;
          margin-top: 1rem;
          color: #666;
        }

        .signup-text a {
          color: #6b73ff;
          font-weight: 600;
          text-decoration: none;
        }

        .signup-text a:hover {
          text-decoration: underline;
        }

        /* Responsivo */
        @media (max-width: 480px) {
          .login-card {
            padding: 1.5rem;
            border-radius: 1rem;
          }

          h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
