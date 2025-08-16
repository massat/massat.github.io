// https://forms.gle/KTuzM4xJoTm2MWD78
function onFormSubmit(e) {
  const SLACK_WEBHOOK_URL = "";

  const responses = e.response.getItemResponses();
  const answers = responses.map((response) => {
    const question = response.getItem().getTitle();
    const answer = response.getResponse();
    return `*${question}:*\n${answer}`;
  });

  // Slack通知内容の作成
  const slackPayload = {
    channel: "#問い合わせ",
    text: "🔔 新規案件のお問い合わせ",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: answers.join("\n\n"),
        },
      },
    ],
  };

  // Slackに送信
  UrlFetchApp.fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(slackPayload),
  });
}
