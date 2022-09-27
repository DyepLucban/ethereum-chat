import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Container, Group, Paper } from "@mantine/core";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../../config/contract";

const MessageBox = () => {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [chatList, setChatList] = useState<any>(null); 

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

  const chatBubble = () => {

  }
  
  const displayChats = async () => {
    const provider = await handleProvider();
    const signer = provider.getSigner();
    const contract = await new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const indexCount = await contract.index();
    let chatArray = [];
    for (let i = 1; i <= indexCount; i++) {
      const chats = await contract.chats(i);
      console.log(chats)
      chatArray.push(chats);
    }
    setChatList(chatArray);
  };

  return (
    <div>
      <Container>
        <Paper>
          <Group position="left">
            <h3>my message</h3>
          </Group>
          <Group position="right">
            <h3>others message</h3>
          </Group>
        </Paper>
      </Container>
    </div>
  );
}

export default MessageBox;
