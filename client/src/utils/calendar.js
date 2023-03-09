    const [sucursal, setSucursal] = useState({}) 
    
    // lo anterior viene del menu inicial y pasa por prop el objeto suc elegida

    const [startDate, setStartDate] = useState({});

    const hhStart = sucursal.startTime.slice(0,2)
    const mmStart = sucursal.startTime.slice(3)
    const hhEnd = sucursal.endTime.slice(0,2)
    const mmEnd = sucursal.endTime.slice(3)

    // pedido GET al backend con una fecha y una sucursal
    const backArr = [{'09:00': 5}, {'09:15': 4}, {'09:30': 5}, {'09:45': 1}, {'10:00': 5}, {'10:15': 3}, {'10:30': 5}, {'10:45': 0}, {'11:00': 1}, {'11:15': 5}, {'11:30': 5}, {'11:45': 5}, {'12:00': 0}, {'12:15': 5}, {'12:30': 0}, {'12:45': 1}, {'13:00': 5}, {'13:15': 5}, {'13:30': 2}, {'13:45': 5}, {'14:00': 5}, {'14:15': 5}, {'14:30': 5}, {'14:45': 5}, {'15:00': 5}, {'15:15': 0}, {'15:30': 5}, {'15:45': 5}, {'16:00': 5}, {'16:15': 5}, {'16:30': 5}, {'16:45': 5}, {'17:00': 5}, {'17:15': 5}, {'17:30': 5}, {'17:45': 5}, {'18:00': 5}, {'18:15': 5}, {'18:30': 5}, {'18:45': 5}, {'19:00': 5}, {'19:15': 5}, {'19:30': 5}]
    // el back devuelve arreglo de objetos "backArr" formato {'hhmm': num(stock disponible) }

    


    //const [timesExcluded, setTimesExcluded] = useState([])

    const noStockTimes = []
    const fewStockTimes = []
    const manyStockTimes = []
    
    backArr.forEach(e => !Object.values(e)[0]
                         ? noStockTimes.push(Object.keys(e)[0])
                         : Object.values(e)[0] < 3
                         ? fewStockTimes.push(Object.keys(e)[0])
                         : manyStockTimes.push(Object.keys(e)[0])
                    )
    
    setTimesExcluded(
        noStockTimes.map(
        e => setHours(setMinutes(new Date(), e.slice(3)), e.slice(0,2))
        )
    )
    
    let handleColor = (time) => {
        /* const str = '1245'
        let stock = 0
        backArr.forEach(e => stock += e[str] || 0 ) */
      const strTime = time.toTimeString().slice(0, 5)  
      return manyStockTimes.includes(strTime) ? "text-success" : "text-error";
    };
    const disabledDates = [
    new Date(2022, 6, 6),
  ];
    
    const isWeekday = (date) => {
      const day = getDay(date);
      return !sucursal.daysOff.includes(day)
    }

    return (
      <DatePicker
        inline
        minDate={new Date()}
        maxDate={addDays(new Date(), 21)}
        timeIntervals={15}
        selected={startDate}
        onChange={(date) => {
          setStartDate(date)
          console.log(date)
          }}
        showTimeSelect
        timeCaption="horarios"
        minTime={setHours(setMinutes(new Date(), mmStart), hhStart)}
        maxTime={setHours(setMinutes(new Date(), mmEnd), hhEnd)}
        dateFormat="MMMM d, yyyy h:mm aa"
        timeClassName={handleColor}
        filterDate={isWeekday}
        excludeTimes={timesExcluded}
        excludeDates={disabledDates}
      />
    );
