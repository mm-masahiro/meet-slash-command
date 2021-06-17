const { App } = require('@slack/bolt');

const app = new App({
	token: process.env.SLACK_BOT_TOKEN,
	signingSecret: process.env.SLACK_SIGNING_SECRET,
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
]

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
})


(async () => {
	await app.start(process.env.PORT || 3300);
	console.log('⚡️ Bolt app is running!');
})();
