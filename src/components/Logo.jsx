import logoImage from '../../assets/logo.jpg'

const Logo = ({ className = '', showText = true, size = 'default', variant = 'default' }) => {
  // Size variants
  const sizes = {
    small: { icon: 'w-8 h-8', text: 'text-sm', gap: 'space-x-2' },
    default: { icon: 'w-10 h-10', text: 'text-base', gap: 'space-x-2' },
    large: { icon: 'w-16 h-16', text: 'text-xl', gap: 'space-x-3' },
  }

  const sizeConfig = sizes[size] || sizes.default

  // Color variants for text: default (dark blue), white (for dark backgrounds)
  const colors = {
    default: {
      text: 'text-blue-900',
    },
    white: {
      text: 'text-white',
    },
    dark: {
      text: 'text-blue-900',
    },
  }

  const colorConfig = colors[variant] || colors.default

  return (
    <div className={`flex items-center ${sizeConfig.gap} ${className}`}>
      {/* Logo Image */}
      <img
        src={logoImage}
        alt="Infyra Innovations Logo"
        className={`${sizeConfig.icon} object-contain flex-shrink-0`}
      />

      {/* Text Content - Optional, since logo image already contains text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${sizeConfig.text} font-bold ${colorConfig.text} leading-tight`}>
            Infyra
          </span>
          <span className={`${size === 'small' ? 'text-[10px]' : size === 'large' ? 'text-xs' : 'text-[10px]'} font-semibold ${colorConfig.text} tracking-wider uppercase`}>
            INNOVATIONS
          </span>
        </div>
      )}
    </div>
  )
}

export default Logo

