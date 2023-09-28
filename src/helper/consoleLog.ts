const style = (color: string) => `
  border: 1px solid ${color};
  padding: 5px;
  margin: 5px 0;
  color: ${color};
  font-weight: bold;
  `
let logNumber = 0
const info = (message: string) => {
    return console.log(`%c${message} ${logNumber++}`, style("#3498db"))
}

const success = (message: string) => {
    return console.log(`%c${message} ${logNumber++}`, style("#2ecc71"))
}

const error = (message: string) => {
    return console.log(`%c${message} ${logNumber++}`, style("#e74c3c"))
}

const warning = (message: string) => {
    return console.log(`%c${message} ${logNumber++}`, style("#f1c40f"))
}

export { error, info, success, warning }
