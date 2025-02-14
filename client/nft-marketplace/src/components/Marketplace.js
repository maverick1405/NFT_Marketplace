import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";
import abi from "../contracts/NFTMarketplace.json";

const contractABI = abi.abi;
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function Marketplace() {
  const sampleData = [
    {
      name: "NFT#1",
      description: "First NFT",
      website: " ",
      image:
        "https://gateway.pinata.cloud/ipfs/QmQPGHyYLtc4NgkrTa4UVFRmLZa56Fs49dp543f3GYdLRg",
      price: "0.03ETH",
      currentlySelling: "False",
      address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    },
    {
      name: "NFT#2",
      description: "Second NFT",
      website: " ",
      image:
        "https://gateway.pinata.cloud/ipfs/QmUmCunKexvwEkD3MXSyrqR7VuM1uQ6e1Bx7pieCoZL6ix",
      price: "0.03ETH",
      currentlySelling: "False",
      address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    },
    {
      name: "NFT#3",
      description: "Third NFT",
      website: " ",
      image:
        "https://gateway.pinata.cloud/ipfs/bafybeicezecauoav6xticxymtrrbhiy6me4srpmzb3j3lrenj7ik4eedka",
      price: "0.03ETH",
      currentlySelling: "False",
      address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    },
  ];
  const [data, updateData] = useState(sampleData);
  const [dataFetched, updateFetched] = useState(false);

  async function getAllNFTs() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(contractAddress, contractABI, signer);
    //create an NFT Token
    let transaction = await contract.getAllNFTs();

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(
      transaction.map(async (i) => {
        var tokenURI = await contract.tokenURI(i.tokenId);
        console.log("getting this tokenUri", tokenURI);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        return item;
      })
    );

    updateFetched(true);
    updateData(items);
  }

  if (!dataFetched) getAllNFTs();

  return (
    <div>
      <Navbar></Navbar>
      <div className="flex flex-col place-items-center mt-20">
        <div className="md:text-xl font-bold text-white">Listed NFTs</div>
        <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
          {data.map((value, index) => {
            return <NFTTile data={value} key={index}></NFTTile>;
          })}
        </div>
      </div>
    </div>
  );
}
