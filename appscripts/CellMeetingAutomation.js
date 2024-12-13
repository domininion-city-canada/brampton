function onFormSubmit(e) {
    // Previous onFormSubmit code remains the same
    // ...
    updateAttendanceSummary(ss);
}

function sendAttendanceSummaryEmail() {
    // Get the spreadsheet and summary sheet
    const form = FormApp.getActiveForm();
    const ss = SpreadsheetApp.openById(form.getDestinationId());
    const summarySheet = ss.getSheetByName('Attendance Summary');

    // List of email recipients
    const recipients = [
        "izuchukwunwankwo@yahoo.com",
        "samuelakuma130@gmail.com",
        "emmasite@gmail.com"
    ];

    // If summary sheet doesn't exist, exit
    if (!summarySheet) {
        Logger.log('Attendance Summary sheet not found');
        return;
    }

    // Get all data from the summary sheet
    const data = summarySheet.getDataRange().getValues();

    // Generate email body
    let emailBody = "Attendance Summary Report\n\n";

    // Add headers to explain columns
    const headers = [
        "Cell Group",
        "Last Updated",
        "Total Members",
        "Present Count",
        "Absent Count",
        "Attendance Rate",
        "Chronic Absentees Count",
        "Chronic Absentees Names"
    ];

    // Skip the first row (header row)
    for (let i = 1; i < data.length; i++) {
        emailBody += `Cell Group: ${data[i][0]}\n`;
        for (let j = 1; j < data[i].length; j++) {
            emailBody += `${headers[j]}: ${data[i][j]}\n`;
        }
        emailBody += "\n---\n\n";
    }

    // Send email to each recipient
    recipients.forEach(recipient => {
        MailApp.sendEmail({
            to: recipient,
            subject: `Weekly Attendance Summary - ${new Date().toLocaleDateString()}`,
            body: emailBody
        });
    });

    Logger.log('Attendance Summary emails sent');
}

