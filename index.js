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
		schedule.scheduleJob({ hour: 7, minute: 50 }, () => {
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

// message機能で平日のみ発信させる
app.message('test', async({ message, say }) => {

	// const day = new Date();
	// day.setHours(1, 29, 0);

	// try {
	// 	const result = await client.chat.scheduleMessage({
	// 		channel: channelId,
	// 		text: 'hoge',
	// 		post_at: day.getTime() / 1000
	// 	});

	// 	console.log(result);
	// } catch (error) {
	// 	console.log(error);
	// }

	// const message =
	const channelId = 'C01TADN4HDW';

	try {
		const date = new Date();

		// 曜日判定
		const day = date.getDay();

		// 祝日判定
		const holiday = japaneseHoliday.isHoliday(date);

		// date.setHours(7, 50, 0);
		const hour = date.setHours(1, 59, 0);

		console.log(hour)

		// const message = await client.chat.postMessage({
		const result = await client.chat.scheduleMessage({
			token: botToken,
			channel: channelId,
			text: "Hello, World",
			post_at: date.getTime() / 1000
		});

		console.log(result);

		// if (holiday) {
		// 	console.log('祝日です')
		// } else if (day != 6 || day != 7) {
		// 	// メッセージを送る時間の設定
		// 	// console.log('平日です')
		// } else {
		// 	console.log('土日です')
		// }
	}
	catch (error) {
		console.error(error);
	}
});

(async () => {
	await app.start(process.env.PORT || 3300);

  console.log('⚡️ Bolt app is running!');
})();
