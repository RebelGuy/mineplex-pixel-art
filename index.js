const pixels = require("image-pixels")

// https://brightchamps.com/blog/minecraft-color-codes/
const colourCodes = [
  { colour: [170, 0, 0], code: '4' }, // dark_red
  { colour: [255, 85, 85], code: 'c' }, // red
  { colour: [255, 170, 0], code: '6' }, // gold
  { colour: [255, 255, 85], code: 'e' }, // yellow
  { colour: [0, 170, 0], code: '2' }, // dark_green
  { colour: [85, 255, 85], code: 'a' }, // green
  { colour: [85, 255, 255], code: 'b' }, // aqua
  { colour: [0, 170, 170], code: '3' }, // dark_aqua
  { colour: [0, 0, 170], code: '1' }, // dark_blue
  { colour: [85, 85, 255], code: '9' }, // blue
  { colour: [255, 85, 255], code: 'd' }, // light_purple
  { colour: [170, 0, 170], code: '5' }, // dark_purple
  { colour: [255, 255, 255], code: 'f' }, // white
  { colour: [170, 170, 170], code: '7' }, // gray
  { colour: [85, 85, 85], code: '8' }, // dark_gray
  { colour: [0, 0, 0], code: '0' }, // black
]

const main = async () => {
  const file = process.argv[2] ?? 'static/example_in.png'
  const { data, width, height } = await pixels(file)

  if (height > 20) {
    console.warn('Height is greater than 20 and might not display correctly')
  }
  if (width > 25) {
    console.warn('Width is greater than 25 and might not display correctly')
  }

  for (let r = 0; r < height; r++) {
    let msg = ''
    let lastPrefix = 'f' // white

    for (let c = 0; c < width; c++) {
      const index = r * width * 4 + c * 4
      const thisColour = [data[index], data[index + 1], data[index + 2]]

      // search for the colour in Minecraft that best matches the actual colour
      let nearestKnownColour = { distance: Number.MAX_VALUE, colourCode: '' }
      for (let i = 0; i < colourCodes.length; i++) {
        const knownColour = colourCodes[i]
        const distance = getDistance(thisColour, knownColour.colour)
        if (distance < nearestKnownColour.distance) {
          nearestKnownColour = { distance, colourCode: knownColour.code }
        }
      }

      // save space
      const nextPrefix = nearestKnownColour.colourCode
      if (lastPrefix !== nextPrefix) {
        msg += '&' + nextPrefix
        lastPrefix = nextPrefix
      }

      // we use * because the message will never get censored, and we use two to correspond to the vertical padding between lines
      msg += '**'
    }

    console.log(r, msg)
  }
}

main()

function getDistance (c1, c2) {
  const x = c1[0] - c2[0]
  const y = c1[1] - c2[1]
  const z = c1[2] - c2[2]
  return Math.sqrt(x**2 + y**2 + z**2)
}
