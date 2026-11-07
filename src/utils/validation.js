const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

const isValidIsoDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
};

const isValidBirthYear = (value) => {
  const currentYear = new Date().getFullYear();
  return Number.isInteger(value) && value >= 1 && value <= currentYear;
};

export { isNonEmptyString, isValidIsoDate, isValidBirthYear };
