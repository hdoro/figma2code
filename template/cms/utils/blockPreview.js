import React from 'react'

import styles from './blockPreview.css'

const PreviewWrapper = (object, customPreview) => {
  return props => {
    return (
      <section className={styles.wrapper}>
        <header className={styles.header}>
          {/* object.icon is a React component, and so we need to call it as a function */}
          {object.icon && object.icon()}
          {object.title}
          {customPreview ? (
            customPreview({ object, ...props })
          ) : (
            <span>
              Double click to edit. Refer to the preview menu for how it'll look
              live.
            </span>
          )}
        </header>
      </section>
    )
  }
}

export default (object, { customPreview } = {}) => {
  const { fields = [] } = object
  const select = fields
    ? fields.reduce((acc, curr) => {
        acc[curr.name] = curr.name
        return acc
      }, {})
    : {}
  return {
    select,
    component: PreviewWrapper(object, customPreview)
  }
}
