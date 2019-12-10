import React from 'react'

import styles from './Tutorials.css'

export default props => {
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>💡 Como usar essa e outras ferramentas</h2>
      </header>
      <div className={styles.content}>
        {props.videos.map(vid => (
          <div className={styles.vidWrapper}>
            <div className={styles.vidContainer}>
              <iframe
                src={`https://www.youtube.com/embed/${vid.url
                  .match(/\?v=[\d\w\-]*/gi)[0]
                  .replace('?v=', '')}`}
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullscreen
              ></iframe>
            </div>
            <h3>{vid.title}</h3>
          </div>
        ))}
      </div>
    </section>
  )
}
