import React from 'react'
import style from './style.module.scss'

const Footer = () => {
  return (
    <div className={style.footer}>
      <div className={style.footerInner}>
        <a
          href="https://truedollar.finance"
          target="_blank"
          rel="noopener noreferrer"
          className={style.logo}
        >
          True Seigniorage Dollar
          <span />
        </a>
        <br />
        <p className="mb-0">Copyright © 2020 HNH</p>
      </div>
    </div>
  )
}

export default Footer
