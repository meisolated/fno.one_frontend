
// const soundsUrl = "https://fno.one/sounds/"
// const audios = {
//     marketOpen: soundsUrl + "market_open.mp3",
//     marketFirstHalfPassed: soundsUrl + "market_first_half_passed.mp3",
//     marketClosed: soundsUrl + "market_closed.mp3",
//     TwelveOClock: soundsUrl + "12_o_clock.mp3",
//     ThreeOClock: soundsUrl + "3_o_clock.mp3",
// }

// setInterval(() => {
//     const date = new Date()
//     const hours = date.getHours()
//     const minutes = date.getMinutes()
//     const seconds = date.getSeconds()
//     if (hours === 9 && minutes === 15 && seconds === 0) {
//         const audio = new Audio(audios.marketOpen)
//         audio.play()
//     } else if (hours === 12 && minutes === 30 && seconds === 0) {
//         const audio = new Audio(audios.marketFirstHalfPassed)
//         audio.play()
//     } else if (hours === 15 && minutes === 30 && seconds === 0) {
//         const audio = new Audio(audios.marketClosed)
//         audio.play()
//     } else if (hours === 12 && minutes === 0 && seconds === 0) {
//         const audio = new Audio(audios.TwelveOClock)
//         audio.play()
//     } else if (hours === 15 && minutes === 0 && seconds === 0) {
//         const audio = new Audio(audios.ThreeOClock)
//         audio.play()
//     }
// }, 1000)