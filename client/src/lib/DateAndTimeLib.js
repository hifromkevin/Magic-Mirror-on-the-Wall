const getHour = (n) => {
  if (n > 12) {
    n = n - 12;
  } else if (n === 0) {
    n = 12;
  } 

  return n;
};

const lessThanTen = (n) => {
  return (n < 10) ? ('0' + n) : n;
}

const getTime = (currentDate) => {
  let second = lessThanTen(currentDate.getSeconds());
  let minute = lessThanTen(currentDate.getMinutes());
  let hour = getHour(currentDate.getHours());

  let timeOfDay = (currentDate.getHours() < 12) ? 'AM' : 'PM';
  return `${hour}:${minute}:${second} ${timeOfDay}`;
};

exports.getTime = getTime;
