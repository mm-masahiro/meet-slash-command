const { App } = require('@slack/bolt');
const japaneseHoliday = require('japanese-holidays');
const schedule = require('node-schedule');
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const botToken = process.env.SLACK_BOT_TOKEN;
const signingSecret = process.env.SLACK_SIGNING_SECRET;

const app = new App({
	token: botToken,
	signingSecret: signingSecret
});

// message機能で平日のみ発信させる
app.message('test', async({ message, say }) => {

	// const message =
	const channelId = 'C01TADN4HDW';

	try {
		const message = await client.chat.postMessage({
			channel: channelId,
			text: "Hello, World"
		})
		// const date = new Date();
		const date = new Date("2021/6/19");
		// 曜日判定
		const day = date.getDay();
		// 祝日判定
		const holiday = japaneseHoliday.isHoliday(date);

		if (holiday) {
			console.log('祝日です')
		} else if (day != 6 || day != 7) {
			console.log('平日です')
		} else {
			console.log('土日です')
		}
	}
	catch (error) {
		console.error(error);
	}
});

const myjpb = schedule.scheduleJob({ hour: 8, minute: 00 }, () => {
	const body = {
		token: botToken,
		channel: '#pick-news',
		text:'おはようございます！',
	}
	axios.post('https://slack.com/api/chat.postMessage', qs.stringify(body));

});

(async () => {
	await app.start(process.env.PORT || 3300);

  console.log('⚡️ Bolt app is running!');
})();
