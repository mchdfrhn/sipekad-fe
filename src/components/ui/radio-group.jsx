import * as React from "react";
import { cn } from "../../lib/utils";
// Simple circle indicator, no icon library needed for this tiny dot
const CircleIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <circle cx="12" cy="12" r="12" />
  </svg>
);

const RadioGroupContext = React.createContext({});

const RadioGroup = React.forwardRef(
  (
    { className, value, defaultValue, onValueChange, children, ...props },
    ref,
  ) => {
    const [val, setVal] = React.useState(value || defaultValue);

    React.useEffect(() => {
      if (value !== undefined) {
        setVal(value);
      }
    }, [value]);

    const handleValueChange = (newValue) => {
      if (value === undefined) {
        setVal(newValue);
      }
      onValueChange?.(newValue);
    };

    return (
      <RadioGroupContext.Provider
        value={{ value: val, onValueChange: handleValueChange }}
      >
        <div className={cn("grid gap-2", className)} ref={ref} {...props}>
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  },
);
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef(
  ({ className, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange } =
      React.useContext(RadioGroupContext);
    const isSelected = selectedValue === value;

    return (
      <button
        type="button"
        role="radio"
        aria-checked={isSelected}
        data-state={isSelected ? "checked" : "unchecked"}
        value={value}
        className={cn(
          "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        onClick={() => onValueChange(value)}
        ref={ref}
        {...props}
      >
        <span
          className={cn(
            "flex items-center justify-center pointer-events-none",
            isSelected ? "opacity-100" : "opacity-0",
          )}
        >
          <CircleIcon className="h-2.5 w-2.5 fill-current text-current" />
        </span>
      </button>
    );
  },
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
