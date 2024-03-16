export async function emailAlreadyRegistered(email, model) {
  const check = await model.findOne({ email });

  return check ? true : false;
}
