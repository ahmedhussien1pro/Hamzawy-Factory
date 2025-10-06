// src/components/ui/Input.jsx
import { TextField } from '@mui/material';

const Input = ({ label, type = 'text', error, helperText, ...props }) => {
  return (
    <TextField
      fullWidth
      label={label}
      type={type}
      error={!!error}
      helperText={helperText}
      variant='outlined'
      {...props}
    />
  );
};

export default Input;
