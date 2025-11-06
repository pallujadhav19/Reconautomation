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
            // fileName = JSON.parse(response.body.workflowResponse).outputParameters[1].name;
            // if (fileName == 'Output File.xlsx'){
            // fileValue = JSON.parse(response.body.workflowResponse).outputParameters[1].value;
            // }
            // else {
            //   fileValue = JSON.parse(response.body.workflowResponse).outputParameters[0].value;
            // }
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
            //var t4username=name;

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

//Tds status api
app.get("/tdsstatus", async (req, res) => {
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
            // fileName = JSON.parse(response.body.workflowResponse).outputParameters[1].name;
            // if (fileName == 'Output File.xlsx'){
            // fileValue = JSON.parse(response.body.workflowResponse).outputParameters[1].value;
            // }
            // else {
            //   fileValue = JSON.parse(response.body.workflowResponse).outputParameters[0].value;
            // }
            let outputParameters = JSON.parse(
              response.body.workflowResponse
            ).outputParameters;
            for (let i = 0; i < outputParameters.length; i++) {
              if (outputParameters[i].name === "TDS_Receivable_Reco.xlsx") {
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
            //var t4username=name;

            pool.query(
              "select tdsrowcount, tdsremcredit from users where registerid=$1",
              [registerid],
              (err, result) => {
                if (!err) {
                  const rows = result.rows;
                  console.log("First user details: ", rows);
                  if (rows.length > 0) {
                    rowcountvalue = rows[0].tdsrowcount;
                    remaining_creditvalue = rows[0].tdsremcredit;
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
                      "UPDATE users SET tdsrowcount = $1, tdsremcredit = $2 WHERE registerid= $3",
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

//Download api for GST
app.get("/download", async (req, res) => {
  const { sessionToken, requestId, fileId } = req.query;
  try {
    // Make the API request to the external download API
    const response = await axios({
      method: "GET",
      url: "https://t4.automationedge.com/aeengine/rest/file/download",
      params: { file_id: fileId, request_id: requestId }, // Set the fileID as a query parameter
      responseType: "stream",
      headers: {
        "X-Session-Token": sessionToken, // Add the session token in the Authorization header
      },
    });

    // Get the file name from the response headers or set a default name
    const fileName = response.headers["content-disposition"]
      ? response.headers["content-disposition"].split("filename=")[1]
      : "downloaded_file.xlsx"; // Replace 'downloaded_file.ext' with the desired default name

    // Set the headers for the file download
    res.setHeader("Content-disposition", "attachment; filename=" + fileName);
    res.setHeader(
      "Content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ); // Adjust the content-type based on your file type if needed

    // Stream the file to the client
    response.data.pipe(res);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).send("Error downloading file");
  }
});

//Download api for TDS
app.get("/tdsdownload", async (req, res) => {
  const { sessionToken, requestId, fileId } = req.query;
  try {
    // Make the API request to the external download API
    const response = await axios({
      method: "GET",
      url: "https://t4.automationedge.com/aeengine/rest/file/download",
      params: { file_id: fileId, request_id: requestId }, // Set the fileID as a query parameter
      responseType: "stream",
      headers: {
        "X-Session-Token": sessionToken, // Add the session token in the Authorization header
      },
    });

    // Get the file name from the response headers or set a default name
    const fileName = response.headers["content-disposition"]
      ? response.headers["content-disposition"].split("filename=")[1]
      : "downloaded_file.xlsx"; // Replace 'downloaded_file.ext' with the desired default name

    // Set the headers for the file download
    res.setHeader("Content-disposition", "attachment; filename=" + fileName);
    res.setHeader(
      "Content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ); // Adjust the content-type based on your file type if needed

    // Stream the file to the client
    response.data.pipe(res);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).send("Error downloading file");
  }
});

// This is code for get the data from registrationpage into csv file and file is store in our local directory...

const csvFilePath = path.join(
  "C:",
  "Setup",
  "AE",
  "Process-Studio",
  "ps-workspace",
  "Bulk_User_Creation",
  "user_data.csv"
);

app.post("/api/addUser", (req, res) => {
  const userData = req.body;
  const csvData = `${userData.firstName},${userData.lastName},${userData.email},${userData.username}\n`;

  try {
    // Check if the CSV file exists, and if not, re-create it
    if (!fs.existsSync(csvFilePath)) {
      fs.writeFileSync(
        csvFilePath,
        "firstname, lastname, email, username\n",
        "utf-8"
      );
    }

    const existingData = fs.readFileSync(csvFilePath, "utf-8");
    const existingUsernames = existingData
      .split("\n")
      .slice(1)
      .map((line) => line.split(",")[3]);

    if (existingUsernames.includes(userData.username)) {
      return res.status(400).json({ error: "Username already exists" });
    }

    fs.appendFileSync(csvFilePath, csvData, "utf-8");
    console.log("User data appended to CSV file:", userData);
    res.status(200).json({ message: "User data added successfully" });
  } catch (error) {
    console.error("Error appending user data to CSV file:", error);
    res.status(500).json({ error: "Failed to add user data" });
  }
});

app.post('/executeprocess-gst', (req, res) => {
  const { username, password, financialYear,quarter, month, your_email } = req.body;

  unirest
    .post('https://t4.automationedge.com/aeengine/rest/execute')
    .headers({
      'Content-Type': 'application/json',
      'X-Session-Token': sessionToken,
    })
    .query({ workflow_name: 'GSTR_2B_Portal_Automation', workflow_id: '6008' })
    .send({
      orgCode: 'VAIBHAV_PARADHI_2113',
      workflowName: 'GSTR_2B_Portal_Automation',
      userId: 'VAIBHAV_PARADHI_2113',
      source: 'Rest Test',
      responseMailSubject: 'null',
      params: [
        { name: 'Username', value: username, type: 'String'},
        { name: 'Password', value: password, type: 'String'},
        { name:  'Financial_Year', value: financialYear, type: 'String'},
        { name:  'Quarter', value: quarter, type: 'String'},
        { name:  'Month', value: month, type: 'String'},
        { name: 'Your_Email', value: your_email, type: 'String'}
        
      ],
    })
    .end(function (response) {
      if (response.error) {
        console.error(response.error);
        res.status(500).send('Error occurred while executing the workflow');
      } else {
        const automationReqIdGST = response.body.automationRequestId; // Accessing automationReqIdGST from the response
        console.log('Request ID:', automationReqIdGST);

        res.status(200).json({ automationReqIdGST });
      }
    });
});

app.post('/executeprocess-tds', (req, res) => {
  const { username, password, financialYear, your_email } = req.body;

  unirest
    .post('https://t4.automationedge.com/aeengine/rest/execute')
    .headers({
      'Content-Type': 'application/json',
      'X-Session-Token': sessionToken,
    })
    .query({ workflow_name: 'TDS_Portal_Automation', workflow_id: '6009' })
    .send({
      orgCode: 'VAIBHAV_PARADHI_2113',
      workflowName: 'TDS_Portal_Automation',
      userId: 'VAIBHAV_PARADHI_2113',
      source: 'Rest Test',
      responseMailSubject: 'null',
      params: [
        { name: 'Username', value: username, type: 'String'},
        { name: 'Password', value: password, type: 'String'},
        { name:  'Financial_Year', value: financialYear, type: 'String'},
        { name: 'Your_Email', value: your_email, type: 'String'}
      ],
    })
    .end(function (response) {
      if (response.error) {
        console.error(response.error);
        res.status(500).send('Error occurred while executing the workflow');
      } else {
        const automationReqIdTDS = response.body.automationRequestId; // Accessing automationReqIdTDS from the response
        console.log('Request ID:', automationReqIdTDS);

        res.status(200).json({ automationReqIdTDS });
      }
    });
});

//*****************************************************************************
//Auto Intent Application API

// Register Details

app.post('/api/RegisterDetails', async (req, res) => {
  const { YOUR_NAME, YOUR_EMAIL, EMAIL_PASSWORD, YOUR_MOBILE, YOUR_COMPANY_NAME, YOUR_POSITION, USERNAME, SCHEDULE_LINK } = req.body;

  if (!YOUR_NAME || !YOUR_EMAIL || !EMAIL_PASSWORD || !YOUR_MOBILE || !YOUR_COMPANY_NAME || !YOUR_POSITION || !USERNAME || !SCHEDULE_LINK) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const result = await pool2.query(
      `INSERT INTO register_details (your_name, your_email, email_password, mob_number, company_name, your_position, schedule_link, username)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [YOUR_NAME, YOUR_EMAIL, EMAIL_PASSWORD, YOUR_MOBILE, YOUR_COMPANY_NAME, YOUR_POSITION, SCHEDULE_LINK, USERNAME]
    );

    res.status(201).json({ message: 'Registration successful!', data: result.rows[0] });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});

// Endpoint to get user details based on username
app.get('/api/getUserDetails', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    // Query to fetch user details based on username
    const result = await pool2.query(
      'SELECT * FROM register_details WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the fetched data
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

var sessionToken = '';

// Login endpoint
app.get('/api/loginAutoIntent', (req, res) => {
  const { username, password } = req.query;
  console.log('Received username:', username);
  console.log('Received password:', password);

  // First authentication using user-provided credentials
  unirest
    .post('https://t4.automationedge.com/aeengine/rest/authenticate')
    .query({ username, password })
    .end(function (response) {
      if (response.error) {
        res.status(401).send('Authentication failed');
      } else {
        sessionToken = response.body.sessionToken;
        console.log('Session Token:', sessionToken);

        // Second authentication using hardcoded credentials
        unirest
          .post('https://t4.automationedge.com/aeengine/rest/authenticate')
          .query({ username: 'VAIBHAV_PARADHI_2113', password: 'Recon@123' })
          .end(function (vaibhavResponse) {
            if (vaibhavResponse.error) {
              res.status(401).send('Failed to authenticate VAIBHAV_PARADHI_2113');
            } else {
              const vaibhavsessionToken = vaibhavResponse.body.sessionToken;
              console.log('Vaibhav Session Token:', vaibhavsessionToken);

              // Call the agent state API using the vaibhavsessionToken
              unirest
                .get('https://t4.automationedge.com/aeengine/rest/VAIBHAV_PARADHI_2113/monitoring/agents')
                .query({ type: 'AGENT', offset: 0, size: 10 })
                .headers({
                  'Content-Type': 'application/json',
                  'X-Session-Token': vaibhavsessionToken,
                })
                .end(function (agentResponse) {
                  if (agentResponse.error) {
                    res.status(500).send('Failed to retrieve agent data');
                  } else {
                    const agentData = agentResponse.body;
                    const agentState = agentData[0]?.agentState; // Assuming you want the state of the first agent

                    // Attach the agentState to the original authentication response
                    const finalResponse = {
                      ...response.body,
                      agentState: agentState || 'UNKNOWN',
                    };
                    res.status(200).json(finalResponse);
                  }
                });
            }
          });
      }
    });
});

