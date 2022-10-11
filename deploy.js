const HdWalletProvider = require("@truffle/hdwallet-provider")
const Web3 = require("web3")
const {interface, bytecode} = require("./compile.js")
const phrase = "hollow attitude clinic tool middle business dice spread drift jaguar panel chest"
const url = "https://goerli.infura.io/v3/9f935a0dec1f43d4aaa7b618ebbf0294"
const provider = new HdWalletProvider(phrase, url)
const web3 = new Web3(provider)

const deploy = async () => {
  const accounts = await web3.eth.getAccounts()
  console.log("Deploying from account: " + accounts[0])
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({gas: 1000000, from: accounts[0]})
  console.log("Contract successfully deployed to address: " + result.options.address)
}

deploy()