const NFT = artifacts.require("ERC721PresetMinterPauserAutoId")
const BN = require("bignumber.js")
const Swapper = artifacts.require("Swapper")
const chai = require("chai")
chai.use(require("chai-as-promised"))
const expect = chai.expect

describe("Swapper", () => {
  let owner, swapper, beeple, punks, beepleId, punksId, swap, bobBalance
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    ;[owner, alice, bob] = accounts
    beeple = await NFT.new("beeple", "BPL", "")
    punks = await NFT.new("crypto_punks", "CPK", "")
    swapper = await Swapper.new()

    let result = await beeple.mint(alice, { from: owner })
    beepleId = String(result.logs[0].args.tokenId)
    result = await punks.mint(bob, { from: owner })
    punksId = String(result.logs[0].args.tokenId)

    swap = {
      token1: beeple.address,
      tokenId1: beepleId,
      owner1: alice,
      token2: punks.address,
      tokenId2: punksId,
      owner2: bob,
      askPrice: 0,
      expirationTime: 1640995200 // January 1, 2022 12:00:00 AM
    }
  })



  it("should succeed with fulfilled payment and token approvals", async () => {
    const askPrice = 10000

    swapWithAskPrice = {
      token1: beeple.address,
      tokenId1: beepleId,
      owner1: alice,
      token2: punks.address,
      tokenId2: punksId,
      owner2: bob,
      askPrice: askPrice,
      expirationTime: 1640995200 // January 1, 2022 12:00:00 AM
    }
    const sendingValue = askPrice
    const result = await swapper.proposeSwap(swapWithAskPrice, { from: alice })
    const swapId = String(result.logs[0].args.swapId)
    await beeple.approve(swapper.address, beepleId, { from: alice })
    await punks.approve(swapper.address, punksId, { from: bob })
    await swapper.makePayment(swapId, {from: bob, value: sendingValue});
    return expect(swapper.swap(swapId)).to.be.fulfilled
  })

  it("should fail if askPrice is not fulfilled", async () => {
    const askPrice = 10000

    swapWithAskPrice = {
      token1: beeple.address,
      tokenId1: beepleId,
      owner1: alice,
      token2: punks.address,
      tokenId2: punksId,
      owner2: bob,
      askPrice: askPrice,
      expirationTime: 1640995200 // January 1, 2022 12:00:00 AM
    }
    const result = await swapper.proposeSwap(swapWithAskPrice, { from: alice })
    const swapId = String(result.logs[0].args.swapId)
    await beeple.approve(swapper.address, beepleId, { from: alice })
    await punks.approve(swapper.address, punksId, { from: bob })
    return expect(swapper.swap(swapId)).to.be.rejectedWith(/Payment is not done/)
  })

  it("should fail if askPrice is greater than sending amount", async () => {
    const askPrice = 10000

    swapWithAskPrice = {
      token1: beeple.address,
      tokenId1: beepleId,
      owner1: alice,
      token2: punks.address,
      tokenId2: punksId,
      owner2: bob,
      askPrice: askPrice,
      expirationTime: 1640995200 // January 1, 2022 12:00:00 AM
    }

    const sendingValue = askPrice - 1
    const result = await swapper.proposeSwap(swapWithAskPrice, { from: alice })
    const swapId = String(result.logs[0].args.swapId)
    return expect(swapper.makePayment(swapId, {from: bob, value: sendingValue})).to.be.rejectedWith(/Not enough eth/)
  })

  it("should fail if swap has expired", async () => {
    expiredSwap = {
      token1: punks.address,
      tokenId1: punksId,
      owner1: alice,
      token2: beeple.address,
      tokenId2: beepleId,
      owner2: bob,
      askPrice: 0,
      expirationTime: 1625097600
    }
    const result = await swapper.proposeSwap(expiredSwap, { from: alice })
    const swapId = String(result.logs[0].args.swapId)
    await beeple.approve(swapper.address, beepleId, { from: alice })
    await punks.approve(swapper.address, punksId, { from: bob })
    return expect(swapper.swap(swapId)).to.be.rejectedWith(/Swap has expired/)
  })

  it("should let you propose a swap", async () => {
    return expect(swapper.proposeSwap(swap, { from: alice })).to.be.fulfilled
  })

  it("should fail if a swap is not possible", async () => {
    const result = await swapper.proposeSwap(swap, { from: alice })
    const swapId = String(result.logs[0].args.swapId)
    return expect(swapper.swap(swapId)).to.be.rejectedWith(/ERC721: transfer caller is not owner nor approved/)
  })

  it("should still fail if only one person has approved", async () => {
    const result = await swapper.proposeSwap(swap, { from: alice })
    const swapId = String(result.logs[0].args.swapId)
    await beeple.approve(swapper.address, beepleId, { from: alice })
    return expect(swapper.swap(swapId)).to.be.rejectedWith(/ERC721: transfer caller is not owner nor approved/)
  })

  it("should successfuly swap if both parties have approved", async () => {
    const result = await swapper.proposeSwap(swap, { from: alice })
    const swapId = String(result.logs[0].args.swapId)
    await beeple.approve(swapper.address, beepleId, { from: alice })
    await punks.approve(swapper.address, punksId, { from: bob })
    await expect(swapper.swap(swapId)).to.be.fulfilled

    // Ensure owners have actually swapped
    expect(await beeple.ownerOf(beepleId)).to.equal(bob)
    expect(await punks.ownerOf(punksId)).to.equal(alice)
  })

  it("should allow for multiple swaps to be active at a time", async () => {
    // First swap
    let result = await swapper.proposeSwap(swap, { from: alice })
    const swapId1 = String(result.logs[0].args.swapId)

    const swap2 = {
      token1: punks.address,
      tokenId1: punksId,
      owner1: alice,
      token2: beeple.address,
      tokenId2: beepleId,
      owner2: bob,
      askPrice: 0,
      expirationTime: 1640995200 // January 1, 2022 12:00:00 AM

    }
    result = await swapper.proposeSwap(swap2, { from: alice })
    const swapId2 = String(result.logs[0].args.swapId)

    await beeple.approve(swapper.address, beepleId, { from: alice })
    await punks.approve(swapper.address, punksId, { from: bob })
    await expect(swapper.swap(swapId1)).to.be.fulfilled

    await beeple.approve(swapper.address, beepleId, { from: bob })
    await punks.approve(swapper.address, punksId, { from: alice })
    return expect(swapper.swap(swapId2)).to.be.fulfilled
  })
})
