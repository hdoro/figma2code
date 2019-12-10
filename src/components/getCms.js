const VALIDATION_DEFAULT = 'defaultValidation()';
const VALIDATION_ARRAY = 'arrayValidation({ min: 1 })';

const COMMON_FIELDS = {
  title: { title: "Título" },
  images: { title: "Imagens / fotos" },
  image: { title: "Imagem / foto" },
  body: {
    title: "Corpo de texto",
    description:
      "Use **dois asteriscos** para negrito e *um asterisco* para itálico."
  },
  cta: {
    title: 'Chamada para ação'
  }
};

function getField(c) {
  // If we don't have a (propName), a [cmsType] or an arr of children, forget this field
  if (!c._propName && !c.children && !c._cmsType) {
    return;
  }

  // If we have children but no propName, that means we can skip
  // ahead to the children if this isn't a component
  if (c.children && !c._propName && !c._componentName) {
    return c.children.map(getField);
  }

  // [cmsType] can specify child types in case of arrays or
  // references (ex: [array.image])
  const parsedType = c._cmsType && c._cmsType.split(".");
  // If no propName is provided, let's assume the name is the
  // cmsType
  const name = c._propName || parsedType[0];
  if (!name) {
    return;
  }
  const type = parsedType ? parsedType[0] : name;

  const commonField = COMMON_FIELDS[name];
  const field = {
    name,
    title: (commonField && commonField.title) || name,
    description: commonField && commonField.description,
    type
  };

  if (c._isRequired) {
    field.validation = VALIDATION_DEFAULT;
  } else {
    field.description = "❓ Campo opcional." + (field.description && ' ' + field.description || "");
  }

  // If we have a subType, check if type is array or ref
  if (parsedType && parsedType.length > 1) {
    if (type === "array") {
      field.of = [{ type: parsedType[1] }];
      if (c._isRequired) {
        field.validation = VALIDATION_ARRAY;
      }
    }
    if (type === "reference") {
      field.to = [{ type: parsedType[1] }];
    }
  }

  return field;
}

const prepareFields = c => {
  const fields = c.children.map(getField);
  const str = JSON.stringify(fields);
  // @TODO: remove commas from the validation rule
  // const regex = new RegExp(VALIDATION_DEFAULT, 'gim')
  // console.log(regex.exec(str), str.match(`'${VALIDATION_DEFAULT}`))
  return str;
};

function getCms(c) {
  return `
    import { defaultValidation, arrayValidation } from '../reusable/validation'
    
    export default {
      name: '${c.nameCamel}',
      title: '${c.nameCap}',
      type: 'object',
      fields: ${prepareFields(c)}
    }
  `;
}

module.exports = getCms;
