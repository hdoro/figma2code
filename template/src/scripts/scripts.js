import './header.js'
import { watchImages } from './lazyImageLoading.js'

const allImages = document.getElementsByClassName('lazy-img')

watchImages(allImages)
