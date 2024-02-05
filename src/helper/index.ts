let playSoundQueue: any[] = []

setInterval(() => {
    if (playSoundQueue.length != 0) {
        const audio = new Audio(playSoundQueue[0])
        audio.play()
        playSoundQueue.shift()
    }
}, 2000)

const playThisSound = (url: string) => {
    playSoundQueue.push(url)
}
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
    const words = str.split(" ")
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    return capitalizedWords.join(" ")
}

export { capitalizeFirstLetter, playSound, playThisSound, roundToNearestMultiple }
