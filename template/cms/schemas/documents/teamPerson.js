import { FiUser as icon } from 'react-icons/fi'

import validation from '../../utils/validation'

export default {
  name: 'teamPerson',
  title: 'Pessoa da equipe',
  icon,
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nome',
      description: '💡 Nome e sobrenome, preferencialmente',
      type: 'string',
      validation: validation.text({})
    },
    {
      name: 'role',
      title: 'Papel / cargo dentro da %SITE_NAME%',
      type: 'string',
      description: '❓ Campo opcional'
    },
    {
      name: 'image',
      title: 'Foto da pessoa',
      type: 'image',
      description: '❓ Campo opcional'
    }
  ]
}
