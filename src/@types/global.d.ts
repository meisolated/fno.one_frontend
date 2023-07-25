export { }

declare global {
    interface optionChainApi {
        optionChainList: Array<String>
        expiryList: Array<String>
        currentExpiry: String
    }

}
