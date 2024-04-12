export const generateOtp = () => {
  const len = 6;
  let randStr = "";
  for (let i = 0; i < len; i++) {
    //ch = a number between 1 to 9
    const ch = Math.floor(Math.random() * 9) + 1;
    randStr += ch;
  }

  return randStr;
};
