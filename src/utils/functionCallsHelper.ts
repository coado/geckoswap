import * as contractHelper from './contractHelpers';
import { Library } from 'web3-react/dist/context';

// ERC20 functions -------------------------------------------- 
export const approve = async (library: Library, contractAddress: string, spender: string, amount: number, from: string) => {
    try {
        const contract = contractHelper.getErc20Contract(library, contractAddress)
        await contract.methods.approve(spender, library.utils.toWei(amount, 'ether')).send({from})
    } catch(error) {
        console.error(error);
    }
}

export const getTokenData = async (library: Library, contractAddress: string, address: string, spender: string) => {
    try {
        const contract = contractHelper.getErc20Contract(library, contractAddress)
        let tokenBalance = await contract.methods.balanceOf(address).call()
        let allowance = await contract.methods.allowance(address, spender).call()
        return {
            tokenBalance,
            allowance
        }
    } catch(error) {
        console.error(error);
    }
}


// Factory functions --------------------------------------------
export const getPairAddress = async (library: Library, contractAddress: string, tokenA: string, tokenB: string) => {
    try {
        const contract = contractHelper.getPairContract(library, contractAddress)
        return await contract.methods.getPair(tokenA, tokenB).call()
    } catch(error) {
        console.error(error);
    }
}

// Pair functions
export const getReserves = async (library: Library, pairAddress: string) => {
    try {
        const contractReserves = contractHelper.getReservesContract(library, pairAddress)
        const { _reserve0, _reserve1 }: {_reserve0: string, _reserve1: string} = await contractReserves.methods.getReserves().call() 
        const contractPairTokens = contractHelper.getPairTokensContract(library, pairAddress)
        const _token0: string = await contractPairTokens.methods.token0().call()
        const _token1: string = await contractPairTokens.methods.token1().call()
        
        return { _reserve0, _token0, _reserve1, _token1 }
    } catch(error) {
        console.error(error);
    }
}

export const addLiquidity = async (
    library: Library,
    routerAddress: string,
    token1Address: string,
    token2Address: string,
    token1Value: string,
    token2Value: string,
    toke1MinAmount: string,
    token2MinAmount: string,
    to: string,
    deadline: number
    ) => {

        try {
            const addLiquidityContract = contractHelper.getAddLiquidityContract(library, routerAddress)

            await addLiquidityContract.methods.addLiquidity(
                token1Address, 
                token2Address,
                library.utils.toWei(token1Value, 'ether'), 
                library.utils.toWei(token2Value, 'ether'), 
                library.utils.toWei(toke1MinAmount, 'ether'), 
                library.utils.toWei(token2MinAmount, 'ether'), 
                to, 
                deadline
                ).send({from: to})
                .once('transactionHash', (hash: string) => {
                    console.log(hash);
            })

        } catch(error) {
            console.error(error);
        }
}