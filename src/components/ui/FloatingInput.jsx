import { useState, useId } from 'react';
import { motion as Motion } from 'motion/react';

/**
 * FloatingInput — input with animated floating label
 * Props: label, icon (lucide component), type, value, onChange, required, disabled, placeholder, className
 */
export const FloatingInput = ({
  label,
  icon: Icon,
  type = 'text',
  value = '',
  onChange,
  required,
  disabled,
  className = '',
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const id = useId();
  const active = focused || String(value).length > 0;

  return (
    <div className={`relative ${className}`}>
      {/* Floating label */}
      <Motion.label
        htmlFor={id}
        animate={{
          y: active ? -10 : 0,
          scale: active ? 0.78 : 1,
          color: focused ? '#4318FF' : active ? '#718096' : '#718096',
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        style={{ originX: 0, originY: 0.5 }}
        className="absolute left-11 top-1/2 -translate-y-1/2 text-sm font-semibold pointer-events-none z-10 bg-transparent px-0.5"
      >
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </Motion.label>

      {/* Icon */}
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
          <Icon
            className={`h-4 w-4 transition-colors duration-200 ${
              focused ? 'text-[#4318FF]' : 'text-gray-400'
            }`}
          />
        </div>
      )}

      {/* Input */}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        disabled={disabled}
        className={`w-full h-14 pl-11 pr-4 pt-4 bg-[#F4F7FE] border-2 rounded-2xl outline-none text-sm font-medium text-[#2B3674] transition-all duration-200 ${
          focused
            ? 'border-[#4318FF] bg-white shadow-[0_0_0_3px_rgba(67,24,255,0.08)]'
            : 'border-transparent'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        {...rest}
      />
    </div>
  );
};

export default FloatingInput;
