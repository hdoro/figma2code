const showImg = target => {
  const container = target.getElementsByClassName('lazy-img__container')[0]
  const { src, srcset, webpsrcset, sizes, alt, width, height } = target.dataset
  container.innerHTML = `
    <picture>
      <source
        type="image/webp"
        srcset="${webpsrcset}"
        ${sizes ? `sizes="${sizes}"` : ''}
      />
      <source srcset="${srcset}" ${sizes ? `sizes="${sizes}"` : ''} />
      <img
        src="${src}"
        srcset="${srcset}"
        ${alt ? `alt="${alt}"` : ''}
        ${sizes ? `sizes="${sizes}"` : ''}
        ${width ? `width="${width}"` : ''}
        ${height ? `height="${height}"` : ''}
        class="lazy-img__img"
      />
    </picture>
  `
  const img = container.getElementsByTagName('img')[0]
  img.onload = () => {
    img.classList.add('lazy-img__img_loaded')
  }
}

const cb = (entries, obs) => {
  for (let i = 0; i < entries.length; i++) {
    const { target, isIntersecting } = entries[i]
    if (isIntersecting) {
      showImg(target)
      obs.unobserve(target)
    }
  }
}

let observer

export const watchImages = images => {
  if (observer) {
    observer.disconnect()
  }
  observer = new IntersectionObserver(cb, {
    rootMargin: '0px 0px 100px 0px',
    threshold: 0.1
  })

  for (let i = 0; i < images.length; i++) {
    observer.observe(images[i])
  }
}
