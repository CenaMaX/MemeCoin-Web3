import MuiButton from '@mui/material/Button';

const Button = ({ color, variant, size, onClick, children, ...props }) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      onClick={onClick}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

Button.defaultProps = {
    color: 'secondary',
    variant: 'contained',
    size: 'medium',
}

export default Button;
