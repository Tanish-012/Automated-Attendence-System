import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (username === 'Tanish Kumar' && password === 'T1a2n3i4s5h6#01') {
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">

                <div className="brand">
                    <div className="logo">🌾</div>
                    <h1>Rural Edufiy</h1>
                    <h2>Empowering Rural Education</h2>
                </div>

                <form className="login-card" onSubmit={handleLogin}>
                    <h2>Admin Login</h2>

                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <button type="submit" className="login-btn">Login</button>
                </form>

            </div>
        </div>
    );
};

export default Login;