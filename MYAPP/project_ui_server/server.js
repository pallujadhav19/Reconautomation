


const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const app = express();
const { Pool } = require("pg");
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const XLSX = require('xlsx');
const JSZip = require("jszip");
const { parse, isValid } = require('date-fns');
const moment = require('moment');

// Data base connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Recon_CA",
  password: "postgres",
  port: 5433, // Default PostgreSQL port (custom in your setup)
});

const pool2 = new Pool({
  user: "postgres",
  host: "localhost",
  database: "email_campaign_db",
  password: "root",
  port: 5432,
});

console.log('Database connection Successful');
app.use(express.json());

// setting build
app.use(express.static(path.join(__dirname, '../project_ui/build')));

// logging - winston
const winston = require("winston");
const logger = winston.createLogger({
  level: "info",
  //standard log format
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  // Log to the console and a file
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

const multer = require("multer");
const upload = multer();

app.use(cors());
const port = 8080;
const unirest = require("unirest");

// Client Registration Post Api
app.use(bodyParser.json());
app.post("/api/register", async (req, res) => {
  const { clientName, email, mobileNo, state, country } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO client_registrations (client_name, email, mobile_no, state, country) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [clientName, email, mobileNo, state, country]
    );

    console.log("Client Registration successful:", result.rows[0]);
    res.status(201).json({ message: "Client Registration successful" });
  } catch (error) {
    console.error("Error during Client registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

var name;
app.get("/authenticate", (req, res) => {
  const { username, password } = req.query;
  name = username;
  logger.info(`Received a ${req.method} request for ${req.url}`);
  const request = unirest(
    "POST",
    "https://t4.automationedge.com/aeengine/rest/authenticate"
  ).query({ username, password });
  request.end(function (response) {
    console.log(response.body);
    if (response.error) {
      logger.error(`${response.error.message} from t4 instance`);
      res.status(401).send("Error occurred");
    } else {
      pool.query(
        "SELECT registerid FROM userregistration WHERE username=$1",
        [username],
        (error, result) => {
          if (error) {
            logger.error("Error querying userregistration table:", error);
            res.status(500).json({ error: "Database error occurred" });
            return;
          }

          console.log("result", result);

          // Check if user exists in the database
          if (!result.rows || result.rows.length === 0) {
            logger.warn(`User ${username} authenticated successfully but not found in userregistration table`);
            // User authenticated but not registered in local DB
            // Send response without registerid and credits
            res.status(200).json(response.body);
            return;
          }

          const registerid = result.rows[0].registerid;
          console.log(registerid);

          // Now, query the "users" table to get the remcredit
          pool.query(
            "SELECT remcredit,tdsremcredit FROM users WHERE registerid=$1",
            [registerid],
            (error, userResult) => {
              if (error) {
                logger.error("Error querying users table:", error);
                // Send response without credits but with registerid
                response.body.registerid = registerid;
                res.status(200).json(response.body);
                return;
              }

              // Check if user exists in users table
              if (!userResult.rows || userResult.rows.length === 0) {
                logger.warn(`RegisterID ${registerid} not found in users table`);
                // Send response with registerid but without credits
                response.body.registerid = registerid;
                res.status(200).json(response.body);
                return;
              }

              const remcredit = userResult.rows[0].remcredit;
              const tdsremcredit = userResult.rows[0].tdsremcredit;
              console.log("remcredit", remcredit);
              console.log("TDSremcredit", tdsremcredit);

              // Add both registerid and remcredit to the response.body
              response.body.registerid = registerid;
              response.body.remcredit = remcredit;
              response.body.tdsremcredit = tdsremcredit;

              console.log(
                "My response body after adding registerid and remcredit: ",
                response.body
              );

              console.log("My Reg ID: ", response.body.registerid);
              console.log(
                "response body tdsremcredit : ",
                response.body.tdsremcredit
              );
              logger.info(`Session Token Received from t3 instance`);

              // Send the response with both registerid and remcredit
              res.status(200).json(response.body);
            }
          );
        }
      );
    }
  });
  console.log(username, "this");
});

// send SMS through api
app.post('/send-message', async (req, res) => {
  try {
      const message = req.body.message;

      // Fetch all client mobile numbers from your PostgreSQL database
      const result = await pool.query('SELECT mobile_no FROM client_registrations');
      const clientMobileNumbers = result.rows.map(row => row.mobile_no);
     

      console.log("All CA Clients mobile numbers",clientMobileNumbers);
      // Send the message to each client using Fast2SMS API
      await Promise.all(clientMobileNumbers.map(async (mobileNumber) => {
          await sendSMS(mobileNumber, message);
      }));

      res.status(200).json({ success: true, message: 'Message sent to all clients.' });
  } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

async function sendSMS(mobileNumber, message) {
  try {
    const apiUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=3DTkbLOyxhNGSF0faPdKp6c4X91wtIj2C7nmqovEQreVsYAuZMosIHP3h9Yl48QUjWtzgCx5ycBwkKJp&route=q&message=${encodeURIComponent(message)}&flash=0&numbers=${mobileNumber}`;
    const response = await axios.get(apiUrl);
    console.log('SMS sent to', mobileNumber, 'Response:', response.data);
  } catch (error) {
    console.error('Error sending SMS to', mobileNumber, 'Error:', error);
    throw error;
  }
}

// GST sample input files
app.get("/api/download-sample-file", async (req, res) => {
  const zip = new JSZip();

  // Add files to the zip archive
  zip.file(
    "Purchase_Templates.xlsx",
    fs.readFileSync("./Purchase_Templates.xlsx")
  );
  zip.file("GST_Template.xlsx", fs.readFileSync("./GST_Template.xlsx"));

  // Generate the zip file as a buffer
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  // Send the zip archive as a download
  res.setHeader("Content-Disposition", "attachment; filename=sample_files.zip");
  res.setHeader("Content-Type", "application/zip");
  res.send(zipBuffer);
});

const targetDirectory = path.join("C:", "Setup", "MYAPP", "UserFiles");
// Update this path to your desired folder

// upload files for GST
app.post("/upload", upload.array("files", 2), async (req, res) => {
  logger.info(`Received a ${req.method} request to upload files.`);
  const { files } = req;
  const username = name; // Assuming you have the username available
  const registerid = req.body.registerid;

  try {
    files.forEach((file, index) => {
      const originalFileName = file.originalname;
      const currentDate = new Date().toISOString().split("T")[0]; // Extract the date part
      const currentDateTime = new Date()
        .toISOString()
        .replace(/:/g, "-")
        .replace(/\..+/, ""); // Format date and time
      const newFileName = `${originalFileName}_${currentDateTime}${path.extname(
        originalFileName
      )}`; // Append date and time to the file name
      const savePath = path.join(targetDirectory, newFileName);

      // Use fs.writeFileSync to save the file to the target location
      fs.writeFileSync(savePath, file.buffer);

      logger.info(`File ${originalFileName} saved to ${savePath}`);

      // Database Insertion
      const filePath = savePath; // Store the file path
      console.log("file name", filePath);

      pool.query(
        "INSERT INTO userfiles (registerid, username, filepath, filename, date) VALUES ($1, $2, $3, $4, $5)",
        [registerid, username, filePath, newFileName, currentDate],
        (error, result) => {
          if (error) {
            logger.error("Error inserting file into the database:", error);
          } else {
            logger.info(
              `File ${originalFileName} inserted into the database for user ${username} with registerid ${registerid} and path ${filePath} and the date with ${currentDate}`
            );
            // Handle successful database insertion here
          }
        }
      );
    });
  } catch (error) {
    logger.error("Error saving uploaded files:", error);
    //res.status(500).send('Error saving uploaded files.');
  }

  const sessionToken = req.body.sessionToken;
  const tenant_name = req.body.tenantName;
  const tenant_orgcode = req.body.tenantOrgCode;
  const mailId = req.body.mailId;

  // Uploading file1 to the t3 server
  const response1 = await unirest
    .post("https://t4.automationedge.com/aeengine/rest/file/upload")
    .headers({
      "Content-Type": "multipart/form-data",
      "X-Session-Token": sessionToken,
    })
    .query({ workflow_name: "GSTR_2B_1", workflow_id: "4339" })
    .attach("file", files[0].buffer, { filename: files[0].originalname });

  const fileId1 = response1.body.fileId;
  console.log("My file id : ", fileId1);

  //uploading file2 to the t3 server
  const response2 = await unirest
    .post("https://t4.automationedge.com/aeengine/rest/file/upload")
    .headers({
      "Content-Type": "multipart/form-data",
      "X-Session-Token": sessionToken,
    })
    .query({ workflow_name: "GSTR_2B_1", workflow_id: "4339" })
    .attach("file", files[1].buffer, { filename: files[1].originalname });

  const fileId2 = response2.body.fileId;
  console.log("My file id : ", fileId2);
  console.log(req.body);
  // Executing workflow with input files
  await unirest
    .post("https://t4.automationedge.com/aeengine/rest/execute")
    .headers({
      "Content-Type": "application/json",
      "X-Session-Token": sessionToken,
    })
    .query({ workflow_name: "GSTR_2B_1", workflow_id: "4339" })
    .send({
      orgCode: tenant_orgcode,
      workflowName: "GSTR_2B_1",
      userId: tenant_name,
      source: "Rest Test",
      responseMailSubject: "null",
      params: [
        { name: "Input_File", value: fileId1, type: "File" },
        { name: "GST_File_Path", value: fileId2, type: "File" },
        { name: "Destination_Address", value: mailId, type: "String" },
      ],
    })
    .end(function (response) {
      if (response.error) {
        logger.error(`Error in executing workflow`);
        console.error(response.error);
        res.status(500).send("Error occurred while executing worfkflow");
      } else {
        logger.info(
          `GST Automation request ID received ${response.body.automationRequestId}`
        );
        res.status(200).json(response.body.automationRequestId);
      }
      console.log("GST Response Body is : ", response.body);
    });
});

// GST status api
app.get("/status", async (req, res) => {
  logger.info(
    `Received a ${req.method} request for ${req.url} to check status`
  );
  const { sessionToken, requestId, registerid } = req.query;

  let status = "pending";
  let fileName = "";
  let fileValue = "";
  let request_id = "";
  let rowvalue = "";
  let rowname = "";
  let rowcountvalue;
  let remaining_creditvalue;
  let total_creditremaining;

  // Checking Workflow status after every 3 seconds
  let counter = 0;

  while (status !== "Complete" && status !== "Failure") {
    console.log(sessionToken, requestId);
    const request = await unirest(
      "GET",
      `https://t4.automationedge.com/aeengine/rest/workflowinstances/${requestId}`
    )
      .headers({
        "Content-Type": "application/json",
        "X-Session-Token": sessionToken,
      })
      .end(function (response) {
        console.log(response.body);
        if (response.error) {
          console.log(response.error);
          res.status(500).send(response.error);
        } else {
          status = response.body.status;
          if (response.body.workflowResponse) {
            let outputParameters = JSON.parse(
              response.body.workflowResponse
            ).outputParameters;
            for (let i = 0; i < outputParameters.length; i++) {
              if (outputParameters[i].name === "Output File.xlsx") {
                fileValue = outputParameters[i].value;
                break;
              }
            }

            if (fileValue === null) {
              fileValue = outputParameters[0].value;
            }

            //Row Count
            if (response.body.workflowResponse) {
              rowname = JSON.parse(response.body.workflowResponse)
                .outputParameters[1].value;
              if (rowname == "value") {
                rowvalue = JSON.parse(response.body.workflowResponse)
                  .outputParameters[1].value;
              } else {
                rowvalue = JSON.parse(response.body.workflowResponse)
                  .outputParameters[0].value;
              }
            }
            //check username is present in db or not if present then add row count

            pool.query(
              "select rowcount, remcredit from users where registerid=$1",
              [registerid],
              (err, result) => {
                if (!err) {
                  const rows = result.rows;
                  console.log("First user details: ", rows);
                  if (rows.length > 0) {
                    rowcountvalue = rows[0].rowcount;
                    remaining_creditvalue = rows[0].remcredit;
                    console.log("Database Row Count: ", rowcountvalue);
                    console.log(
                      "Database Credit Value: ",
                      remaining_creditvalue
                    );

                    myrow_count = parseInt(rowvalue) + parseInt(rowcountvalue);
                    total_creditremaining =
                      parseInt(remaining_creditvalue) - parseInt(rowvalue);
                    console.log("Total Row Count", myrow_count);
                    console.log(
                      "Total Credit Remaining",
                      total_creditremaining
                    );

                    pool.query(
                      "UPDATE users SET rowcount = $1, remcredit = $2 WHERE registerid= $3",
                      [myrow_count, total_creditremaining, registerid],
                      (err, res) => {
                        if (!err) {
                          console.log("Insert Row Successfully ");
                        } else {
                          console.log("Error While Inserting the data");
                        }
                      }
                    );
                  }
                }
              }
            );
          }
          request_id = response.body.id;
        }
        if (status === "New" && !response.body.agentName) {
          counter++;
          if (counter === 10) {
            status = "no_agent";
          }
        } else {
          counter = 0;
        }
      });
    if (
      status === "Complete" ||
      status === "Failure" ||
      status === "no_agent"
    ) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  if (status === "Complete") {
    res.status(200).send({
      status: "Complete ! Please Check Your Mail",
      request_id: requestId,
      file_id: fileValue,
      row_count: rowvalue,
      total_credit: total_creditremaining,
    });
  } else if (status === "Failure") {
    res
      .status(200)
      .send({ status: "Failure ! Please Try Again (Check Input Files)" });
  } else if (status === "no_agent") {
    res.status(200).send({
      status: "Contact the Administrator Agent Is Under Maintainance",
    });
  }
});

// === Removed: TDS endpoints and Auto Intent BOT & Requirement/Lead App endpoints ===
// All TDS-related routes (/uploadtds, /tdsstatus, /api/download-sample-file-tds, etc.)
// All Auto Intent BOT endpoints (/api/loginAutoIntent, /api/uploadDetails, /api/uploadSingleDetails, /api/send-mail, /api/email-details, /api/update-email-details, /api/delete-dashboard-email, etc.)
// All Requirement & Lead App endpoints and pool3 usage
// (staffing requirements, leads upload, lead-register, lead-login, daily reports, dashboard endpoints, etc.)
//
// These have been intentionally deleted per your request. Everything else remains untouched.

// Catch-all: serve React app
app.get('(/*)?', function (req, res) {
  res.sendFile(path.join(__dirname, '../project_ui/build/index.html'));
});

app.listen(port, 'localhost', () => {
  console.log(`✅ Server app running at http://localhost:${port}`);
});
