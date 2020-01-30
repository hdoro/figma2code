## Goal

- create CMS objects and documents ✅
- create `objects/index.js` and `documents/index.js` ✅
- create the `pageBody.js` object, if applicable
- provide validation in objects ✅
- Description in case optional ✅
- generate `.data/sanity.json` with dummy text as placeholder for data
  - For documents, create several test entries
- generate a valid schema for pages

## Caveats:

- There are UI components that don't form standalone objects in the CMS
- Some UI components could form documents instead of objects.
  - Ex: a `Person` avatar could be used to create the `person` docType
- There are CMS objects that don't form UI components.
  - these are all default and already included in the template, but we can't forget to include them in the index files
- Inside objects/docs, when we find a reference to a non-basic type (markdown, navLink, person), simply add a field with that specific type and stop going further down its children tree
- We'll ignore children that include any of the following types:
  - `span` -> only makes sense in the context of a block
  - `block` -> might include it in the future, but for now we don't have a use case for it
  - `document` -> you can't include a field with this type in any Sanity object/document
  - `geopoint` and `file` -> not useful for us
  - `object` -> having them inline is a pain due to Sanity's limitations and extracting them into their own objects is complicated and makes the code hard to read. Hence, if you want a new object, create a component out of it.
- If no type found, ignore the child/component
- If `[object]`, we'll create a new object in the schema with `{parentComponentName} + (propName)` as its ID
  - if `(propName)` missing, ignore it
- if unkown `type`, simply set `type: ${type}`

## Notations

- CMS type notation is wrapped around brackets (`[type]`), if missing the child/component will be ignored
- Components and children that create objects must include `[object]`
- Components that create documents must include `[document]`
- If referencing a type of document, use `[ref.DOC_TYPE]`
- `[array.subType]` and `[ref.subType]` (or `reference.subType`) both have their own special field values, which are parsed accordingly
- Get the object/document's title from its Figma description
- For fields' labels (`title` property), `Field Label[cmsType]`
- Types of validation function:
  - `array`
    - unique
    - min
    - max
    - length
  - `url`
    - allowRelative
    - relativeOnly
  - `text`
    - min
    - max
  - `default`
  - In addition, all of them include:
    - required (defaults to `true`)

<!-- 
// In case I need this in the future:
const BASIC_CMS_TYPES = [
  boolean,
  date,
  datetime,
  number,
  slug,
  string,
  text,
  url
]
-->