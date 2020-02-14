## Rules

- Must be inside of a frame, else will be ignored
- All styles must be in the same file
  - Maybe this isn't needed!
- Figma's API lists children on a reverse order (frames listed last come first in the array)
- Denominations:
  - `{tagName}`
  - `(propName)`
  - `[cmsType.subType]`
- `icons` page is huge and crashes the process, remove it before converting the design

## How this code works

1. Get environment variables and inject them into the process's metadata

- We need `env.FIGMA_TOKEN` and `env.FIGMA_FILE_KEY`
- Extra props include:
  - `canvases`: a list (comma separated) of canvases to include in the conversion
  - `useCache`: use `false` if you always need fresh data
  - `cacheData`: whether to save a cache file for inspection and speed or not. Defaults to `true`
  - `siteName`: the name of the site / project to be injected in the template
  - `siteUrl`
  - `brandPrimary`: a css color for the primary color of the brand. Used to customize VS Code & the CMS
  - `sanityID`: the Sanity project's ID
- @TODO: create a CLI to avoid having to depend on .env

1. Start from a `template` folder with all the base project structure and regular files
1. Fetch a whole file's data from Figma's API

- endpoint is `https://api.figma.com/v1/files/{FILE_KEY}`
- cache it under `data/cachedFigmaFile.json` if `cacheData = true`

1. Process the data to populate the `styles` and `components` objects with the corresponding data to each item
1. Create style variables
1. Create components
1. Create the CMS schema
1. Inject project variables in the final template

## TODO

- Migrate to Typescript
  - code has become a mess
- We could use Figma's `Component/Variation` naming convention to implement boolean tags in the CMS schema, if this becomes a common pattern
