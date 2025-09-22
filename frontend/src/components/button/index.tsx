interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "submit" | "secondary" | "close" | "danger";
  className?: string;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  submit: "bg-primary hover:bg-primary-hover text-white ",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
  close: "bg-secondary hover:bg-secondary-hover text-white",
  danger: "bg-red-500 hover:bg-red-600 text-white",
};

const ButtonComponent = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "submit",
  className = "",
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClasses[variant]}
        px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default ButtonComponent;
