export const getFixedTime = (pickedDate) => {
    const fixedHours = pickedDate.hours.length === 1 
                      ? `0${pickedDate.hours}`
                      : pickedDate.hours
    
    const fixedMinutes = pickedDate.minutes.length === 1 
                      ? `0${pickedDate.minutes}`
                      : pickedDate.minutes

    const time = `${fixedHours}:${fixedMinutes}`
    return time;
};