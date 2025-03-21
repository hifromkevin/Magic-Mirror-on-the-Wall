const getHour = (n) => {
  if (n > 12) {
    n = n - 12;
  } else if (n === 0) {
    n = 12;
  }

  return n;
};

const lessThanTen = (n) => (n < 10 ? '0' + n : n);

const getTime = (currentDate) => {
  const second = lessThanTen(currentDate.getSeconds());
  const minute = lessThanTen(currentDate.getMinutes());
  const hour = getHour(currentDate.getHours());

  const timeOfDay = currentDate.getHours() < 12 ? 'AM' : 'PM';
  // return `${hour}:${minute}:${second} ${timeOfDay}`;
  return `${hour}:${minute} ${timeOfDay}`;
};

exports.getTime = getTime;
