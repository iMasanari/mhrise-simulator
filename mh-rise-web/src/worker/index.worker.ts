import { calc, Options } from '@i-masanari/mh-rise-simulator'

addEventListener('message', async (e: MessageEvent<Options>) => {
  const id = Math.random()

  postMessage({ type: 'start', id })

  for await (const result of calc(e.data)) {
    postMessage({ type: 'calc', id, result })
  }

  postMessage({ type: 'end', id })
})
