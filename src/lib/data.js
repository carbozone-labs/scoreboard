export const CSV_HEADERS = [
  'User Name',
  'User Email',
  'Access Code Redemption Status',
  'GEAR Digital Badges Earned',
  '# of Skill Badges Completed',
  '# of Arcade Games Completed',
  'Google Skills Profile URL Status',
  'Google Developer Profile URL Status',
  'AI Agent Verification Status',
  'General Milestone Earned',
  'Bonus Milestone Earned',
];

export const COLORS = {
  gold: '#FFB347',
  cyan: '#4FD1E8',
  green: '#39E88F',
  red: '#FF5C6C',
  muted: '#8792A6',
  border: '#212B40',
};

export const COHORT_MILESTONES = [
  { id: 'm1', label: 'Milestone #1', games: 600, badges: 1800, color: '#4FD1E8' },
  { id: 'm2', label: 'Milestone #2', games: 800, badges: 3400, color: '#FFB347' },
  { id: 'm3', label: 'Milestone #3', games: 1000, badges: 5000, color: '#39E88F' },
  { id: 'ultimate', label: 'Ultimate Milestone', games: 1200, badges: 6600, color: '#FF5C6C' },
];

export const INDIVIDUAL_ULTIMATE = { games: 12, badges: 66 };

export const PROGRAM_DEADLINE = '2026-09-14T23:59:59';

export const FACILITATORS = [
  { name: 'Aniket Shaha' },
  { name: 'Atharv Ekavire' },
];

export const WEEKDAYS = [
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
  { value: '0', label: 'Sunday' },
];

export const DEFAULT_SETTINGS = {
  facilitatorNames: 'Aniket Shaha & Atharv Ekavire',
  programLink: 'https://goo.gle/arcade-facilitator',
  referralCode: 'XXX',
  onboardingDate: '',
  onboardingTime: '',
  onboardingLink: '',
  chatPlatform: 'WhatsApp',
  chatLink: 'https://chat.whatsapp.com/EuX9GZGWzKqJvxSnBONeum?s=cl&p=i&ilr=4',
  deckLink: '',
  recordingLink: '',
  gameLink: '',
  officeHoursDate: '',
  officeHoursTime: '',
  officeHoursLink: '',
  syllabusLink: '',
  deadlineDate: '14th September',
  profileFormLink: 'https://forms.gle/VnBCWXJv1jctshTv9',
  creditsVideoLink: 'https://youtu.be/O4iuDOCr234?si=KZyP-w6Bq4Qc6anr',
  weeklyReminderEnabled: false,
  weeklyReminderDay: '1',
  weeklyReminderTemplateId: 'skill_badges_reminder',
};

export const SETTINGS_FIELDS = [
  ['facilitatorNames', 'Facilitator name(s) & email(s)'],
  ['programLink', 'Program enrollment link'],
  ['referralCode', 'Referral code'],
  ['onboardingDate', 'Onboarding session date'],
  ['onboardingTime', 'Onboarding session time'],
  ['onboardingLink', 'Onboarding session link'],
  ['chatPlatform', 'Chat platform name (e.g. WhatsApp)'],
  ['chatLink', 'Chat group link'],
  ['deckLink', 'Session deck link'],
  ['recordingLink', 'Session recording link'],
  ['gameLink', 'First game link'],
  ['officeHoursDate', 'Office hours date'],
  ['officeHoursTime', 'Office hours time'],
  ['officeHoursLink', 'Office hours link'],
  ['syllabusLink', 'Program syllabus link'],
  ['deadlineDate', 'Program deadline date'],
  ['profileFormLink', 'Profile URL correction form link'],
  ['creditsVideoLink', '750-credits redemption video link'],
];

