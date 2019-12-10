import React from 'react'

import styles from './Thanks.css'

export default () => {
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}> Criado com 💜 pela Kaordica</h2>
      </header>
      <div className={styles.content}>
        <svg
          viewBox="0 0 108 128"
          fill="#E91E63"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 58.1841V0H57.9426L40.5549 17.4602H17.3877V40.7239L0 58.1841Z" />
          <path d="M0 69.8159V128H57.9426L0 69.8159Z" />
          <path d="M71.6166 0L7.86987 64.0124L71.6166 128H107.425L43.9241 64.0124L107.449 0H71.6166Z" />
        </svg>
        <div>
          <p>
            Pessoal, como sempre foi um enorme prazer trabalhar com a
            Crawly/Plexi! Vocês são nosso <strong>ideal de cliente</strong> por
            confiarem na gente, serem tão tranquilos e divertidos e terem um
            negócio f*da no qual acreditamos.
          </p>
          <p>
            Torcemos que o site da Plexi consiga trazer muitos negócios pra
            vocês e qualquer coisa estamos aí: henrique@kaordica.design ou (24)
            988 265 450 😄
          </p>
        </div>
      </div>
    </section>
  )
}
