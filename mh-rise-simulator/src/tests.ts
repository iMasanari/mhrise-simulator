import { calc } from '.'

const test = async () => {
  const options = {
    skill: {
      '弱点特効': 3,
      '超会心': 3,
    },
    ignore: [
    ],
    limit: 10,
  }

  for await (const result of calc(options)) {
    console.log(result)
  }
}

test()
