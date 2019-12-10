import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'

import documents from './documents'
import objects from './objects'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    ...documents,
    ...objects
  ])
})