function updateAttendanceSummary(ss) {
    // Add error logging and handling
    try {
        // Validate input
        if (!ss) {
            throw new Error('Spreadsheet is undefined or null');
        }

        // Check if ss is actually a spreadsheet
        if (typeof ss.getSheetByName !== 'function') {
            Logger.log('Invalid spreadsheet object: ' + JSON.stringify(ss));
            throw new Error('Invalid spreadsheet object passed to updateAttendanceSummary');
        }

        // Alternative method to get spreadsheet if direct pass fails
        if (!ss) {
            const form = FormApp.getActiveForm();
            if (!form) {
                throw new Error('Could not find active form');
            }
            ss = SpreadsheetApp.openById(form.getDestinationId());
        }

        // Create or get summary sheet
        let summarySheet = ss.getSheetByName('Attendance Summary');
        if (!summarySheet) {
            summarySheet = ss.insertSheet('Attendance Summary');
        }

        // Rest of the existing function remains the same
        // Clear existing content
        summarySheet.clear();

        // Set up headers
        const headers = [
            ['Cell Groups', 'Total Members Last Updated', 'Total Members', 'Present count', 'Absent count', 'Attendance Rate %', 'Number of Chronic Absentees', 'Names of Chronic Absentees (absent for 4 consecutive weeks)']
        ];

        // Apply headers
        summarySheet.getRange(1, 1, headers.length, headers[0].length).setValues(headers);

        // Format headers
        summarySheet.getRange(1, 1, 1, headers[0].length)
            .setBackground('#f3f3f3')
            .setFontWeight('bold')
            .setWrap(true);

        // Set column widths
        const columnWidths = [150, 150, 120, 120, 120, 120, 150, 300];
        columnWidths.forEach((width, index) => {
            summarySheet.setColumnWidth(index + 1, width);
        });

        // Freeze header row
        summarySheet.setFrozenRows(1);

        let summaryRow = 2; // Start after header

        // Get current date
        const today = new Date();
        const currentWeek = Utilities.formatDate(today, Session.getScriptTimeZone(), 'MMM dd, yyyy');

        // Process each attendance sheet
        ss.getSheets().forEach(sheet => {
            if (sheet.getName().startsWith('Attendance -')) {
                const cellGroup = sheet.getName().replace('Attendance - ', '');

                // Get all data including checkboxes
                const data = sheet.getDataRange().getValues();
                if (data.length <= 1) return; // Skip if sheet is empty or only has headers

                const headers = data[0];
                const members = data.slice(1);
                const lastUpdated = new Date();
                const formattedLastUpdated = Utilities.formatDate(lastUpdated, Session.getScriptTimeZone(), 'MMM dd, yyyy');

                // Find the most recent Wednesday's column
                let mostRecentWedCol = -1;
                const today = new Date();
                for (let i = 1; i < headers.length; i++) {
                    const colDate = new Date(headers[i]);
                    if (!isNaN(colDate.getTime())) { // Check if valid date
                        if (colDate <= today) {
                            mostRecentWedCol = i;
                        } else {
                            break;
                        }
                    }
                }

                if (mostRecentWedCol === -1) return; // Skip if no valid date found

                // Calculate attendance for most recent Wednesday
                let presentCount = 0;
                let absentCount = 0;
                let chronicAbsentees = [];

                members.forEach(member => {
                    // Check current week's attendance
                    const isPresent = member[mostRecentWedCol] === true; // Explicitly check for true
                    if (isPresent) {
                        presentCount++;
                    } else {
                        absentCount++;
                    }

                    // Check for chronic absence (4 consecutive weeks)
                    if (mostRecentWedCol >= 4) {
                        let consecutiveAbsences = 0;
                        for (let i = 0; i < 4; i++) {
                            const checkCol = mostRecentWedCol - i;
                            if (checkCol >= 1 && member[checkCol] !== true) {
                                consecutiveAbsences++;
                            }
                        }
                        if (consecutiveAbsences === 4) {
                            chronicAbsentees.push(member[0]); // member[0] is the name column
                        }
                    }
                });

                // Calculate attendance rate
                const totalMembers = members.length;
                const attendanceRate = totalMembers > 0 ? (presentCount / totalMembers) * 100 : 0;

                // Add to summary sheet
                summarySheet.getRange(summaryRow, 1, 1, 8).setValues([[
                    cellGroup,
                    formattedLastUpdated,
                    totalMembers,
                    presentCount,
                    absentCount,
                    Math.round(attendanceRate * 10) / 10,
                    chronicAbsentees.length,
                    chronicAbsentees.join(', ')
                ]]);

                summaryRow++;
            }
        });

        // Add conditional formatting for attendance rate
        if (summaryRow > 2) {
            const rateRange = summarySheet.getRange(`F2:F${summaryRow-1}`);

            const rules = [
                SpreadsheetApp.newConditionalFormatRule()
                    .whenNumberGreaterThanOrEqualTo(90)
                    .setBackground('#b7e1cd')
                    .setRanges([rateRange])
                    .build(),
                SpreadsheetApp.newConditionalFormatRule()
                    .whenNumberBetween(70, 90)
                    .setBackground('#fce8b2')
                    .setRanges([rateRange])
                    .build(),
                SpreadsheetApp.newConditionalFormatRule()
                    .whenNumberLessThan(70)
                    .setBackground('#f4c7c3')
                    .setRanges([rateRange])
                    .build()
            ];

            summarySheet.setConditionalFormatRules(rules);
        }

        Logger.log('Attendance Summary updated successfully');
    } catch (error) {
        // Log the full error details
        Logger.log('Error in updateAttendanceSummary: ' + error.toString());
        Logger.log('Error stack: ' + error.stack);

        // Optional: Send an error notification email
        MailApp.sendEmail({
            to: "izuchukwunwankwo@yahoo.com",
            subject: "Attendance Summary Update Error",
            body: "An error occurred during the attendance summary update: " + error.toString()
        });
    }
}

function initializeAttendanceSheets() {
    try {
        const form = FormApp.getActiveForm();
        if (!form) {
            throw new Error('Could not find active form');
        }

        const ss = SpreadsheetApp.openById(form.getDestinationId());

        // Delete existing triggers
        const triggers = ScriptApp.getProjectTriggers();
        triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));

        // Form submission trigger
        ScriptApp.newTrigger('onFormSubmit')
            .forForm(form)
            .onFormSubmit()
            .create();

        // Daily summary update trigger
        ScriptApp.newTrigger('updateAttendanceSummary')
            .timeBased()
            .everyDays(1)
            .atHour(1)
            .create();

        // Weekly email summary trigger (every Sunday at 6 PM)
        ScriptApp.newTrigger('sendAttendanceSummaryEmail')
            .timeBased()
            .onWeekDay(ScriptApp.WeekDay.SUNDAY)
            .atHour(18)
            .create();

        // Run the update immediately after initialization
        updateAttendanceSummary(ss);

        Logger.log('Attendance sheets initialized successfully');
    } catch (error) {
        Logger.log('Initialization error: ' + error.toString());
        Logger.log('Error stack: ' + error.stack);
    }
}