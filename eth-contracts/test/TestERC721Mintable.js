var ERC721Mintable = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new("Udacity Property Coin Pranay", "UPCP",{from: account_one} );

            // TODO: mint multiple tokens
            for( i = 1;i<=10;i++) {
                await this.contract.mint(account_one, i, {from: account_one});
            }
        })

        it('should return total supply', async function () { 
            let supply = await this.contract.totalSupply.call({from: account_one});
            assert.equal(supply == 10, true, "incorrect token supply ".concat(supply.toString()) );
        })

        it('should get token balance', async function () { 
            let balance = await this.contract.balanceOf.call(account_one, {from: account_one});
            assert.equal(balance == 10, true, "incorrect token balance");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            it('should return token uri', async function () { 
                let tokenURI = await this.contract.tokenURI.call(1, {from: account_one})
                assert.equal(tokenURI == "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", true, "incorrect tokenURI " + tokenURI);
            })
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.safeTransferFrom(account_one, account_two, 2, {from:account_one});
            let owner = await this.contract.ownerOf.call(2, {from:account_two});
            assert.equal(owner == account_two, true, 'token transfer failed : '.concat(owner));
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new("Udacity Property Coin Pranay", "UPCP",{from: account_one} );
        })

        it('should fail when minting when address is not contract owner', async function () { 
            try{
                await this.contract.mint(account_two, 11, {from: account_two})
            }catch(e){
                // error
            }
            let owner = await this.contract.ownerOf(11);
            assert.equal(owner == account_two, false, "Only contract owner is allowed to mint");
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.owner.call();
            assert.equal(owner == account_one, true, "contract owner is account one");
        })

    });
})