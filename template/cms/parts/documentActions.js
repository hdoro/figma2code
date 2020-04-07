import { useState, useEffect } from 'react'
import { useDocumentOperation } from '@sanity/react-hooks'
import defaultResolve, {
  DeleteAction,
  DuplicateAction,
  UnpublishAction
} from 'part:@sanity/base/document-actions'
import { FiUploadCloud } from 'react-icons/fi'
import { SINGLETON_TEMPLATES } from './newDocumentStructure'

function PublishAndBuildAction(props) {
  const { publish } = useDocumentOperation(props.id, props.type)
  const [isPublishing, setIsPublishing] = useState(false)

  function buildSite() {
    // @TODO: replace build hook
    fetch('https://api.netlify.com/build_hooks/5ed23c029asa7d7ec1f9f882', {
      method: 'POST',
      mode: 'no-cors'
    })
      .then(res => {
        props.onComplete()
      })
      .catch(error => {
        console.error(error)
      })
    setIsPublishing(false)
  }

  useEffect(() => {
    // if the isPublishing state was set to true and the draft has changed
    // to become `null` the document has been published
    if (isPublishing && !props.draft) {
      buildSite()
    }
  }, [props.draft])

  return {
    disabled: publish.disabled,
    label: isPublishing ? 'Publishing...' : 'Publish & build site',
    icon: FiUploadCloud,
    onHandle: () => {
      // This will update the button text
      setIsPublishing(true)

      // Perform the publish
      publish.execute()
    }
  }
}

export default function resolveDocumentActions(props) {
  const allActions = [...defaultResolve(props), PublishAndBuildAction]
  if (SINGLETON_TEMPLATES.indexOf(props.type) >= 0) {
    // Prevent unpublishing, deleting or duplicating singletons
    // Reasoning: there can be only one of these pages
    return allActions.filter(action => {
      return (
        [UnpublishAction, DeleteAction, DuplicateAction].indexOf(action) < 0
      )
    })
  }
  return allActions
}
