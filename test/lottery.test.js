const assert = require("assert")
const ganache = require("ganache-cli")
const Web3 = require("web3")
const web3 = new Web3(ganache.provider())
const {interface, bytecode} = require("../compile.js")

let lottery
let accounts

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()
  lottery = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({data: bytecode})
      .send({gas: "1000000", from: accounts[0]})
})

describe("Lottery Contract", () => {
  it("Deploys the contract", () => {
    assert.ok(lottery.options.address)
  })
  
  it("allows one account entry", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.0001", "ether")
    })
    const players = await lottery.methods.getPlayers().call({from: accounts[0]})
    assert.equal(1, players.length)
    assert.equal(accounts[0], players[0])
  })
  
  it("allows multiple accounts entry", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.0001", "ether")
    })
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.0001", "ether")
    })
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.0001", "ether")
    })
    const players = await lottery.methods.getPlayers().call({from: accounts[0]})
    assert.equal(3, players.length)
    assert.equal(accounts[0], players[0])
    assert.equal(accounts[1], players[1])
    assert.equal(accounts[2], players[2])
  })
  
  it("requires min amount of ether to enter", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 1
      })
      assert(false)
    } catch (error) {
      assert(error)
    }
  })
  
  it("only manager can call pickWinner fun", async () => {
    try {
      await lottery.methods.pickWinner().send({from: accounts[1]})
    } catch (error) {
      assert(error)
    }
  })
  
  it("send money to winner and resets players array", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("2", "ether")
    })
    const initialBal = await web3.eth.getBalance(accounts[0])
    await lottery.methods.pickWinner().send({from: accounts[0]})
    const finalBal = await web3.eth.getBalance(accounts[0])
    const difference = finalBal - initialBal
    assert(difference > web3.utils.toWei("1.8", "ether"))
  })
})







































