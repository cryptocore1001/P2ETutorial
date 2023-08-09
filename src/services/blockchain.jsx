import abi from "../artifacts/contracts/DappBreed.sol/DappBreed.json";
import address from "../artifacts/contractAddress.json";
import { ethers } from "ethers";

const contractAddress = address.address;
const contractAbi = abi.abi;
let tx;
const toWei = (num) => ethers.utils.parseEther(num.toString());

if (typeof window !== "undefined") {
  ethereum = window.ethereum;
}

const getEthereumContract = async () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);

  return contract;
};

const ssrEthereumContract = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://localhost:8545"
  );
  const wallet = ethers.Wallet.createRandom();
  const signer = provider.getSigner(wallet.address);
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);
  return contract;
};

const mintNft = async (mintCost)=> {
    try {

        if(!ethereum) return alert('please install metamask')
        const contract = await getEthereumContract()

        tx = await contract.mintNft({
          value: toWei(mintCost)
        })

        await tx.wait()

    } catch (err) {
       reportError(err)
    }
}

const breedNft = async ({ fatherId, motherId, mintCost })=> {
    try {

      if (!ethereum) return alert("please install metamask");
      const contract = await getEthereumContract();

      tx = await contract.breedNft(fatherId, motherId, {
          value: toWei(mintCost)
      })

    } catch (err) {
       reportError(err)
    }
}


const setBaseUri = async (newBaseUri) => {
  try {
    if (!ethereum) return alert("please install metamask");
    const contract = await getEthereumContract();

    tx = await contract.setBaseURI(newBaseUri);

    tx.wait();
  } catch (err) {
    reportError(err);
  }
};

const getMintedNfts = async ()=> {
  try {
    if (!ethereum) return console.log("please install metamask");
    const contract = await ssrEthereumContract();

    const nfts = await contract.getMintedNfts()
  } catch (err) {
    reportError(err)
  }
}

const getMintedNft = async (tokenId)=> {
  try {
    if (!ethereum) return console.log("please install metamask");
    const contract = await ssrEthereumContract();

    const nft = await contract.getMintedNft(tokenId);
  } catch (err) {
    reportError(err)
  }
}

const getTrait =  async (tokenId)=> {
   try {
     if (!ethereum) return console.log("please install metamask");
     const contract = await ssrEthereumContract();

     const trait = await contract.getMintedNft(tokenId);
   } catch (err) {
     reportError(err)
   }
} 
