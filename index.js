const { App } = require('@slack/bolt');
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

(async () => {
	await app.start(process.env.PORT || 3300);
	const meeting = require('google-meet-api').meet;
	const clientId = Math.random.toString(32).substring(2);

  console.log('⚡️ Bolt app is running!');
})();
