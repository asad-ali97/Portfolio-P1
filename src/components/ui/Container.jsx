import PropTypes from 'prop-types'

/**
 * Consistent horizontal max-width + gutter for every section on every
 * page. Prevents each page from reinventing its own container width.
 *
 * @param {{ children: import('react').ReactNode, className?: string, as?: keyof JSX.IntrinsicElements }} props
 */
function Container({ children, className = '', as: Tag = 'div' }) {
  return (
    <Tag className={`mx-auto w-full max-w-[1200px] px-6 md:px-8 ${className}`}>
      {children}
    </Tag>
  )
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  as: PropTypes.elementType,
}

export default Container
