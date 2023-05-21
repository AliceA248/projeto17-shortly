import bcrypt from 'bcrypt';
import { db } from '../database/db.js';
import { v4 as uuid } from 'uuid';

export async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    const { rows: users } = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (users.length === 0) {
      return res.sendStatus(401);
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = uuid();
      await db.query(
        `INSERT INTO sessions (token, "userId") VALUES ($1, $2)`,
        [token, user.id]
      );
      return res.send({ token });
    }

    return res.sendStatus(401);
  } catch (error) {
    console.error('Houve um erro no sign-in:', error);
    return res.sendStatus(500);
  }
}
