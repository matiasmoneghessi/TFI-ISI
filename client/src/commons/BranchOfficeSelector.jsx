import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import axios from 'axios'
import { useEffect, useState } from 'react';
import Calendar from '../views/Calendar';
import style from "../styles/Users.module.css";
import { useSelector, useDispatch } from 'react-redux';
import { branchOfficePicker } from '../features/branchOffice';
import { branchOfficesGetter } from '../features/branchOfficesList';
import parseJwt from "../hooks/parseJwt";

function BranchOfficeSelector() {

  /* const getBranchOffices = async () => {   
    const res = await axios.get('http://localhost:3001/api/branchOffice/showBranch');     
    return res.data.data  
    } */
  
  //const initValueBranchOffices = getBranchOffices()    
  
  const dispatch = useDispatch()

  //dispatch(branchOfficesGetter())
  //const pickedDate = useSelector(state => state.appointment.value)
  const [branchOffices, setBranchOffices] = useState([])
  //const branchOffices = JSON.parse(localStorage.getItem('branches')).branches
  
  const pickedBranchOffice = useSelector(state => state.branchOffice.clickedOffice)
  const user = parseJwt(JSON.parse(localStorage.getItem('user')).data.token)

  const handleSelection = (e) => {
    e.preventDefault();
    const nombreClon = e.target.innerText.toLowerCase()
    const clickedOffice = branchOffices.find
        (branch => branch.nombre === nombreClon)
    dispatch(branchOfficePicker({clickedOffice}));
  }

  const getBranchOffices = async () => {   
    const res = await axios.get('http://localhost:3001/api/branchOffice/showBranch');     
    setBranchOffices(res.data.data)   
    }
        
  useEffect(() => {
    getBranchOffices()
    //dispatch(branchOfficesGetter())
  }, [])

  return (
    <>
      <div id={style.dropBranches}>
        <DropdownButton variant="secondary" id="dropdown-basic-button" title="Seleccione una sucursal">
          {branchOffices.map(e => (
            <Dropdown.Item 
              onClick={handleSelection}
              key={branchOffices.indexOf(e)}  
            >
              {e.nombre.toUpperCase()}
              {/* {e.address.toUpperCase()}   */}
            </Dropdown.Item>
            )
          )}
        </DropdownButton>
      </div>

      <>{pickedBranchOffice
        ? (
          <div className={style.calendarContainer}>
            <h5 >
              Turnos sucursal {pickedBranchOffice.nombre.toUpperCase()}
            </h5>
            <Calendar />
          </div>)
        : (<></>)
      }</>
    </>
  )  
};

export default BranchOfficeSelector;