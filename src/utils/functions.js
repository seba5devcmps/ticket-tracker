// Función para convertir la fecha a GMT-5
export const convertToGMTMinus5 = (dateStr) => {
  const date = new Date(dateStr);
  const offset = -5; // GMT-5
  const localTime = date.getTime();
  const localOffset = date.getTimezoneOffset() * 60000;
  const utc = localTime + localOffset;
  const gmtMinus5 = utc + 3600000 * offset;
  return new Date(gmtMinus5);
};
