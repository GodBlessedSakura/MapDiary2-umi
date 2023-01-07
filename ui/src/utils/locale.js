import { formatMessage, FormattedMessage } from 'umi'

export const Md2FormatMessage = (...args) => {
  if (typeof args[0] === 'string') {
    const [id, defaultMessage, values] = args
    return formatMessage({ id, defaultMessage }, values)
  }

  // 作为 React 组件调用：<Md2FormatMessage id="xxx" />
  const { id, defaultMessage, values } = args[0]
  return <FormattedMessage id={id} defaultMessage={defaultMessage} values={values} />
}
