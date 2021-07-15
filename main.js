const { App } = require('@slack/bolt');
const japaneseHoliday = require('japanese-holidays');
const schedule = require('node-schedule');
const axios = require('axios');
const qs = require('qs');
const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

const botToken = process.env.SLACK_BOT_TOKEN;
const signingSecret = process.env.SLACK_SIGNING_SECRET;

const app = new App({
	token: botToken,
	signingSecret: signingSecret
});

const date = new Date();

// 曜日判定
const day = date.getDay();

// 祝日判定
const holiday = japaneseHoliday.isHoliday(date);

const myjob = () => {
	if (holiday) {
		console.log('祝日です')
	// 土曜日じゃない　かつ　日曜日でもない
	} else if (day !== 6 && day !== 0) {
		schedule.scheduleJob({ hour: 1, minute: 40 }, () => {
			const body = {
				token: botToken,
				channel: '#pick-news',
				text:'おはようございます！',
			}
			axios.post('https://slack.com/api/chat.postMessage', qs.stringify(body));
		});
	} else {
		console.log('土日です')
	}
}

myjob();

app.event('reaction_added', async ({ event, context }) => {
	const result = await app.client.chat.postMessage({
		token: botToken,
		channel: event.item.channel,
		text: 'リアクションしましたね？'
	});
});

(async () => {
	await app.start(process.env.PORT || 3300);

  console.log('⚡️ Bolt app is running!');
})();
