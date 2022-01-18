const Token = artifacts.require("Token");
const PenguinSwap = artifacts.require("PenguinSwap");

module.exports = async function(deployer) {
  
  //deploy token
  await deployer.deploy(Token);
  const token = await Token.deployed()

  //depoly PenguinSwap
  await deployer.deploy(PenguinSwap, token.address);
  const penguinSwap = await PenguinSwap.deployed()

  //Transfers all tokens to PenguinSwap (1 mil)
  await token.transfer(penguinSwap.address, '1000000000000000000000000')
};