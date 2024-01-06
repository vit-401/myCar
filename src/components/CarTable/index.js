import {useState} from "react";
import {
  Button,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Fingerprint from "@mui/icons-material/Fingerprint";
import Edit from "@mui/icons-material/Edit";
import CarForm from "../CarForm";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useNavigate} from "react-router-dom";

const CarTable = () => {
  const [carsData, setCarsData] = useLocalStorage('carsData', []);
  const navigate = useNavigate();

  function createData(
    newCar
  ) {
    const newOne = [newCar, ...carsData]
    setCarsData(newOne)
  }

  function removeData(
    id
  ) {
    const newOne = carsData.filter(car=>car.id !== id )

    setCarsData(newOne)
  }

  function editData(
    newCar
  ) {
    const newOne = carsData.map(car=>car.id === newCar.id ? newCar : car)
    setCarsData(newOne)
  }

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    navigate('/')
  }
  return <>
    <div
      style={{marginTop: '10px'}}
    >
      <Button onClick={handleOpen} style={{width: 200, marginLeft: 'calc(100% - 210px)'}}
              variant="contained">Add</Button>

    </div>

    <div>

      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" width={300}>id</TableCell>
              <TableCell align="center">Company</TableCell>
              <TableCell align="center">Model</TableCell>
              <TableCell align="center">Year</TableCell>
              <TableCell align="center">Mileage</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carsData.map((row) => (
              <TableRow
                key={row.id}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                <TableCell align={'left'} component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align={'center'} component="th" scope="row">
                  {row.carCompany}
                </TableCell>
                <TableCell align="center">{row.carModel}</TableCell>
                <TableCell align="center">{row.carYear}</TableCell>
                <TableCell align="center">{row.carMileage}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={()=>{
                      navigate('/'+row.id)
                    }}
                    aria-label="delete" size="small">
                    <Edit fontSize="large"/>
                  </IconButton>
                  <IconButton
                    onClick={()=>{
                      removeData(row.id)
                    }}
                    aria-label="delete" size="small">
                    <DeleteIcon fontSize="large"/>
                  </IconButton>
                  <IconButton
                    onClick={()=>{
                      navigate('/details/'+row.id)
                    }}
                    aria-label="fingerprint" color="success">
                    <Fingerprint fontSize="large"/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
      >
        <CarForm handleOpen={handleOpen} createData={createData} carsData={carsData} editData={editData} handleClose={handleClose}/>
      </Modal>
    </div>
  </>
}


export default CarTable