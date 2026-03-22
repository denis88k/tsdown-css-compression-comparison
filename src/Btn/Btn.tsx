import { useState } from 'react'
import styles from './style.module.scss'

const Btn = ({ type }: { type: string }) => {
  const [count, setCount] = useState(0)

  return (
    <button className={styles['my-button']} onClick={() => setCount(count + 1)}>
      my button
      <br /> type: {type}
      <br /> count: {count}
    </button>
  )
}

export default Btn