import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useForm } from "@mantine/form";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../../config/contract";
import {
  Button,
  Container,
  Stack,
  Textarea,
} from "@mantine/core";

const MessageForm = () => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);

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

  const form = useForm({
    initialValues: {
      message: "",
    },
  });

  const handleSubmit = async (value: any) => {
    try {
      setButtonLoading(true);
      const provider = await handleProvider();
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      const contract = await new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const messageTransaction = await contract.sendMessage(userAddress, value.message);
      const isTransactionSend = await messageTransaction.wait();
      if (isTransactionSend) {
        setButtonLoading(false);
        form.setValues({
          message: "",
        });
      }
    } catch (error) {
      setButtonLoading(false);
      console.log(error);
    }
  }

  return (
    <div>
      <Container mt={20}>
        <Stack p="lg" justify="center">
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
              loading={buttonLoading}
            >
              {(buttonLoading) ? 'Sending Message' : 'Send'}
            </Button>
          </form>
        </Stack>
      </Container>
    </div>
  )
}

export default MessageForm;
