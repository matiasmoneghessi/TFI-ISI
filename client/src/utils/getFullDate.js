export const getFullDate = (pickedDate) => {
    let { day, date, month, year } = pickedDate
    
    switch (day) {
        case '0':
            day = "domingo"            
            break;
        case '1':
            day = "lunes"            
            break;
        case '2':
            day = "martes"           
            break;
        case '3':
            day = "miércoles"            
            break;
        case '4':
            day = "jueves"            
            break;
        case '5':
            day = "viernes"            
            break;
        default:
            day = "sábado"
            break;
    };

    switch (month) {
        case'0':
            month = "enero"            
            break;
        case '1':
            month = "febrero"            
            break;
        case '2':
            month = "marzo"            
            break;
        case '3':
            month = "abril"            
            break;
        case '4':
            month = "mayo"            
            break;
        case '5':
            month = "junio"            
            break;
        case '6':
            month = "julio"            
            break;
        case '7':
            month = "agosto"            
            break;
        case '8':
            month = "septiembre"            
            break;
        case '9':
            month = "octubre"            
            break;
        case '10':
            month = "noviembre"            
            break;
        default:
            month = "diciembre"
            break;
    };

    return `${day} ${date} de ${month} de ${year}`
};