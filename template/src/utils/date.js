import moment from 'moment'
import 'moment/locale/pt-br'

moment.locale('pt-br')

export const formatDate = date => moment(date).format('l')
