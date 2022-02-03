import Prince from "prince";
import { json } from "remix";
import fs from "fs";
import util from "util";

export const loader = async ({ params }) => {
  const pdfReady = await Prince()
    .inputs(`http://localhost:3000/resume/${params.slug}/`)
    .output("test.pdf")
    .option("pdf-profile", "PDF/UA-1")
    .execute()
    .then(
      function ({ stdout }) {
        console.log(util.inspect(stdout.toString()));
        console.log("OK: done");
      },
      function ({ stderror }) {
        console.log("ERROR: ", util.inspect(error));
      }
    );

  console.log(pdfReady);

  const pdfStream = fs.createReadStream("test.pdf");

  return new Response(pdfStream, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
    },
  });

  return json("ok");
};
