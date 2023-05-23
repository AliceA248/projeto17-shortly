import { nanoid } from "nanoid";
import { db } from '../database/db.js';

const SHORT_ID_LENGTH = 8;

export async function shortUrl(req, res) {

  const { url } = req.body;
  const { id: userId } = res.locals.user;

  try {
    const shortUrl = nanoid(SHORT_ID_LENGTH);

    const { rows } = await db.query(`INSERT INTO shortlinks (url, "shortUrl", "userId") VALUES ($1, $2, $3) RETURNING id`, [url, shortUrl, userId]);

    const [result] = rows;

    res.status(201).send({
      id: result.id,
      shortUrl,
    });


  } catch (error) {
    console.log(error);
    res.status(500).send("Erro");
  }
}


export async function getUrlId(req, res) {
  const { id } = req.params;

  try {
    const { rows } = await db.query(`SELECT * FROM shortlinks WHERE id = $1`, [id]);

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
    console.error(error);
    res.status(500).send("Erro");
  }
}

export async function openShortUrl(req, res) {
  const { shortUrl } = req.params;

  try {
    const { rows } = await db.query(`SELECT * FROM shortlinks WHERE "shortUrl" = $1`, [shortUrl]);

    if (rows.length === 0) {
      return res.sendStatus(404);
    }

    const [url] = rows;

    await db.query(`UPDATE shortlinks SET "visitCounter" = "visitCounter" + 1 WHERE id = $1`, [url.id]);

    res.redirect(url.url);

  } catch (error) {
    console.log(error);
    res.status(500).send("Erro.");
  }
}

export async function deleteUrl(req, res) {
  const { id } = req.params;
  const { user } = res.locals;

  try {
    const { rows } = await db.query(`SELECT * FROM shortlinks WHERE id = $1`, [id]);

    if (rows.length === 0) {
      return res.sendStatus(404);
    }

    const [url] = rows;

    if (url.userId !== user.id) {
      return res.sendStatus(401);
    }

    await db.query(`DELETE FROM shortlinks WHERE id = $1`, [id]);

    res.sendStatus(204);

  } catch (error) {
    console.log(error);
    res.status(500).send("");
  }
}

export async function getUserData(req, res) {
    const { user } = res.locals;
  
    try {
      const { rows: userRows } = await db.query(`SELECT * FROM users WHERE id = $1`, [user.id]);
  
      if (userRows.length === 0) {
        return res.sendStatus(404);
      }
  
      const [userData] = userRows;
  
      const { rows: urlRows } = await db.query(
        
        `SELECT shortlinks.id, shortlinks."shortUrl", shortlinks.url, SUM(shortlinks."visitCounter") AS visitCount
        FROM shortlinks
        WHERE shortlinks."userId" = $1
        GROUP BY shortlinks.id`,
        [user.id]
      );
  
      const shortenedUrls = urlRows.map((url) => ({
        id: url.id,
        shortUrl: url.shortUrl,
        url: url.url,
        visitCount: Number(url.visitCount),
      }));
  
      const visitCount = urlRows.reduce((sum, url) => sum + Number(url.visitCount), 0);
  
      const userProfile = {
        id: userData.id,
        name: userData.name,
        visitCount: visitCount,
        shortenedUrls: shortenedUrls,
      };
  
      res.status(200).json(userProfile);
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro");
    }
  }
  