import { app, errorHandler } from "mu";
import { ADMIN_ROLE } from "./config";
import { isLoggedIn, sessionHasRole } from "./lib/session";
import { getMeetingURI } from "./lib/meeting";
import { getExportJobForMeeting } from "./lib/public-export-job";
import { getTtlToDeltaTaskForMeeting } from "./lib/ttl-to-delta";
import { getThemisSyncTaskForMeeting } from "./lib/themis-sync-task";
import { getThemisReleaseTaskForMeeting } from "./lib/themis-release-task";
import { getThemisDatasetForMeeting } from "./lib/themis-dataset";

app.get("/meeting/:uuid/public-export-jobs", async function (req, res) {
  try {
    const sessionUri = req.headers["mu-session-id"];
    if (!(await isLoggedIn(sessionUri))) {
      return next({
        message: "Unauthorized access to this endpoint is not permitted",
        status: 401,
      });
    }
    const hasCorrectRole = await sessionHasRole(sessionUri, [ADMIN_ROLE]);
    if (!hasCorrectRole) {
      return next({
        message: "Unauthorized access to this endpoint is not permitted",
        status: 403,
      });
    }

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
    const sessionUri = req.headers["mu-session-id"];
    if (!(await isLoggedIn(sessionUri))) {
      return next({
        message: "Unauthorized access to this endpoint is not permitted",
        status: 401,
      });
    }
    const hasCorrectRole = await sessionHasRole(sessionUri, [ADMIN_ROLE]);
    if (!hasCorrectRole) {
      return next({
        message: "Unauthorized access to this endpoint is not permitted",
        status: 403,
      });
    }
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
    const sessionUri = req.headers["mu-session-id"];
    if (!(await isLoggedIn(sessionUri))) {
      return next({
        message: "Unauthorized access to this endpoint is not permitted",
        status: 401,
      });
    }
    const hasCorrectRole = await sessionHasRole(sessionUri, [ADMIN_ROLE]);
    if (!hasCorrectRole) {
      return next({
        message: "Unauthorized access to this endpoint is not permitted",
        status: 403,
      });
    }
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
    const sessionUri = req.headers["mu-session-id"];
    if (!(await isLoggedIn(sessionUri))) {
      return next({
        message: "Unauthori²ed access to this endpoint is not permitted",
        status: 401,
      });
    }
    const hasCorrectRole = await sessionHasRole(sessionUri, [ADMIN_ROLE]);
    if (!hasCorrectRole) {
      return next({
        message: "Unauthorized access to this endpoint is not permitted",
        status: 403,
      });
    }
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
    const sessionUri = req.headers["mu-session-id"];
    if (!(await isLoggedIn(sessionUri))) {
      return next({
        message: "Unauthorized access to this endpoint is not permitted",
        status: 401,
      });
    }
    const hasCorrectRole = await sessionHasRole(sessionUri, [ADMIN_ROLE]);
    if (!hasCorrectRole) {
      return next({
        message: "Unauthorized access to this endpoint is not permitted",
        status: 403,
      });
    }
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
