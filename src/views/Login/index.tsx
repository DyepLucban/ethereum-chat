import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { IconLogin } from "@tabler/icons";
import {
  Button,
  Center,
  Container,
  Group,
  Paper,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

const Login = () => {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [isDisableButton, setIsDisableButton] = useState(false);
  const [ethereumWallet, setEthereumWallet] = useState("");
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const account = localStorage.getItem("wallet");
  const label = isMetamaskInstalled
    ? "Connect Metamask to Login"
    : "No Metamask Installed";

  useEffect(() => {
    if ((window as any).ethereum) {
      setIsMetamaskInstalled(true);
    }
    displayChats()
    handleProvider()
  });

  const handleProvider = async () => {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    await provider.send("eth_requestAccounts", []);    
    return provider;
  }

  const form = useForm({
    initialValues: {
      message: "",
    },
  });

  const connectMetamaskWallet = async () => {
    const provider = await handleProvider();
    const signer = provider.getSigner();
    const userWallet = await signer.getAddress();
    setEthereumWallet(userWallet);
    localStorage.setItem("wallet", userWallet);
  };

  const LoginButton = () => {
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

  const handleSubmit = async (value: any) => {
    const provider = await handleProvider();
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();
    const contract = await new ethers.Contract(contractAddress, abi, signer);
    const messageTransaction = await contract.sendMessage(userAddress, value.message);
    await messageTransaction.wait();
  };

  const contractAddress = "0x13d161c7d3bc93f56992cdb1f35bc3b98ce68108";
  const abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_senderAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_content",
          "type": "string"
        }
      ],
      "name": "sendMessage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "browseChats",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "senderAddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "content",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            }
          ],
          "internalType": "struct DappChat.Message[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "chat",
      "outputs": [
        {
          "internalType": "address",
          "name": "senderAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "content",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "chats",
      "outputs": [
        {
          "internalType": "address",
          "name": "senderAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "content",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "index",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  const displayChats = async () => {
    const provider = await handleProvider();
    const signer = provider.getSigner();
    const contract = await new ethers.Contract(contractAddress, abi, signer);
    let chats;
    let chatArray = [];
    const indexCount = await contract.index();

    for (let i = 1; i <= indexCount; i++) {
      chats = await contract.chats(i);
      chatArray.push(chats);
    }
    console.log(chatArray);
  };

  const ChatBox = () => {
    return (
      <div>
        <Container mt={20}>
          <h3>You logged in as: {account}</h3>
          <Stack p="lg" justify="center">
            <Textarea
              style={{ backgroundColor: "white" }}
              mt="md"
              autosize
              minRows={2}
              disabled
              value={"Messages here"}
            />
            <form
              onSubmit={form.onSubmit(values => handleSubmit(values))}
              className="form-holder"
            >
              <Textarea
                required
                label="Your Message"
                mb="sm"
                {...form.getInputProps("message")}
              />

              <Button
                size="lg"
                type="submit"
                color="violet"
                fullWidth
                loaderPosition="right"
                property="variant=bars"
              >
                Submit
              </Button>
            </form>
          </Stack>
        </Container>
      </div>
    );
  };

  return <>{!account ? LoginButton() : ChatBox()}</>;
};

export default Login;
