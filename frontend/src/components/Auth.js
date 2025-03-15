import React, { useState } from 'react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle authentication logic here
    console.log('Email:', email, 'Password:', password);
  };

  return (
    <div className="auth">
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <p onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
      </p>
    </div>
  );
};

export default Auth;