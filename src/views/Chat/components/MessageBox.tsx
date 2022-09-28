import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Box, Container, Group, ScrollArea } from "@mantine/core";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../../config/contract";

const MessageBox = () => {
  const [chatList, setChatList] = useState<any>([]); 
  const userAddress = localStorage.getItem('wallet');

  useEffect(() => {
    displayChats()
    handleProvider()
  }, []);

  const handleProvider = async () => {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    await provider.send("eth_requestAccounts", []);    
    return provider;
  }  
  
  const displayChats = async () => {
    const provider = await handleProvider();
    const signer = await provider.getSigner();
    const contract = await new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const indexCount = await contract.index();
    let chatArray = [];
    for (let i = 1; i <= indexCount; i++) {
      const chats = await contract.chats(i);
      chatArray.push(chats);
    };
    setChatList(chatArray);
  };

  return (
    <div>
      <Container>
        <ScrollArea style={{ height: 300 }} px="lg" pt="lg">
          {
            chatList.map((val: any) => {
              if (val['senderAddress'] === userAddress) {
                return (
                  <Group position="right">
                    <Box
                      sx={(theme) => ({
                        backgroundColor: theme.colors.indigo[5],
                        textAlign: 'center',
                        padding: theme.spacing.xs,
                        marginBottom: 5,
                        borderRadius: theme.radius.md,
                        color: theme.colors.gray[0],
                        cursor: 'pointer',
                      })}
                    >
                      <h5>{ val['content'] }</h5>
                    </Box>                    
                  </Group>                  
                );
              } else {
                return (
                  <Group position="left">
                    <Box
                      sx={(theme) => ({
                        backgroundColor: theme.colors.dark[3],
                        textAlign: 'center',
                        padding: theme.spacing.xs,
                        marginBottom: 5,
                        borderRadius: theme.radius.md,
                        color: theme.colors.gray[0],
                        cursor: 'pointer',
                      })}
                    >
                      { val['senderAddress'].substring(0, 11) + '...' }
                      <h5>{ val['content'] }</h5>
                    </Box>
                  </Group>
                );
              }
            })            
          }
        </ScrollArea>
      </Container>
    </div>
  );
}

export default MessageBox;
