const DEFAULT_ERR_MSG = 'Campo obrigatório'
const DEFAULT_WARN_MSG = 'Campo recomendado'

function defaultValidation(
  { errMsg = DEFAULT_ERR_MSG, optional = false, ...rest } = {
    errMsg: DEFAULT_ERR_MSG
  }
) {
  const err = errMsg === DEFAULT_ERR_MSG && optional ? DEFAULT_WARN_MSG : errMsg
  return function(Rule) {
    const base = optional
      ? Rule.optional().warning(err)
      : Rule.required().error(err)
    return base
  }
}
function arrayValidation(
  {
    errMsg = DEFAULT_ERR_MSG,
    min,
    max,
    length,
    optional = false,
    unique = false
  } = { min: 0 }
) {
  const err = errMsg === DEFAULT_ERR_MSG && optional ? DEFAULT_WARN_MSG : errMsg
  return function(Rule) {
    const lengthAppendix = ` com exatamente ${length} entradas`
    const minMaxAppendix = ` com no mínimo ${min} ${
      max ? `e máximo de ${max}` : ''
    } entradas`
    const uniqueAppendix = ` e com entradas únicas`
    const errorAppendix = !!length
      ? lengthAppendix
      : min !== 0 || !!max
      ? minMaxAppendix
      : ''
    let error = err + errorAppendix + (unique ? uniqueAppendix : '')
    let base = optional
      ? Rule.optional().warning(error)
      : Rule.required().error(error)
    if (unique) {
      base = base.unique()
    }

    // And finally return the Rule
    if (!!length) {
      return base.length(length)
    } else if (!!max) {
      return base.min(min).max(max)
    }
    return base.min(min)
  }
}

export default {
  default: defaultValidation,
  text: defaultValidation,
  array: arrayValidation
}
