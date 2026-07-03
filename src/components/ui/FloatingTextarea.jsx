import { useState, useId } from 'react';
import { motion as Motion } from 'motion/react';

export const FloatingTextarea = ({
  label,
  value = '',
  onChange,
  required,
  disabled,
  rows = 4,
  maxLength,
  className = '',
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const id = useId();
  const active = focused || String(value).length > 0;

  return (
    <div className={`relative ${className}`}>
      <Motion.label
        htmlFor={id}
        animate={{
          y: active ? -8 : 0,
          scale: active ? 0.78 : 1,
          color: focused ? '#4318FF' : '#718096',
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        style={{ originX: 0, originY: 0.5 }}
        className="absolute left-4 top-4 text-sm font-semibold pointer-events-none z-10 px-0.5"
      >
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </Motion.label>

      <textarea
        id={id}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`w-full pt-7 px-4 pb-3 bg-[#F4F7FE] border-2 rounded-2xl outline-none text-sm font-medium text-[#2B3674] resize-none transition-all duration-200 ${
          focused
            ? 'border-[#4318FF] bg-white shadow-[0_0_0_3px_rgba(67,24,255,0.08)]'
            : 'border-transparent'
        } disabled:opacity-50`}
        {...rest}
      />

      {maxLength && (
        <span className={`absolute bottom-3 right-4 text-[10px] font-bold ${
          String(value).length >= maxLength * 0.9 ? 'text-red-400' : 'text-gray-400'
        }`}>
          {String(value).length}/{maxLength}
        </span>
      )}
    </div>
  );
};

export default FloatingTextarea;
