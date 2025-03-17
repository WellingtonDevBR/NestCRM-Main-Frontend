
import React from "react";
import { Link } from "react-router-dom";

const LoginHeader = () => {
  return (
    <div className="mb-10">
      <Link
        to="/"
        className="flex items-center"
      >
        <img 
          src="/lovable-uploads/f331213a-aeba-40ff-a2df-5d1da1bc386f.png" 
          alt="NestCRM Logo" 
          className="h-8 w-8 mr-2" 
        />
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">NESTCRM</span>
      </Link>
      <h2 className="mt-6 text-3xl font-bold tracking-tight">
        Sign in to your account
      </h2>
      <p className="mt-2 text-sm text-foreground/70">
        New to NESTCRM?{" "}
        <Link to="/signup" className="text-primary hover:text-primary/80 font-medium">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginHeader;
