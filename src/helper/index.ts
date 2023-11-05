const playSound = () => {
    const audio = new Audio("https://fno.one/mp3/ding.mp3")
    audio.play()
}
function roundToNearestMultiple(number: number, multiple: number) {
    return Math.round(number / multiple) * multiple
}

function capitalizeFirstLetter(str: string) {
    if (str.length === 0) {
        return str
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export { capitalizeFirstLetter, playSound, roundToNearestMultiple }
