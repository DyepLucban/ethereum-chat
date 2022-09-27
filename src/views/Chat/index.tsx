import React, { useEffect, useState } from "react";
import MessageForm from './components/MessageForm';
import MessageBox from "./components/MessageBox";
import { Navigate } from "react-router-dom";
import { URL_PATHS } from "../../config/url";

const Chat = () => {
  const wallet = localStorage.getItem('wallet');
  
  if (!wallet) {
    return <Navigate to={URL_PATHS.home} replace />;
  }

  return (
    <div>
      <MessageBox />
      <MessageForm />
    </div>
  );
};

export default Chat;