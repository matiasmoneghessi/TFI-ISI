import React,  { useState, useEffect } from "react";
import DatePicker from "react-datepicker"
import { registerLocale } from  "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import es from 'date-fns/locale/es';
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import addDays from  "date-fns/addDays"
import getDay from "date-fns/getDay"
import "react-datepicker/dist/react-datepicker.css"
import style from "../styles/Users.module.css";
import axios from "axios";
import { appointmentPicker } from "../features/appointment";
import { getFullDate } from "../utils/getFullDate";
//import parseJwt from "../hooks/parseJwt";

const Calendar = () => {

  const dispatch = useDispatch()
  //const user = parseJwt(JSON.parse(localStorage.getItem('user')).data.token)
  const pickedDate = useSelector(state => state.appointment)
  const pickedBranchOffice = useSelector(state => state.branchOffice.clickedOffice)
  //hardcodeado, la idea seria que tome el valor del pickedBranchOffice.startTime.slice(0,2)
  const [selectedDate, setSelectedDate] = useState(setHours(setMinutes(new Date(), 0), 10));
  //const [selectedDate, setSelectedDate] = useState(new Date());

  //const [appointments, setAppointments] = useState([]);
  const [hhStart, setHhStart] = useState("");
  const [mmStart, setMmStart] = useState("");
  const [hhEnd, setHhEnd] = useState("");
  const [mmEnd, setMmEnd] = useState("");

  const [noStockTimes, setNoStockTimes] = useState([])
  const [fewStockTimes, setFewStockTimes] = useState([])
  const [manyStockTimes, setManyStockTimes] = useState([])
  console.log('MANY ESSSSS ', manyStockTimes)

  // pedido GET al backend con una fecha y una sucursal
  const loadAppointments = () => {
    axios.get('http://localhost:3001/api/availableAppointment', {
      headers: {
        date: selectedDate.getDate().toString(),
        month: selectedDate.getMonth().toString(),
        year: selectedDate.getFullYear().toString(),
        id: pickedBranchOffice._id
      }
    })
    .then(arrAppointments => {
      console.log('ARREGLO DE HORARIOS ES ', arrAppointments.data.data)
      const arrMany = []
      const arrFew = []
      const arrNo = []
      arrAppointments.data.data.forEach(e => !Object.values(e)[0]
                        ? arrNo.push(Object.keys(e)[0])
                        : Object.values(e)[0] < 3
                        ? arrFew.push(Object.keys(e)[0])
                        : arrMany.push(Object.keys(e)[0])
                        );
      setManyStockTimes(arrMany)
      setFewStockTimes(arrFew)
      setNoStockTimes(arrNo)
    })
    .catch(err => console.log('ERROR TRAYENDO ARREGLO DE HORARIOS ES ', err)) 
  };      
    
  let timesExcluded

  const getExcludedTimes = () => {
    const dayTimes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
    dayTimes.forEach(e => {
      if(Number(e) < Number(pickedBranchOffice.startTime.slice(0,2)) ||
         Number(e) >= Number(pickedBranchOffice.endTime.slice(0,2)))
         noStockTimes.push(e.concat(':00'), e.concat(':15'), e.concat(':30'), e.concat(':45'))
    })
    timesExcluded = noStockTimes.map(
      e => setHours(setMinutes(selectedDate, e.slice(3)), e.slice(0,2))
      )
    //console.log('HORARIOS EXCLUIDOS SON ', timesExcluded)
  }

  getExcludedTimes()

  const disabledDates = [new Date(2022, 6, 6)];

  const isWeekday = (date) => {
    const day = getDay(date);
    return !pickedBranchOffice.daysOff.includes(day)
  }

  const isOpen = (date) => {
    const time = getDay(date);
    return !pickedBranchOffice.startTime.includes(time)
  }
    
  const handleColor = (time) => {
    const strTime = time.toTimeString().slice(0, 5)  
    return manyStockTimes.includes(strTime) 
      ? "text-success" 
      : fewStockTimes.includes(strTime)
      ? "text-warning"
      : null;
  };

  registerLocale('es', es)

  useEffect(() => {
    const getExcludedTimes = () => {
      const dayTimes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
      dayTimes.forEach(e => {
        if(Number(e) < Number(pickedBranchOffice.startTime.slice(0,2)) || Number(e) >= Number(pickedBranchOffice.endTime.slice(0,2)))
           noStockTimes.push(e.concat(':00'), e.concat(':15'), e.concat(':30'), e.concat(':45'))
      })
      timesExcluded = noStockTimes.map(
        e => setHours(setMinutes(selectedDate, e.slice(3)), e.slice(0,2))
        )
      //console.log('HORARIOS EXCLUIDOS SON ', timesExcluded)
    }
    loadAppointments();
    setHhStart(pickedBranchOffice.startTime.slice(0,2));
    setMmStart(pickedBranchOffice.startTime.slice(3));
    setHhEnd(pickedBranchOffice.endTime.slice(0,2));
    setMmEnd(pickedBranchOffice.endTime.slice(3));
    getExcludedTimes();
  }, [selectedDate, pickedBranchOffice]);

  return (
    <>
    <DatePicker
      inline
      locale='es'
      calendarStartDay={0}
      minDate={new Date()}
      maxDate={addDays(new Date(), 21)}
      timeIntervals={15}
      selected={selectedDate}
      filterTime={isOpen}
      onChange={(date) => {
        date.setMinutes(Math.round(date.getMinutes() / 20) * 15)
        setSelectedDate(date)
        dispatch(appointmentPicker({date}))
        }}
        showTimeSelect
        timeCaption="horarios"
        minTime={setHours(setMinutes(selectedDate, mmStart), hhStart)}
        maxTime={setHours(setMinutes(selectedDate, mmEnd), hhEnd)}
        dateFormat="MMMM d, yyyy h:mm aa"
        timeClassName={handleColor}       
        filterDate={isWeekday}
        excludeTimes={timesExcluded}
        excludeDates={disabledDates}
      />

      {fewStockTimes.length
        ? (<ul className={style.fewStock}>
            <li>
              últimos turnos disponibles
            </li>
          </ul>)
        : (<></>)
      }
       {console.log('DATE ELEGIDO ES', pickedDate)}
       {console.log('EL MIN TIME ES ', hhStart)}
      </>
    );
};

export default Calendar;