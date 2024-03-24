import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  useNavigate,
} from 'react-router-dom';
const Login = (props) => {
  const theme = createTheme();
  const navigate = useNavigate();
  const [zID, setzID] = React.useState(null);
  const [pwd, setPwd] = React.useState(null);

  // connected to the backend
  const loginBtn = async () => {
    const response = await fetch('http://localhost:5005/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        zID: zID,
        password: pwd,
      })
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      props.setTokenFn(data.zID);
      localStorage.setItem('zID', zID);
      const type = data.user
      navigate('/Home/'+ type + '/' + zID)
    }
  };
  return (
    // used a login template https://github.com/mui/material-ui/tree/v5.10.12/docs/data/material/getting-started/templates/sign-in
    <>
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="zID"
              label="zID"
              name="zID"
              autoComplete="zID"
              autoFocus
              onChange={(event) => setzID(event.target.value)} value={zID}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(event) => setPwd(event.target.value)} value={pwd}
            />
            <Button
              name="login"
              onClick={loginBtn}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </>
  );
}

Login.propTypes = {
  setTokenFn: PropTypes.func,
};

export default Login;
