import { nanoid } from "nanoid";
import { db } from '../database/db.js';

const SHORT_ID_LENGTH = 8;

export async function shortUrl(req, res) {
  const { url } = req.body;
  const { id: userId } = res.locals.user;

  try {
    const shortUrl = nanoid(SHORT_ID_LENGTH);

    const { rows } = await db.query(
      `INSERT INTO shortens (url, "shortUrl", "userId") VALUES ($1, $2, $3) RETURNING id`,
      [url, shortUrl, userId]
    );

    const [result] = rows;

    res.status(201).send({
      id: result.id,
      shortUrl: shortUrl,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred.');
  }
}

export async function getUrlId(req, res) {
  const { id } = req.params;

  try {
    const { rows } = await db.query(`SELECT * FROM shortens WHERE id = $1`, [id]);

    if (rows.length === 0) {
      return res.sendStatus(404);
    }

    const [url] = rows;

    res.send({
      id: url.id,
      shortUrl: url.shortUrl,
      url: url.url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred.");
  }
}

export async function openShortUrl(req, res) {
  const { shortUrl } = req.params;

  try {
    const { rows } = await db.query(`SELECT * FROM shortens WHERE "shortUrl" = $1`, [shortUrl]);

    if (rows.length === 0) {
      return res.sendStatus(404);
    }

    const [url] = rows;

    await db.query(`UPDATE shortens SET "visitCount" = "visitCount" + 1 WHERE id = $1`, [url.id]);

    res.redirect(url.url);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred.");
  }
}

export async function deleteUrl(req, res) {
  const { id } = req.params;
  const { user } = res.locals;

  try {
    const { rows } = await db.query(`SELECT * FROM shortens WHERE id = $1`, [id]);

    if (rows.length === 0) {
      return res.sendStatus(404);
    }

    const [url] = rows;

    if (url.userId !== user.id) {
      return res.sendStatus(401);
    }

    await db.query(`DELETE FROM shortens WHERE id = $1`, [id]);

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).send("");
  }
}
