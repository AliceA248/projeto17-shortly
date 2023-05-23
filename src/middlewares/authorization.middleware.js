import { db } from '../database/db.js';

export async function authValidation(req, res, next) {

  const authorization = req.headers.authorization;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send("Não existe token");
  }

  try {
    const { rows: sessions } = await db.query(`SELECT * FROM sessions WHERE token = $1`, [token]);

    const session = sessions[0];

    if (!session) {
      return res.status(401).send("A sessão não foi encontrada");
    }

    const { rows: users } = await db.query(`SELECT * FROM users WHERE id = $1`, [session.userId]);
    const user = users[0];

    if (!user) {
      return res.status(401).send("Usuário não foi encontrado");
    }

    res.locals.user = user;
    next();

  } catch (error) {
    console.log(error);
    res.status(500).send("Erro no usuário");
  }
}