// Common announcements sent to the whole cohort at once (BCC blast), not per-person.
// Only {{placeholders}} filled from settings — no [[per-person]] fields here since
// there's no single recipient to merge them for.
export const COMMON_ANNOUNCEMENTS = [
  {
    id: 'join_community',
    label: 'Join Community',
    subject: 'Join the online chat community on {{chatPlatform}} | Google Cloud Arcade Facilitator program',
    body: `Hi everyone,

We hope you've started the program and are actively working on your badges and milestones.

We want to make sure you get as much support as possible from us, so we've created an online chat community on {{chatPlatform}} where we can address your doubts faster.

Join the community here - {{chatLink}} - and post your first message to join the discussion.

See you in the community,
{{facilitatorNames}}`,
  },
  {
    id: 'monthly_game',
    label: "This Month's Game",
    subject: 'New Arcade Game Available This Month | Google Cloud Arcade Facilitator program',
    body: `Hi everyone,

A new Arcade game has been added this month. Completing it keeps your progress moving toward your next milestone and earns you more points.

Get started here - {{gameLink}}

If you have any trouble, reach out on our chat group - {{chatLink}}

Happy learning,
{{facilitatorNames}}`,
  },
  {
    id: 'skill_badges_reminder',
    label: 'Skill Badges Reminder',
    subject: 'Keep Completing Your Skill Badges | Google Cloud Arcade Facilitator program',
    body: `Hi everyone,

Just a reminder to keep completing your Skill Badges - every badge counts toward your milestone progress and Arcade Points.

Check the full program syllabus here - {{syllabusLink}}

You have until {{deadlineDate}} to complete your milestones, so don't wait until the last moment.

Keep going,
{{facilitatorNames}}`,
  },
  {
    id: 'deadline_reminder',
    label: 'Deadline Reminder',
    subject: 'Program Deadline Reminder | Google Cloud Arcade Facilitator program',
    body: `Hi everyone,

This is a reminder that the program deadline is {{deadlineDate}}. Please make sure your badges and games are up to date before then to claim your Arcade + Bonus Points.

As always, reach out on our chat group - {{chatLink}} - with any questions.

Thanks,
{{facilitatorNames}}`,
  },
  {
    id: 'welcome_message',
    label: 'Welcome Message',
    subject: 'Welcome to the Cohort! | Google Cloud Arcade Facilitator program',
    body: `Hi everyone,

Welcome aboard! We're excited to have you in this cohort. Redeem your access code and get started with your first Skill Badge today.

Enrollment link - {{programLink}}
Chat community - {{chatLink}}

Cheers,
{{facilitatorNames}}`,
  },
];

