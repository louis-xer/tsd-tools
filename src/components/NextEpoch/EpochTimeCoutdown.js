import React, { useEffect, useState } from 'react'

function epochformatted() {
  const epochStart = 1609473600
  const epochPeriod = 60 * 60
  const minute = 60
  const unixTimeSec = Math.floor(Date.now() / 1000)

  let epochRemainder = unixTimeSec - epochStart
  const epoch = Math.floor(epochRemainder / epochPeriod)
  epochRemainder -= epoch * epochPeriod
  const epochMinute = Math.floor(epochRemainder / minute)
  epochRemainder -= epochMinute * minute

  const minutes = 60 - epochMinute
  const second = 60 - epochRemainder

  return `00:${minutes > 9 ? minutes : '0' + minutes.toString()}:${
    second > 9 ? second : '0' + second.toString()
  }`
}

const NextEpoch = props => {
  const [epochTime, setEpochTime] = useState('00:00:00')

  useEffect(() => {
    let isCancelled = false

    async function updateTime() {
      if (!isCancelled) {
        setEpochTime(epochformatted())
      }
    }
    updateTime()
    const id = setInterval(updateTime, 1000)

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true
      clearInterval(id)
    }
  }, [])

  return <a>{epochTime}</a>
}

export default NextEpoch
