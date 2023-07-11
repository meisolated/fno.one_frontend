export { }

declare global {
    interface optionChainApi {
        expiryListWithStrikePrices: {
            [strikePrice: string]: [{
                identifier: string,
                strikePrice: number,
            }]
        }
        strikePrices: number[]
        currentExpiry: string
    }

}