// Official Google Cloud Arcade Facilitator program email templates, grammar-polished.
// {{placeholders}} are filled from settings; [[placeholders]] are filled per-person.
export const EMAIL_TEMPLATES = [
  {
    id: 'enroll',
    label: 'Enroll in the Program',
    personal: false,
    subject: 'Enroll in the Google Cloud Arcade Facilitator Program and earn Arcade Bonus Points',
    body: `Dear [[First Name]],

We're delighted to share that we've been selected as one of a select few teams worldwide to host the Google Cloud Arcade Facilitator program in partnership with Google.

As part of the program, you'll get the chance to begin your journey in cloud and AI, with hands-on practice on Google Cloud - the platform that powers products like Google Search, Gmail, Gemini, and YouTube. Along the way, you'll learn and practice concepts such as agentic AI, computing, application development, big data, and machine learning on the cloud. If you ever get stuck, your facilitators are here to help:

{{facilitatorNames}}

You can find more information about the program and register on its website here - {{programLink}}. Please use our referral code - {{referralCode}} - while enrolling.

Feel free to reply to this email with any questions or concerns. We'll invite you to an onboarding session and share more details once you're enrolled.

See you in the cloud,
Your Google Cloud Arcade Facilitators`,
  },
  {
    id: 'onboarding_invite',
    label: 'Invite to Onboarding Session',
    personal: false,
    subject: 'Attend your onboarding session for the Google Cloud Arcade Facilitator program',
    body: `Dear [[First Name]],

Thank you for enrolling in the Google Cloud Arcade Facilitator program. We're excited to have you on board and can't wait to see you begin your journey in cloud and AI.

Please join the onboarding session, organized by your facilitators, on {{onboardingDate}} at {{onboardingTime}} using the following link - {{onboardingLink}}. (You'll receive a calendar invite for this shortly.)

Also, please join our chat group here - {{chatLink}} - so you can stay in touch with us and get your doubts and issues resolved quickly.

See you in the session,
Your Google Cloud Arcade Facilitators`,
  },
  {
    id: 'follow_up',
    label: 'Follow-up After Session',
    personal: false,
    subject: 'Thank you for attending the onboarding session | Google Cloud Arcade Facilitator program',
    body: `Dear [[First Name]],

Thank you for attending the onboarding session for the Google Cloud Arcade Facilitator program. We hope you're excited to earn those amazing prizes and start your journey in cloud and AI.

You can find the session deck and recording here - Deck: {{deckLink}} | Recording: {{recordingLink}}

Next steps:
1. Go back and complete the game we showed you during the session to earn your first digital badge - {{gameLink}}
2. Let us know on the chat group - {{chatLink}} - if you get stuck or need any help.
3. Complete all the badges in the program syllabus to earn your prizes.

All the best & happy learning,
Your Google Cloud Arcade Facilitators`,
  },
  {
    id: 'chat_community',
    label: 'Join Chat Community',
    personal: false,
    subject: 'Join the online chat community on {{chatPlatform}} | Google Cloud Arcade Facilitator program',
    body: `Dear [[First Name]],

We hope that by now you've started the program and are actively working on your badges and milestones.

We want to make sure you get as much support as possible from us, so we've created an online chat community on {{chatPlatform}} where we can address your doubts faster.

Join the community here - {{chatLink}} - and post your first message to join the discussion.

See you in the community,
Your Google Cloud Arcade Facilitators`,
  },
  {
    id: 'office_hours',
    label: 'Join Office Hours',
    personal: false,
    subject: 'Join office hours and get your doubts cleared | Google Cloud Arcade Facilitator program',
    body: `Dear [[First Name]],

To support you in the Google Cloud Arcade Facilitator program and help clear your doubts, we're organizing an office hours session on {{officeHoursDate}} at {{officeHoursTime}}. Please remember to join so we can help you complete your badges and milestones and earn Arcade + Bonus Points to redeem for exciting Google Cloud prizes.

Join the session using this link - {{officeHoursLink}}

As always, feel free to reach out to us on our chat group - {{chatLink}} - with any questions or queries.

All the best & happy learning,
Your Google Cloud Arcade Facilitators`,
  },
  {
    id: 'ultimate_milestone',
    label: 'Push Towards Ultimate Milestone',
    personal: false,
    subject: 'Make your way to the Ultimate Milestone | Google Cloud Arcade Facilitator Program',
    body: `Dear [[First Name]],

We hope you're enjoying the Google Cloud Arcade Facilitator program and are actively working on your badges and milestones. We wanted to highlight the "Ultimate Milestone" and its benefits - both in Arcade Bonus Points and knowledge gained.

The Ultimate Milestone - Complete Any 12 Arcade Games & 66 Skill Badges

The Ultimate Milestone was introduced to reward extra effort while setting you on a path toward a career in cloud. Completing it entitles you to:
- 12 games = 12 points
- 66 skill badges = 33 points
- Milestone completion = 35 bonus points
Total: 45 Arcade Points + 35 Bonus Points

Check out the program syllabus here to get started - {{syllabusLink}}

As always, feel free to reach out if you have any questions - we're happy to help.

All the best & see you in the cloud,
Your Google Cloud Arcade Facilitators`,
  },
  {
    id: 'access_code',
    label: 'Access Code Not Redeemed',
    personal: true,
    subject: 'Action needed: Redeem your Arcade access code | Google Cloud Arcade Facilitator Program',
    body: `Dear [[First Name]],

Thank you for enrolling in the Google Cloud Arcade Facilitator program using our referral code. We noticed that your Arcade access code hasn't been redeemed yet.

Redeeming your access code is the first step to unlocking the program's games and skill badges, so please complete it as soon as possible using the link below:

{{programLink}}

IMPORTANT: Claim your 750 Cloud Skills Boost credits first
Before starting any labs, please make sure you redeem your 750 Cloud Skills Boost credits from the "Congratulations" email sent by Google. These credits let you complete Skill Badges without spending your own money.

If you haven't redeemed them yet, watch this short video and follow the steps - {{creditsVideoLink}}

Please do not start any paid labs before claiming your 750 credits.

If you've already redeemed a code but it isn't reflecting in our records, or if you're facing any issues during redemption, please reply to this email and we'll help you sort it out.

You have until {{deadlineDate}} to redeem your code and complete the milestones to earn Arcade + Bonus Points, so please don't wait until the last moment.

As always, feel free to reach out to us on our chat group - {{chatLink}} - with any questions or queries.

All the best & happy learning,
Your Google Cloud Arcade Facilitators`,
  },
  {
    id: 'wrong_url',
    label: 'Wrong Public Profile URL',
    personal: true,
    subject: 'Action needed: Fix your profile URL | Google Cloud Arcade Facilitator program',
    body: `Dear [[First Name]],

Thank you for enrolling in the Google Cloud Arcade Facilitator program using our referral code. We're glad to have you on board, and we'll be your facilitators throughout the program - clearing any doubts and helping you earn those amazing prizes.

We noticed that your onboarding wasn't completed correctly, for the following reason:

[[Issue Reason]]

What to do next:
Please fill out this form with your correct profile URL so we can update our records - {{profileFormLink}}

Please reply to this email if you run into any problems while filling the form - we're happy to help.

Looking forward to hearing from you,
Your Google Cloud Arcade Facilitators`,
  },
  {
    id: 'zero_badges',
    label: 'No Badges Completed Yet',
    personal: true,
    subject: 'Start completing your badges & milestones | Google Cloud Arcade Facilitator Program',
    body: `Dear [[First Name]],

Thank you for enrolling in the Google Cloud Arcade Facilitator program. We noticed that you haven't completed any badges yet.

Please note that you have until {{deadlineDate}} to complete the milestones outlined in the points system, earn Arcade + Bonus Points, and redeem them for exciting Google Cloud prizes. We'd encourage you to get started as soon as possible.

As always, feel free to reach out to us on our chat group - {{chatLink}} - with any questions or queries.

All the best & happy learning,
Your Google Cloud Arcade Facilitators`,
  },
  {
    id: 'almost_there',
    label: 'Almost There - Few Badges Left',
    personal: true,
    subject: 'You are almost there to win your prizes | Google Cloud Arcade Facilitator Program',
    body: `Dear [[First Name]],

We noticed that you've already completed [[Games Completed]] games and [[Skill Badges Completed]] skill badges in the program, and you're just a few games and skill badges away from earning your milestone prizes. Great progress so far!

Please complete the remaining badges as soon as possible to claim your prizes. Note: you have until {{deadlineDate}} to complete the milestones outlined in the points system and redeem your Arcade + Bonus Points for exciting Google Cloud prizes.

As always, feel free to reach out to us on our chat group - {{chatLink}} - with any questions or queries.

All the best & happy learning,
Your Google Cloud Arcade Facilitators`,
  },
  {
    id: 'congratulations',
    label: 'Congratulations - Milestone Achieved',
    personal: true,
    subject: 'Congratulations! You have successfully achieved your milestone | Google Cloud Arcade Facilitator Program',
    body: `Dear [[First Name]],

Congratulations on successfully achieving your milestone in the Google Cloud Arcade Facilitator program! We're thrilled for you and can't wait for you to redeem your Arcade Points for prizes.

Please note that you'll be able to redeem your Arcade Points near the end of this year, once the prize counter opens, and have them delivered to you. In the meantime, we encourage you to keep learning - earn more badges on Google Skills Arcade to unlock even more points and prizes.

As always, feel free to reach out to us on our chat group - {{chatLink}} - with any questions or queries.

All the best & happy learning,
Your Google Cloud Arcade Facilitators`,
  },
];
