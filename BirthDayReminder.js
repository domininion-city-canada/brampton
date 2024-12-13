/**
 * Birthday Notification System
 * Handles MM/DD format birthdays from Google Form responses
 * Sends weekly, monthly, and reminder notifications
 */

const CONFIG = {
    SHEET_NAME: "membership_responses",  // Update this to match your sheet name
    EMAIL_RECIPIENTS: [
        "osisioguugochi@gmail.com",
        "samuelakuma130@gmail.com",
        "followup.dominioncitybrampton@gmail.com",
        "emmasite@gmail.com",
        "chidinma.modest1@gmail.com",
        "ivie.onosia@yahoo.com",
        "izuchukwunwankwo@yahoo.com",
        "demolaashaye@gmail.com",
        "secretlifeofmanuel@gmail.com",
        "dominioncitybrampton@gmail.com",
        "favoroma6@gmail.com",
        "ikechukwuakuma316@gmail.com"
    ].join(", ")
};

/**
 * Main function to send birthday notifications
 * Should be scheduled to run daily
 */
function sendBirthdayNotifications() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    const data = sheet.getDataRange().getValues();

    const today = new Date();
    const dates = calculateRelevantDates(today);

    const birthdays = processbirthdays(data, dates.thisSunday, dates.nextSunday);

    // Send appropriate notifications based on current date
    sendWeeklyNotifications(birthdays.weekly, today);
    sendMonthlyNotifications(birthdays.monthly, today);
    sendSundayBirthdayReminders(birthdays.weekly, today);
}

/**
 * Calculate relevant dates for notifications
 */
function calculateRelevantDates(today) {
    const thisSunday = new Date(today);
    thisSunday.setDate(today.getDate() - today.getDay()); // Get this week's Sunday

    const nextSunday = new Date(thisSunday);
    nextSunday.setDate(thisSunday.getDate() + 7);

    return { thisSunday, nextSunday };
}

/**
 * Convert MM/DD string to Date object for current year
 */
function parseBirthday(birthdayStr) {
    try {
        const [month, day] = birthdayStr.split('/').map(num => parseInt(num));
        const today = new Date();
        return new Date(today.getFullYear(), month - 1, day);
    } catch (error) {
        Logger.log(`Error parsing birthday: ${birthdayStr}`);
        return null;
    }
}

/**
 * Process birthdays from sheet
 */
function processbirthdays(data, thisSunday, nextSunday) {
    const weeklyBirthdays = [];
    const monthlyBirthdays = [];
    const today = new Date();

    // Skip header row
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const [timestamp, firstName, lastName, email, phone, gender, birthdayStr, address, city] = row;

        // Skip if birthday is empty
        if (!birthdayStr) continue;

        const birthDate = parseBirthday(birthdayStr);
        if (!birthDate) continue; // Skip if birthday couldn't be parsed

        const fullName = `${firstName} ${lastName}`;

        // Check for weekly birthdays
        if (birthDate >= thisSunday && birthDate < nextSunday) {
            weeklyBirthdays.push({
                name: fullName,
                date: birthDate,
                isSunday: birthDate.getDay() === 0
            });
        }

        // Check for monthly birthdays
        if (birthDate.getMonth() === today.getMonth()) {
            monthlyBirthdays.push({
                name: fullName,
                date: birthDate
            });
        }
    }

    return { weekly: weeklyBirthdays, monthly: monthlyBirthdays };
}

/**
 * Send weekly birthday notifications
 */
function sendWeeklyNotifications(weeklyBirthdays, today) {
    if (today.getDay() === 0 && weeklyBirthdays.length > 0) {
        const subject = "🎂 Dominion City Brampton - Upcoming Birthdays This Week";
        const message = formatBirthdayMessage(weeklyBirthdays, "weekly");
        sendEmail(subject, message);
    }
}

/**
 * Send monthly birthday notifications
 */
