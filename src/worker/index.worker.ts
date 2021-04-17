import { Condition } from '../domain/simulator'
import { calc } from '../simulator'

addEventListener('message', async (e: MessageEvent<Condition>) => {
  const id = Math.random()

  postMessage({ type: 'start', id })

  for await (const result of calc(e.data)) {
    postMessage({ type: 'calc', id, result })
  }

  postMessage({ type: 'end', id })
})
