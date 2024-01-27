const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

const session = new StringSession(""); // You should put your string session here
let apiId=928403;
let apiHash = "4a546388b91f6f815c4a6adbbc30d574"
const client = 

(async function run() {
  await client.connect(); // This assumes you have already authenticated with .start()
    //console.log(client);
  const result = await client.invoke(
    new Api.auth.SignIn({
      phoneNumber: "+919140711022",
      phoneCodeHash: "5717ada8076d58fbe1",
      phoneCode: "71826",
    })
  );
  console.log(result); // prints the result
})();