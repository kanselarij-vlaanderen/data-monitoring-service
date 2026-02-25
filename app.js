import { app, errorHandler } from "mu";
import { CronJob } from "cron";
import { countPiecesWithoutType, countPiecesWithoutId } from "./lib/pieces";
import { KALEIDOS_HOST_URL, POLLING_CRON_PATTERN } from "./config";
import { createEmail } from "./lib/email";

new CronJob(
  POLLING_CRON_PATTERN,
  async () => {
    console.log(
      `Running data checks triggered by cron job at ${new Date().toISOString()}`,
    );
    await runDataChecks();
  }, // onTick
  null, // onComplete
  true, // start
);

async function runDataChecks() {
  try {
    let message = "";
    let sendEmail = false;
    const piecesWithoutType = await countPiecesWithoutType();
    const piecesWithoutId = await countPiecesWithoutId();
    if (piecesWithoutType | piecesWithoutId) {
      sendEmail = true;
      message += `
Found ${piecesWithoutType} pieces where type is missing on main graph
Found ${piecesWithoutId} pieces where id is missing on main graph
  `;
    }
    // more can be added here, just append messages

    if (sendEmail) {
      console.log(message);
      await createEmail(
        "Polling from data-monitoring has detected data inconsistencies",
        `environment: ${KALEIDOS_HOST_URL}\t\nDetail:\t\n${message}`,
      );
    }
  } catch (e) {
    console.trace(e);
    await createEmail(
      "Polling from data-monitoring has failed",
      `environment: ${KALEIDOS_HOST_URL}\t\nDetail of error: ${e?.message || "no details available"}`,
    );
  }
};

app.use(errorHandler);
