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

schedule.scheduleJob({ hour: 21, minute: 03 }, () => {
	const body = {
		token: botToken,
		channel: '#pick-news',
		text:'test test',
		blocks: JSON.stringify(createBlocks())
	}

	axios.post('https://slack.com/api/chat.postMessage', qs.stringify(body));
});

const getRandomNum = (max) => {
	return Math.floor(Math.random() * Math.floor(max));
};

const restaurants = [
	{
		name: "リトル ダーリン コーヒー ロースターズ",
		url: "https://tabelog.com/tokyo/A1307/A130701/13225981/",
	},
	{
		name: "カフェ キツネ",
		url: "https://retty.me/area/PRE13/ARE23/SUB2303/100001513400/",
	},
	{
		name: "カフェ レジュ グルニエ",
		url: "https://retty.me/area/PRE13/ARE23/SUB2303/100000672929/",
	},
];

const createBlocks = () => {
	const restaurant = restaurants[getRandomNum(restaurants.length)];
	const blocks = [
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `${restaurant.url} | ${restaurant.name}`
			},
			accessory: {
				type: 'button',
				action_id: 'find_another',
				text: {
					type: 'plain_text',
					text: 'Show another'
				}
			}
		},
	]
}


app.command('/lunch', async({ ack, respond }) => {
	await ack();
	const restaurant = restaurants[getRandomNum(restaurants.length)];
	await respond({
		response_type: 'in_channel',
		blocks: [
			{
				type: 'mrkdown',
				text: `${restaurant}`
			}
		]
	})
	const rand = getRandomNum(100);
	await say(`${rand}`);
});

(async () => {
	await app.start(process.env.PORT || 3300);

  console.log('⚡️ Bolt app is running!');
})();
