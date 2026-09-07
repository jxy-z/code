import axios from "axios"
import fs from "fs"

const repo = "code";
const branch = "main";
const baseApi = `https://api.github.com/repos/${global.userGh}/${repo}/contents/jarrxz`;

const handler = async (m, { sock, args, reply, usedPrefix, command, text }) => {
  try {
    if (!text) return reply(`Ex: *${usedPrefix + command} sticker.js*\n\n*${usedPrefix}listrepo* untuk melihat all file di repostory`);

    const filename = text.endsWith(".js") ? text : `${text}.js`;
    m.react("⌛");

    const res = await axios.get(`${baseApi}/${filename}`, {
      headers: { Authorization: `Bearer ${global.ghTokens}` },
    });

    const content = Buffer.from(res.data.content, "base64").toString("utf-8");

    if (content.length > 4000) {
      const temp = `./${filename.replace(".js", "")}.txt`;
      fs.writeFileSync(temp, content);

      await sock.sendMessage(
        m.chat,
        {
          document: { url: temp },
          mimetype: "text/plain",
          fileName: filename,
        },
        { quoted: m }
      );

      fs.unlinkSync(temp);
    } else {
      reply(`${content}`);
    }
  } catch (e) {
    console.error("GetCode Error:", e.response?.data || e);
    reply("Gagal mengambil isi file: " + e.message);
  }
};

handler.command = ["getrepo", "grepo"];
handler.owner= true;
handler.noJadiBot = true;

export default handler;