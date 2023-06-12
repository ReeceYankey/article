import { AppBar, Box, Toolbar, Typography } from "@mui/material";

export function NavBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{flexGrow:1}}>
          <Typography variant='h6' component='a' href="/" 
            sx={{
              mr:2,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Home
          </Typography>
        </Box>
        <Box sx={{flexGrow:0}}>
          <Typography variant='h6' component='a' href="/login" 
            sx={{
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Log in
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}