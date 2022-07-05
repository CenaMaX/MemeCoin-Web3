import TextField from '@mui/material/TextField';

const Input = ({ color, name, label, value, onChange, props }) => {
  return (
    <TextField
      color={color}
      name={name}
      label={label}
      value={value}
      variant='filled'
      size='small'
      onChange={onChange}
      {...props}
    />
  );
};

Input.defaultProps = {
    color: 'secondary',
}

export default Input;
