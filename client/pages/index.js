import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { ethers, utils } from 'ethers';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
const DynamicToaster = dynamic(
  () => import('react-hot-toast').then((module) => module.Toaster),
  { ssr: false }
);

import Input from 'components/common/Input';
import Button from 'components/common/Button';
import { SuccessToast, ErrorToast } from 'components/common/Toast';
import abi from 'abi/MemeCoin.json';

export default function Home() {
  const [haveMetaMask, setHaveMetaMask] = useState(false);
  const [accountAddress, setAccountAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenOwner, setTokenOwner] = useState('');
  const [tokenTotalSupply, setTokenTotalSupply] = useState(0);
  const [isTokenOwner, setIsTokenOwner] = useState(false);
  const [inputValue, setInputValue] = useState({
    walletAddress: '',
    transferAmount: '',
    burnAmount: '',
    mintAmount: '',
  });

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const contractAbi = abi.abi;

  const handleInputChange = (e) => {
    setInputValue((prevValue) => ({
      ...prevValue,
      [e.target.name]: e.target.value,
    }));
  };

  const checkMetamaskAvailability = async () => {
    const { ethereum } = window;
    ethereum ? setHaveMetaMask(true) : setHaveMetaMask(false);
  };

  const connectWallet = async () => {
    const { ethereum } = window;
    try {
      !haveMetaMask && ErrorToast('Please Install MetaMask Extension!');
      if (ethereum) {
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccountAddress(accounts[0]);
        setIsConnected(true);
      } else {
        setHaveMetaMask(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTokenInfo = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const memeCoinContract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );
        const [account] = await ethereum.request({
          method: 'eth_requestAccounts',
        });

        const tokenName = await memeCoinContract.name();
        const tokenSymbol = await memeCoinContract.symbol();
        const tokenTotalSupply = await memeCoinContract.totalSupply();
        const tokenOwner = await memeCoinContract.owner();

        setTokenName(tokenName);
        setTokenSymbol(tokenSymbol);
        setTokenTotalSupply(utils.formatEther(tokenTotalSupply));
        setTokenOwner(tokenOwner);

        if (tokenOwner.toLowerCase() === account.toLowerCase())
          setIsTokenOwner(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const transferToken = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const memeCoinContract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );

        const txn = await memeCoinContract.transfer(
          inputValue.walletAddress,
          utils.parseEther(inputValue.transferAmount)
        );
        await txn.wait();
        setInputValue({ walletAddress: '', transferAmount: '' });
        SuccessToast('Transfer tokens successfully.');
      }
    } catch (error) {
      console.log(error);
      ErrorToast('Transfer tokens failed.');
    }
  };

  const mintToken = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const memeCoinContract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );
        const tokenOwner = await memeCoinContract.owner();

        const txn = await memeCoinContract.mint(
          tokenOwner,
          utils.parseEther(inputValue.transferAmount)
        );
        await txn.wait();
        setInputValue({ mintAmount: '' });
        SuccessToast('Mint tokens successfully.');

        // update total supply value
        const totalSupply = await memeCoinContract.totalSupply();
        setTokenTotalSupply(utils.formatEther(totalSupply));
      }
    } catch (error) {
      console.log(error);
      ErrorToast('Mint tokens failed.');
    }
  };

  const burnToken = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const memeCoinContract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );

        const txn = await memeCoinContract.burn(
          utils.parseEther(inputValue.transferAmount)
        );
        await txn.wait();
        setInputValue({ burnAmount: '' });
        SuccessToast('Burn tokens successfully.');

        // update total supply value
        const totalSupply = await memeCoinContract.totalSupply();
        setTokenTotalSupply(utils.formatEther(totalSupply));
      }
    } catch (error) {
      console.log(error);
      ErrorToast('Burn tokens failed.');
    }
  };

  useEffect(() => {
    checkMetamaskAvailability();
    getTokenInfo();
  }, []);

  return (
    <Container
      maxWidth='xl'
      sx={{
        bgcolor: '#EA0085',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Head>
        <title>Pink Panther Coin</title>
        <meta name='description' content='Pink Panther Coin - Web3 Project' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <DynamicToaster />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          flexDirection: 'column',
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          border: '3px solid darkviolet',
          borderRadius: '10px',
          minHeight: '25rem',
          minWidth: ['25rem', '30rem', '40rem'],
          my: '2rem',
        }}
      >
        <Typography
          variant='h5'
          color='darkmagenta'
          fontWeight='bold'
          sx={{ my: '5px' }}
        >
          Pink Panther Coin
        </Typography>
        <Stack direction='row' spacing={1} sx={{ my: '2rem', mx: '0.4rem' }}>
          <Chip label={`Coin: ${tokenName}`} color='secondary' />
          <Chip label={`Symbol: ${tokenSymbol}`} color='secondary' />
          <Chip label={`Total Supply: ${tokenTotalSupply}`} color='secondary' />
        </Stack>
        <Stack direction='column' spacing={2} sx={{ width: '90%' }}>
          <Input
            name='walletAddress'
            label='Wallet Address'
            value={inputValue.walletAddress}
            onChange={(e) => handleInputChange(e)}
          />
          <Input
            name='transferAmount'
            label='Transfer Amount'
            value={inputValue.transferAmount}
            onChange={(e) => handleInputChange(e)}
          />
          <Button onClick={transferToken} disabled={!isTokenOwner}>
            {!isTokenOwner ? 'You dont have access' : 'Transfer'}
          </Button>

          <Input
            name='mintAmount'
            label='Mint Amount'
            value={inputValue.mintAmount}
            onChange={(e) => handleInputChange(e)}
          />
          <Button disabled={!isTokenOwner} onClick={mintToken}>
            {!isTokenOwner ? 'You dont have access' : 'Mint'}
          </Button>

          <Input
            name='burnAmount'
            label='Burn Amount'
            value={inputValue.burnAmount}
            onChange={(e) => handleInputChange(e)}
          />
          <Button disabled={!isTokenOwner} onClick={burnToken}>
            {!isTokenOwner ? 'You dont have access' : 'Burn'}
          </Button>
        </Stack>
        {isConnected && (
          <Stack spacing={1} sx={{ my: '1rem' }}>
            <Typography variant='body1'>
              Your Account Address: {accountAddress}
            </Typography>
            <Typography variant='body1'>Token Owner: {tokenOwner}</Typography>
          </Stack>
        )}
        <Button
          color='warning'
          size='large'
          onClick={connectWallet}
          sx={{ my: '1rem' }}
          disabled={isConnected}
        >
          {isConnected ? 'Connected' : 'Connect Wallet'}
        </Button>
      </Box>
    </Container>
  );
}
