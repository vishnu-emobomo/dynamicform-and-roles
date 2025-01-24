import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

// Custom styles using makeStyles
const useStyles = makeStyles((theme) => ({
  content_box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    textAlign: 'center',
    color: '#fff',
    margin: '0 auto', // Center the container
    width:"1200px",
    paddingTop: '150px', // Add padding at the top inside the container
  },
  overlay1: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
  },
  title1: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  subtitle1: {
    marginBottom: theme.spacing(4),
  },
}));

const WelcomePage = () => {
  const classes = useStyles();

  return (
    <Container className={classes.content_box} >
      <Box className={classes.overlay1}>
        <Typography variant="h3" className={classes.title1}>
          Welcome To Page APPS HIVE
        </Typography>
        <Typography variant="h5" className={classes.subtitle1}>
            By emobomo soft pvt ltd
        </Typography>


        {/* <Button variant="contained" color="primary" size="large">
         
        </Button> */}
      </Box>
    </Container>
  );
};

export default WelcomePage;
