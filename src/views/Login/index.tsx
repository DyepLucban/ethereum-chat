import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { IconLogin } from "@tabler/icons";
import { Navigate, useNavigate } from "react-router-dom";
import { URL_PATHS } from "../../config/url";
import { Button } from "@mantine/core";

const Login = () => {
	const navigate = useNavigate();
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [isDisableButton, setIsDisableButton] = useState(false);
  const label = isMetamaskInstalled
    ? "Connect Metamask to Login"
    : "No Metamask Installed";

  useEffect(() => {
    if ((window as any).ethereum) {
      setIsMetamaskInstalled(true);
    }
    handleProvider()
  });

  const handleProvider = async () => {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    await provider.send("eth_requestAccounts", []);    
    return provider;
  }

  const connectMetamaskWallet = async () => {
    const provider = await handleProvider();
    const signer = provider.getSigner();
    const userWallet = await signer.getAddress();
    localStorage.setItem("wallet", userWallet);
    navigate("../home", { replace: true });
  };

  if (localStorage.getItem('wallet')) {
    return <Navigate to={URL_PATHS.home} replace />;
  }

  return (
    <div>
      <h1>Web3 Chat powered by Ethereum</h1>
      <Button
        onClick={connectMetamaskWallet}
        leftIcon={<IconLogin />}
        color="violet"
        disabled={isDisableButton}
      >
        {label}
      </Button>
    </div>
  );
};

export default Login;
