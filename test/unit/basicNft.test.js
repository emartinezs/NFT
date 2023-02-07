const { assert } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Basic NFT Unit Tests", () => {
          let basicNft, deployer

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["basicnft"])
              basicNft = await ethers.getContract("BasicNft", deployer)
          })

          describe("constructor", () => {
              it("initializes the contract correctly", async () => {
                  const name = await basicNft.name()
                  const symbol = await basicNft.symbol()
                  const tokenCounter = await basicNft.getTokenCounter()

                  assert.equal(name, "Dogie")
                  assert.equal(symbol, "DOG")
                  assert.equal(tokenCounter, 0)
              })
          })

          describe("mintNft", () => {
              it("mints a new NFT", async () => {
                  const staringTokenCounter = await basicNft.getTokenCounter()
                  const txResponse = await basicNft.mintNft()
                  await txResponse.wait(1)
                  const balance = await basicNft.balanceOf(deployer)
                  const tokenURI = await basicNft.tokenURI(staringTokenCounter)
                  const owner = await basicNft.ownerOf(staringTokenCounter)
                  const endingTokenCounter = await basicNft.getTokenCounter()

                  assert.equal(balance, 1)
                  assert.equal(tokenURI, await basicNft.TOKEN_URI())
                  assert.equal(owner, deployer)
                  assert.equal(endingTokenCounter, 1)
              })
          })
      })
