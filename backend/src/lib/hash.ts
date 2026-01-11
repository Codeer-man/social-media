import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  const gensalt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, gensalt);
}

export async function comparePwd(password: string, hashPwd: string) {
  return await bcrypt.compare(password, hashPwd);
}
