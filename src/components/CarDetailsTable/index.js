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
  TableRow,
  TextField
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate, useParams} from "react-router-dom";
import {appAPI} from "../../api/app-api";
import useLocalStorage from "../../hooks/useLocalStorage";


function formatterFunction(text) {
  // Remove backticks and replace NULL with null
  const formattedText = text.replace(/`/g, '').replace(/NULL/g, 'null').replace(/^json\n/, '').trim();

  console.log(formattedText)
  try {
    // Parse the formatted text into a JSON object
    const jsonObj = JSON.parse(formattedText);
    return jsonObj;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}

const createPrompt = (model, year, company) => {
  const baseText = `
 Imagine you are an intelligent car maintenance manager. Your goal is to assist me in managing the maintenance schedule for my car. I will provide you with the necessary information, and you will recommend the ideal duration between maintenance tasks in JSON format listed below. With the specific car and model listed below, please tailor your response accordingly to ensure accuracy. If the specified car doesn't exist, please use NULL values in all fields. If the car exists, do not use null values. Please provide the recommended time between maintenance tasks as a single integer value. Also, only include the JSON text in your response.
 
 

Car: ${year} ${company}  ${model}  

output in this format:
{
  "tireRotation": {
    "interval": "(how often tire rotation should be done ) in number type",
    "price": "(how much tire rotation maintenance will cost)in number type"
  },
  "brakeInspection": {
    "interval": "(how often brake inspection should be done)in number type",
    "price": "(how much brake inspection will cost)in number type"
  },
  "oilChange": {
    "interval": "(how often oil changes should be done) in number type",
    "price": "(how much oil change maintenance will cost) in number type"
  },
  "fluidChecks": {
    "interval": "(how often fluid checks should be done) in number type",
    "price": "(how much fluid checks maintenance will cost) in number type"
  },
  "airFilterReplacement": {
    "interval": "(how often air filters should be replaced) in number type",
    "price": "(how much air filter replacement will cost) in number type"
  },
  "batteryReplacement": {
    "interval": "(how often battery should be replaced) in number type",
    "price": "(how much battery replacement will cost) in number type"
  },
  "suspensionInspection": {
    "interval": "(how often suspension inspection should be done) in number type",
    "price": "(how much suspension inspection will cost) in number type"
  },
  "alignmentCheck": {
    "interval": "(how often alignment checks should be done) in number type",
    "price": "(how much alignment check maintenance will cost) in number type"
  },
  "exhaustSystemInspection": {
    "interval": "(how often exhaust system inspection should be done) in number type",
    "price": "(how much exhaust system inspection will cost) in number type"
  },
  "timingSystem": {
    "interval": "(how often timing belt/chain inspection should be done) in number type",
    "price": "(how often timing system should be serviced) in number type"
  },
  "sparkPlugReplacement": {
    "interval": "(how often spark plug should be replaced) in number type",
    "price": "(how much spark plug replacement will cost) in number type"
  },
  "coolingSystem": {
    "interval": "(how often cooling system should be inspected) in number type",
    "price": "(how much cooling system service will cost) in number type"
  }
}

 `
  return baseText
}


const CarDetailsTable = () => {
const [loader, setLoader] = useState(false)
  let {id: carId} = useParams();

  const navigate = useNavigate();

  function createData(name, inteval, lastChange, nextChange, overDueOrNot, averagePrice) {
    return {name, inteval, lastChange, nextChange, overDueOrNot, averagePrice};
  }


  const [rows, setRows] = useState([
    createData('Oil Change', 0, 0, 0, 0, 0),
    createData('Air Filter', 0, 0, 0, 0, 0),
    createData('Tires', 0, 0, 0, 0, 0),
    createData('Brakes', 0, 0, 0, 0, 0),
    createData('Battery', 0, 0, 0, 0, 0),
    createData('Timing System', 0, 0, 0, 0, 0),
    createData('Sparkplugs', 0, 0, 0, 0, 0),
  ]);


  const handleValues = (name, lastChange) => {
    console.log(lastChange)
    const newData = rows.map(r => {
      const newObj = r.name === name ? {...r, lastChange: Number(lastChange) } : r
      return newObj
    })
    setRows(newData)
  }


  const [carsData] = useLocalStorage('carsData');
  const [open, setOpen] = useState(false);


  const update = async () => {

    const car = carsData.find(car => car.id === carId)
    if (car) {
      const prompt = createPrompt(car.carModel, car.carYear, car.carCompany)
      const resp = await appAPI.sendGPTPrompt(prompt)
      const content = resp.choices[0].message.content
      const formatedJson = formatterFunction(content)


      setRows(
        [
          createData('Oil Change', formatedJson.oilChange.interval, rows[0].lastChange, formatedJson.oilChange.interval + rows[0].lastChange, 0, formatedJson.oilChange.price + '$'),

          createData('Air Filter', formatedJson.airFilterReplacement.interval, rows[1].lastChange, formatedJson.airFilterReplacement.interval + rows[1].lastChange, 0, formatedJson.airFilterReplacement.price + '$'),

          createData('Tires', formatedJson.tireRotation.interval, rows[2].lastChange, formatedJson.tireRotation.interval + rows[2].lastChange, 0, formatedJson.tireRotation.price + '$'),
          createData('Brakes', formatedJson.brakeInspection.interval, rows[3].lastChange, formatedJson.brakeInspection.interval + rows[3].lastChange, 0, formatedJson.brakeInspection.price + '$'),

          createData('Battery', formatedJson.batteryReplacement.interval, rows[4].lastChange, formatedJson.batteryReplacement.interval + rows[4].lastChange, 0, formatedJson.batteryReplacement.price + '$'),
          createData('Timing System', formatedJson.timingSystem.interval, rows[5].lastChange, formatedJson.timingSystem.interval + rows[5].lastChange, 0, formatedJson.timingSystem.price + '$'),
          createData('Sparkplugs', formatedJson.sparkPlugReplacement.interval, rows[6].lastChange, formatedJson.sparkPlugReplacement.interval + rows[6].lastChange, 0, formatedJson.sparkPlugReplacement.price + '$'),
        ]
      )

    }


  };
  const handleClose = () => setOpen(false);
  return <>
    <div
      style={{display: "flex", justifyContent: "space-between", marginTop: '10px'}}
    >
      <IconButton onClick={() => {
        navigate('/')
      }}>
        <ArrowBackIcon fontSize="large"/>
      </IconButton>
      <Button onClick={update} style={{width: 200, height: 36.5, marginRight: '10px'}}
              variant="contained">Update</Button>

    </div>

    <div>

      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="right">OEM Interval (Miles)</TableCell>
              <TableCell align="right">Last Change </TableCell>
              <TableCell align="right">Next Change (milage or years)</TableCell>
              <TableCell align="right">Over due or not</TableCell>
              <TableCell align="right">Average Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.inteval}</TableCell>
                <TableCell align="right">
                  <TextField
                    onChange={(event) => {
                      handleValues(row.name, event.target.value)
                    }}
                    id="outlined-basic" variant="outlined"
                    defaultValue={row.lastChange}/>
                </TableCell>
                <TableCell align="right">{row.nextChange}</TableCell>
                <TableCell align="right">{row.overDueOrNot}</TableCell>
                <TableCell align="right">{row.averagePrice}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <div>

      </div>

      <Modal

        keepMounted
        open={open}
        onClose={handleClose}
      >
        <div></div>
      </Modal>
    </div>
  </>
}


export default CarDetailsTable