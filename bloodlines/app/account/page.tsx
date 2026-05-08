"use client";

import { useState, useEffect } from "react";

interface User {
  name: string;
  email: string;
}

export default function Account() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const signedIn = localStorage.getItem('signedIn');
    if (signedIn === 'true') {
      setIsSignedIn(true);
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const handleAuth = () => {
    if (isSignUp) {
      // Mock sign up
      if (name && email && password) {
        const mockUser: User = { name, email };
        localStorage.setItem('signedIn', 'true');
        localStorage.setItem('user', JSON.stringify(mockUser));
        setIsSignedIn(true);
        setUser(mockUser);
        setName("");
        setEmail("");
        setPassword("");
        setIsSignUp(false);
      }
    } else {
      // Mock sign in
      if (email && password) {
        const mockUser: User = { name: email.split('@')[0], email };
        localStorage.setItem('signedIn', 'true');
        localStorage.setItem('user', JSON.stringify(mockUser));
        setIsSignedIn(true);
        setUser(mockUser);
        setEmail("");
        setPassword("");
      }
    }
  };

  const signOut = () => {
    localStorage.removeItem('signedIn');
    localStorage.removeItem('user');
    setIsSignedIn(false);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto bg-surface-dark p-6 rounded-lg border border-border">
        <h1 className="text-2xl font-bold text-white mb-6">Account</h1>

        {isSignedIn && user ? (
          <div>
            <div className="mb-4">
              <p className="text-muted">Welcome, <span className="text-white">{user.name}</span></p>
              <p className="text-muted-dark text-sm">{user.email}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-2">Manage Account</h2>
              <div className="space-y-2">
                <button className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/80">
                  Change Password
                </button>
                <button className="w-full bg-secondary text-white py-2 px-4 rounded hover:bg-secondary/80">
                  Update Profile
                </button>
                <button className="w-full bg-accent text-white py-2 px-4 rounded hover:bg-accent/80">
                  View Family Trees
                </button>
              </div>
            </div>

            <button
              onClick={signOut}
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>

            {isSignUp && (
              <div className="mb-4">
                <label className="block text-muted text-sm mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface p-2 rounded border border-border text-white"
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-muted text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface p-2 rounded border border-border text-white"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6">
              <label className="block text-muted text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface p-2 rounded border border-border text-white"
                placeholder="Enter your password"
              />
            </div>

            <button
              onClick={handleAuth}
              className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/80"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>

            <p className="text-center text-muted-dark text-sm mt-4">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}