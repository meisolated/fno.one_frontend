const volume = 0.3
let playSoundQueue: any[] = []
let isPlaying = false
setInterval(() => {
    if (playSoundQueue.length != 0) {
        if (!isPlaying) {
            isPlaying = true
            const audio = new Audio(playSoundQueue.shift())
            audio.play()
            audio.volume = volume
            audio.onended = () => {
                isPlaying = false
            }
        }
    }
}, 500)

const playThisSound = (url: string) => {
    playSoundQueue.push(url)
}
const playAlertSound = () => {
    const play = new Audio("https://fno.one/sounds/alert.mp3")
    play.volume = volume
    play.play()
}
const playSuccessSound = () => {
    const play = new Audio("https://fno.one/sounds/success.mp3")
    play.volume = volume
    play.play()
}
const playErrorSound = () => {
    const play = new Audio("https://fno.one/sounds/error.mp3")
    play.volume = volume
    play.play()
}
const playSound = () => {
    const audio = new Audio("https://fno.one/mp3/ding.mp3")
    audio.volume = volume
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

export { capitalizeFirstLetter, playAlertSound, playErrorSound, playSound, playSuccessSound, playThisSound, roundToNearestMultiple }

