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
      return res.status(401).send({ error: "Email ou senha incorretas" });
    }

    const user = users[0];
    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (passwordIsCorrect) {
      const token = uuid();
      await db.query(`INSERT INTO sessions (token, "userId") VALUES ($1, $2)`,[token, user.id]);
      return res.send({ token });
    }

    return res.status(401).send({ error: "Email ou senha incorretas" });

  } catch (error) {
    console.error("Ocorreu um erro durante no sign-in:", error);
    return res.status(500).send({ error: "Erro" });
  }
}

