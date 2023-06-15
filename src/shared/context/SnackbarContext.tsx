import { createContext, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

export const SnackbarContext = createContext({});

export const SnackbarProvider = (props: any) => {
  const { children } = props;
  const [open, setOpen] = useState(false);
  const [snackbarOptions, setSnackbarOptions] = useState({
    message: '',
    severity: undefined,
  });

  const setSnackbar = (options: any) => {
    setSnackbarOptions(options);
    setOpen(true);
  };

  const resetSnackbar = () => {
    setSnackbarOptions({
      message: '',
      severity: undefined,
    });
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ setSnackbar }}>
      <>
        {children}
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={open}
          autoHideDuration={3000}
          onClose={resetSnackbar}
        >
          <Alert severity={snackbarOptions.severity} onClose={resetSnackbar}>
            {snackbarOptions.message}
          </Alert>
        </Snackbar>
      </>
    </SnackbarContext.Provider>
  );
};
