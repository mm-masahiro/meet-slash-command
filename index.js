const { App } = require('@slack/bolt');
const japaneseHoliday = require('japanese-holidays');
require('dotenv').config();

const botToken = process.env.SLACK_BOT_TOKEN;
const signingSecret = process.env.SLACK_SIGNING_SECRET;

const app = new App({
	token: botToken,
	signingSecret: signingSecret
});

app.command('/meet', async ({ command, ack, say }) => {
  await ack();

	const meeting = require('google-meet-api').meet;

	console.log(meeting);

	await say(`meet: ${command.text}`);
});

app.event('reaction_added', async({ event, context }) => {
	const result = await app.client.chat.postMessage({
		token: context.botToken,
		channel: event.item.channel,
		text: `<@${event.user}> addded reaction! :${event.reaction}`
	});
	console.log(result);
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
		// // 曜日判定
		// const day = date.getDay();
		// // 祝日判定
		// const holiday = japaneseHoliday.isHoliday(date);

		// if (holiday) {
		// 	console.log('処理返さない')
		// } else if (day != 6 || day != 7) {
		// 	console.log('処理返す')
		// } else {
		// 	console.log('処理返さない')
		// }
	}
	catch (error) {
		console.error(error);
	}
});

(async () => {
	await app.start(process.env.PORT || 3300);
	const meeting = require('google-meet-api').meet;
	const clientId = Math.random.toString(32).substring(2);

  console.log('⚡️ Bolt app is running!');
})();
