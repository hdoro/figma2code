<script>
  import { onDestroy } from 'svelte'
  import { fade, scale, slide } from 'svelte/transition'
  import { backInOut } from 'svelte/easing'

  export let isOpen = false
  export let close
  export let label
  export let className

  let dialog
  let focusableEls
  let previouslyFocused
  $: lastFocusableEl = focusableEls && focusableEls[focusableEls.length - 1]

  function handleBackwardTab(e) {
    // If already the first focusable element, go to the last one to prevent
    // escaping the modal context
    if (document.activeElement === focusableEls[0]) {
      e.preventDefault()
      focusableEls[focusableEls.length - 1].focus()
    }
  }

  function handleForwardTab(e) {
    if (document.activeElement === focusableEls[focusableEls.length - 1]) {
      e.preventDefault()
      focusableEls[0].focus()
    }
  }

  const dealWithKeyboard = e => {
    const KEY_TAB = 9
    const KEY_ESC = 27

    switch (e.keyCode) {
      case KEY_TAB:
        if (focusableEls.length === 1) {
          e.preventDefault()
          break
        }

        if (e.shiftKey) {
          handleBackwardTab(e)
        } else {
          handleForwardTab(e)
        }

        break
      case KEY_ESC:
        close()
        break
      default:
        break
    }
  }

  const setFocus = () => {
    // Memorize the last focused element
    previouslyFocused = document.activeElement

    // Get any focusable element inside the modal
    focusableEls = dialog.querySelectorAll(
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
    )

    // Focus the first one
    focusableEls[0].focus()

    // Prevent body scrolling
    document.documentElement.style.overflow = 'hidden'

    // And set the keyboard trap
    dialog.addEventListener('keydown', dealWithKeyboard)
  }

  const returnFocus = () => {
    document.documentElement.style.overflow = 'auto'
    dialog.removeEventListener('keydown', dealWithKeyboard)
    if (previouslyFocused) {
      previouslyFocused.focus()
    }
  }

  $: if (isOpen && dialog) {
    setFocus()
  }

  $: if (!isOpen) {
    returnFocus()
  }

  onDestroy(returnFocus)
</script>

<style lang="postcss" src="./modal.scss" global>

</style>

{#if isOpen}
  <dialog
    class="modal {className || ''}"
    bind:this={dialog}
    open
    transition:scale={{ duration: 300, easing: backInOut }}
    aria-label={label}>
    <slot />
    <button class="modal__button" on:click={close} title="Botão para fechar">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 58 58">
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-width="3"
          d="M2 2l54 54M56 2L2 56" />
      </svg>
    </button>
  </dialog>
  <div class="modal__overlay" transition:fade on:click={close} />
{/if}
