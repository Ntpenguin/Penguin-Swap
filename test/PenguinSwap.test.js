const { assert } = require('chai');
const { default: Web3 } = require('web3');

const Token = artifacts.require("Token");
const PenguinSwap = artifacts.require("PenguinSwap");

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('PenguinSwap', (accounts) => {
    let token, penguinSwap



    before(async () => {
        token = await Token.new()
        penguinSwap = await PenguinSwap.new()
        //transfer all tokens to PenguinSwap (1 million)
        await token.transfer(penguinSwap.address, tokens('1000000'))
    })

    describe('Token deployment', async () =>{
        it('contract has a name', async () => {

            const name = await token.name()
            assert.equal(name, 'Penguin Token')
        })
    })



    describe('PenguinSwap deployment', async () =>{
        it('contract has a name', async () => {

            const name = await penguinSwap.name()
            assert.equal(name, 'PenguinSwap Instant Exchange')
        })

        it('contract has tokens', async () => {

            let balance = await token.balanceOf(penguinSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))
        }) 
    })
})