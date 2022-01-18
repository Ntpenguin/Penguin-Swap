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

contract('PenguinSwap', ([deploye, investor]) => {
    let token, penguinSwap



    before(async () => {
        token = await Token.new()
        penguinSwap = await PenguinSwap.new(token.address)
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
    describe('buyTokens()', async () =>{
    let result
    
    before(async () => {
        result = await penguinSwap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether')})
        
    })

    
        it('Allows user to instantly purchase tokens from penguinSwap for a fixed price', async () =>{
            // Check invesor token balance after purchase
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'))

            let penguinSwapBalance
            penguinSwapBalance = await token.balanceOf(penguinSwap.address)
            assert.equal(penguinSwapBalance.toString(), tokens('999900'))
            penguinSwapBalance = await web3.eth.getBalance(penguinSwap.address)
            assert.equal(penguinSwapBalance.toString(), web3.utils.toWei('1', 'Ether'))

           const event = (result.logs[0].args)
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')




        })
    })
    describe('sellTokens()', async () =>{
        let result
        
        before(async () => {
            
            //ivestor approves
            await token.approve(penguinSwap.address, tokens('100'), {from: investor } )
            //investor sells
            result = await penguinSwap.sellTokens(tokens('100'), {from: investor })
            
        })
    
        
        it('Allows user to instantly sell tokens to penguinSwap for a fixed price', async () => {
            // Check investor token balance after purchase
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('0'))
      
            // Check penguinSwap balance after purchase
            let penguinSwapBalance
            penguinSwapBalance = await token.balanceOf(penguinSwap.address)
            assert.equal(penguinSwapBalance.toString(), tokens('1000000'))
            penguinSwapBalance = await web3.eth.getBalance(penguinSwap.address)
            assert.equal(penguinSwapBalance.toString(), web3.utils.toWei('0', 'Ether'))
      
            // Check logs to ensure event was emitted with correct data
            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')
      
            // FAILURE: investor can't sell more tokens than they have
            await penguinSwap.sellTokens(tokens('500'), { from: investor }).should.be.rejected;
          })
        })

})