function sendMonthlyNotifications(monthlyBirthdays, today) {
    if (today.getDate() === 1 && monthlyBirthdays.length > 0) {
        const subject = "📅 Dominion City Brampton - Birthdays This Month";
        const message = formatBirthdayMessage(monthlyBirthdays, "monthly");
        sendEmail(subject, message);
    }
}

/**
 * Send reminders for Sunday birthdays
 */
function sendSundayBirthdayReminders(weeklyBirthdays, today) {
    const sundayBirthdays = weeklyBirthdays.filter(b => b.isSunday);

    sundayBirthdays.forEach(birthday => {
        const reminderDate = new Date(birthday.date);
        reminderDate.setDate(birthday.date.getDate() - 3);

        if (reminderDate.toDateString() === today.toDateString()) {
            const subject = "⚠️ Dominion City Brampton - Upcoming Sunday Birthday Reminder!";
            const message = `Reminder: ${birthday.name}'s birthday is this Sunday (${birthday.date.toDateString()})!`;
            sendEmail(subject, message);
        }
    });
}

/**
 * Format birthday messages
 */
function formatBirthdayMessage(birthdays, type) {
    const header = type === "weekly"
        ? "Here are the birthdays coming up this week:\n\n"
        : `Here are all the birthdays for ${new Date().toLocaleString('default', { month: 'long' })}:\n\n`;

    const birthdayList = birthdays
        .map(b => `📌 ${b.name}: ${b.date.toDateString()}`)
        .join('\n');

    return header + birthdayList;
}

/**
 * Send email wrapper function
 */
function sendEmail(subject, message) {
    MailApp.sendEmail({
        to: CONFIG.EMAIL_RECIPIENTS,
        subject: subject,
        body: message
    });
}

/**
 * Create time-driven trigger to run the script daily
 */
function createDailyTrigger() {
    // Delete any existing triggers
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));

    // Create a new daily trigger
    ScriptApp.newTrigger('sendBirthdayNotifications')
        .timeBased()
        .everyDays(1)
        .atHour(1) // Run at 1 AM
        .create();
}

/**
 * Debug function to test the system
 */
function debugBirthdaySystem() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) {
        Logger.log("ERROR: Could not find sheet named: " + CONFIG.SHEET_NAME);
        return;
    }

    const data = sheet.getDataRange().getValues();
    Logger.log("Total rows in sheet: " + data.length);

    // Log first few rows to verify data
    Logger.log("\nSample data:");
    data.slice(0, 3).forEach((row, index) => {
        Logger.log(`Row ${index}: First Name=${row[1]}, Last Name=${row[2]}, Birthday=${row[6]}`);
    });

    // Test for this week
    const today = new Date();
    const dates = calculateRelevantDates(today);
    const birthdays = processbirthdays(data, dates.thisSunday, dates.nextSunday);

    Logger.log("\nChecking for birthdays:");
    Logger.log("This Sunday: " + dates.thisSunday.toDateString());
    Logger.log("Next Sunday: " + dates.nextSunday.toDateString());

    Logger.log("\nWeekly birthdays found:");
    birthdays.weekly.forEach(b => {
        Logger.log(`${b.name}: ${b.date.toDateString()}`);
    });

    Logger.log("\nMonthly birthdays found:");
    birthdays.monthly.forEach(b => {
        Logger.log(`${b.name}: ${b.date.toDateString()}`);
    });

    // Send test email if birthdays were found
    if (birthdays.weekly.length > 0 || birthdays.monthly.length > 0) {
        const message = "Test Results:\n\n" +
            "Weekly Birthdays:\n" +
            birthdays.weekly.map(b => `${b.name}: ${b.date.toDateString()}`).join('\n') +
            "\n\nMonthly Birthdays:\n" +
            birthdays.monthly.map(b => `${b.name}: ${b.date.toDateString()}`).join('\n');

        MailApp.sendEmail({
            to: CONFIG.EMAIL_RECIPIENTS,
            subject: "Birthday System Test Results",
            body: message
        });
        Logger.log("\nTest email sent!");
    } else {
        Logger.log("\nNo birthdays found for current period.");
    }
}