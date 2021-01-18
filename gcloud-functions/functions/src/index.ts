process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";
const token = require("./DO_NOT_ADD.json");

if (admin.apps.length === 0) {
  admin.initializeApp();
}

exports.exportDropbox = functions.storage
  .object()
  .onFinalize(async (object) => {
    const filePath = object.name;
    if (filePath == null) {
      return;
    }

    const fileName = filePath.split("/");
    if (fileName[0] === "extra-check") {
      fileName.shift();
      const fbFile = await admin.storage().bucket().file(filePath).download();
      await fetch("https://content.dropboxapi.com/2/files/upload", {
        body: Buffer.concat(fbFile),
        method: "POST",
        headers: {
          Authorization: `Bearer ${token["not_the_access_token"]}`,
          "Content-Type": "application/octet-stream",
          "Dropbox-API-Arg": JSON.stringify({
            path: "/R56_Video_Diary/" + fileName.join("/"),
            mode: "add",
            autorename: true,
            strict_conflict: false,
            mute: false,
          }),
        },
      })
        .then(console.log)
        .catch(console.log);
    }

    await admin.storage().bucket().file(filePath).delete().catch(console.log);
  });
