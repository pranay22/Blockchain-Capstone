var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
var proof = require("../../zokrates/code/square/proof.json");

contract('SolnSquareVerifier', accounts => {
    const account_one = accounts[0];
    //const account_two = accounts[1];

    describe('Create SolnSquare solutions', function () {
        beforeEach(async function () { 
            this.contract = await SolnSquareVerifier.new({from: account_one} );
        });
    
        it('Can add new Solutions', async function () { 
        // Test if a new solution can be added for contract - SolnSquareVerifier
            var generated = false;
            let keyId = await this.contract.addSolution(account_one, 1, proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs);
        
            let tokId = await this.contract.tokenSolution.call(keyId.logs[0].args[0]);
            generated = true;
            assert.equal(generated, true,"Contract can be added with solution");
        });
        it('Can mint new token', async function () { 
            // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
            let keyId = await this.contract.addSolution(account_one, 1, proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs);
            let minted = await this.contract.mint(account_one, 1, keyId.logs[0].args[0]);

            assert.equal(minted.logs[1].args["tokenId"] == 1, true, "Should be able to generate a token");
        });

        it('Can mint 5 new token', async function () { 
        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
            var results = [];
            for(var i = 0;i<5;i++) {
                let keyId = await this.contract.addSolution(account_one, i, proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs);
                let minted = await this.contract.mint(account_one, i, keyId.logs[0].args[0]);
                results[i] = minted.logs[1].args["tokenId"];
            }
            for(var i=0;i<5;i++) {
                assert.equal(results[i] == i, true, "Should be able to generate a token for token " + results[i].toString());
            }
        });

        it('should return token uri', async function () { 
            let keyId = await this.contract.addSolution(account_one, 1, proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs);
            //let minted = await this.contract.mint(account_one, 1, keyId.logs[0].args[0]);
            let tokenURI = await this.contract.tokenURI.call(1, {from: account_one})
            assert.equal(tokenURI == "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", true, "incorrect tokenURI " + tokenURI);
        })
    });
});
