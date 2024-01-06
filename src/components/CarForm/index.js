import React, {useEffect, useState} from 'react';
import {Box, Button, Container, TextField} from '@mui/material';
import {v1} from "uuid";
import {useParams} from "react-router-dom";

const CarForm = ({createData,carsData, handleOpen, handleClose, editData}) => {
  const [carCompany, setCarCompany] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [carMileage, setCarMileage] = useState('');
  let {carId} = useParams();

  const clearForm = () => {
    setCarCompany('')
    setCarModel('')
    setCarYear('')
    setCarMileage('')
  }

  const editOne = (id) => {
    const findedOne = carsData.find(car => car.id === id)
    if (findedOne) {
      setCarCompany(findedOne.carCompany)
      setCarModel(findedOne.carModel)
      setCarYear(findedOne.carYear)
      setCarMileage(findedOne.carMileage)
    } else {
      console.log('Car is undefined')
    }
  }


  const handleSubmit = async (event) => {
    event.preventDefault();
    // const res =  await  appAPI.sendGPTPrompt("testset")
    const newOne = {
      id: carId || v1(),
      carCompany,
      carModel,
      carYear,
      carMileage
    }
    if (carId) {
      editData(newOne);
    } else {
      createData(newOne);
    }
    clearForm()
    handleClose()
  };

  useEffect(() => {
    if (carId) {
      handleOpen()
      editOne(carId)
    } else {
      clearForm()
      handleClose()

    }
  }, [carId])

  return (
    <Container maxWidth="sm" style={{
      backgroundColor: "#fff"
    }}>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="car-company"
          label="Car Company"
          name="carCompany"
          autoComplete="car-company"
          autoFocus
          value={carCompany}
          onChange={(e) => setCarCompany(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="car-model"
          label="Car Model"
          name="carModel"
          autoComplete="car-model"
          value={carModel}
          onChange={(e) => setCarModel(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="car-year"
          label="Car Year"
          name="carYear"
          autoComplete="car-year"
          value={carYear}
          onChange={(e) => setCarYear(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="car-mileage"
          label="Car Mileage"
          name="carMileage"
          autoComplete="car-mileage"
          value={carMileage}
          onChange={(e) => setCarMileage(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{mt: 3, mb: 2}}
        >
          {carId ? "Edit" : "Submit"}
        </Button>
      </Box>
    </Container>
  );
}

export default CarForm;
