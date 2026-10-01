import { app, errorHandler } from "mu";
import { getSubmissionsWithoutMeeting } from "./lib/submissions";
import { getFailedEmailIds } from "./lib/failed-emails";
import { getMeetingURI } from "./lib/meeting";
import { getExportJobForMeeting } from "./lib/public-export-job";
import { getTtlToDeltaTaskForMeeting } from "./lib/ttl-to-delta";
import { getThemisSyncTaskForMeeting } from "./lib/themis-sync-task";
import { getThemisReleaseTaskForMeeting } from "./lib/themis-release-task";
import { getThemisDatasetForMeeting } from "./lib/themis-dataset";

app.get("/submissions/without-meeting", async function (req, res) {
  try {
    const submissions = await getSubmissionsWithoutMeeting();
    if (!submissions.length) {
      return res.status(204).send();
    }
    return res.status(200).send({
      data: submissions.map(({ id, statusLabel }) => ({
        type: "submissions",
        id,
        attributes: {
          message: `Submission with uuid ${id} has status "${statusLabel}" but is not linked to a meeting`,
        },
      })),
      meta: { count: submissions.length },
    });
  } catch (e) {
    console.trace(e);
    return res.status(500).send({
      error: `Something went wrong when looking for submissions without meeting: ${e.message}`,
    });
  }
});

app.get("/emails/failed", async function (req, res) {
  try {
    const ids = await getFailedEmailIds();
    if (!ids.length) {
      return res.status(204).send();
    }
    return res.status(200).send({
      data: ids.map((id) => ({
        type: "emails",
        id,
        attributes: {
          message: `Mail-delivery has failed for email with uuid ${id}`,
        },
      })),
      meta: { count: ids.length },
    });
  } catch (e) {
    console.trace(e);
    return res.status(500).send({
      error: `Something went wrong when looking for failed e-mails: ${e.message}`,
    });
  }
});

app.get("/meeting/:uuid/public-export-jobs", async function (req, res) {
  try {
    if (!req.query.startDate) {
      return res.status(400).send(
        JSON.stringify({
          error: `No startDate supplied.`,
        }),
      );
    }
    const meeting = await getMeetingURI(req.params.uuid);
    const startDate = new Date(req.query.startDate);
    const job = await getExportJobForMeeting(meeting, startDate);
    if (job) {
      return res.status(200).send(job);
    } else {
      return res
        .status(204)
        .send({
          message: `Could not find public-export-job for meeting with uuid ${req.params.uuid}`,
        });
    }
  } catch (e) {
    console.trace(e);
    return res
      .status(500)
      .send({
        error: `Something went wrong when looking for a public-export-job: ${e.message}`,
      });
  }
});

app.get("/meeting/:uuid/tto-to-delta-task", async function (req, res) {
  try {
    if (!req.query.startDate) {
      return res.status(400).send(
        JSON.stringify({
          error: `No startDate supplied.`,
        }),
      );
    }
    const meeting = await getMeetingURI(req.params.uuid);
    const startDate = new Date(req.query.startDate);
    const task = await getTtlToDeltaTaskForMeeting(meeting, startDate);
    if (task) {
      return res.status(200).send(task);
    } else {
      return res
        .status(204)
        .send({
          message: `Could not find ttl-to-delta-task for meeting with uuid ${req.params.uuid}`,
        });
    }
  } catch (e) {
    console.trace(e);
    return res
      .status(500)
      .send({
        error: `Something went wrong when looking for a ttl-to-delta-task: ${e.message}`,
      });
  }
});

app.get("/meeting/:uuid/themis-sync-task", async function (req, res) {
  try {
    if (!req.query.startDate) {
      return res.status(400).send(
        JSON.stringify({
          error: `No startDate supplied.`,
        }),
      );
    }
    const meeting = await getMeetingURI(req.params.uuid);
    const startDate = new Date(req.query.startDate);
    const syncTask = await getThemisSyncTaskForMeeting(meeting, startDate);
    if (syncTask) {
      return res.status(200).send(syncTask);
    } else {
      return res
        .status(204)
        .send({
          message: `Could not find themis sync-task for meeting with uuid ${req.params.uuid}`,
        });
    }
  } catch (e) {
    console.trace(e);
    return res
      .status(500)
      .send({
        error: `Something went wrong when querying themis for sync-task: ${e.message}`,
      });
  }
});

app.get("/meeting/:uuid/themis-release-task", async function (req, res) {
  try {
    if (!req.query.startDate) {
      return res.status(400).send(
        JSON.stringify({
          error: `No startDate supplied.`,
        }),
      );
    }
    const meeting = await getMeetingURI(req.params.uuid);
    const startDate = new Date(req.query.startDate);
    const releaseTask = await getThemisReleaseTaskForMeeting(
      meeting,
      startDate,
    );
    if (releaseTask) {
      return res.status(200).send(releaseTask);
    } else {
      return res
        .status(204)
        .send({
          message: `Could not find themis release-task for meeting with uuid ${req.params.uuid}`,
        });
    }
  } catch (e) {
    console.trace(e);
    return res
      .status(500)
      .send({
        error: `Something went wrong when querying themis for release-task: ${e.message}`,
      });
  }
});

app.get("/meeting/:uuid/themis-dataset", async function (req, res) {
  try {
    if (!req.query.startDate) {
      return res.status(400).send(
        JSON.stringify({
          error: `No startDate supplied.`,
        }),
      );
    }
    const meeting = await getMeetingURI(req.params.uuid);
    const startDate = new Date(req.query.startDate);
    const dataset = await getThemisDatasetForMeeting(meeting, startDate);
    if (dataset) {
      return res.status(200).send(dataset);
    } else {
      return res
        .status(204)
        .send({
          message: `Could not find themis dataset for meeting with uuid ${req.params.uuid}`,
        });
    }
  } catch (e) {
    console.trace(e);
    return res
      .status(500)
      .send({
        error: `Something went wrong when querying themis for dataset: ${e.message}`,
      });
  }
});

app.use(errorHandler);
