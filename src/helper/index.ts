const playSound = () => {
    const audio = new Audio("https://fno.one/mp3/ding.mp3")
    audio.play()
}
function roundToNearestMultiple(number: number, multiple: number) {
    return Math.round(number / multiple) * multiple
}
export { playSound, roundToNearestMultiple }
