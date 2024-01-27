const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();
const stringsession = new StringSession(""); // You should put your string session here
let apiId=process.env.apiId;
let apiHash = process.env.apiHash;

app.use(express.json());
app.get('/',(req,res)=>{
    res.status(200).send(`Wow the server is running da`);
})
// const client = new TelegramClient(session, apiId, apiHash, {});

// (async function run() {
//   await client.connect(); // This assumes you have already authenticated with .start()
//     console.log(client);
//   const result = await client.invoke(
//     new Api.auth.SendCode({
//       phoneNumber: "+917004232453",
//       apiId: apiId,
//       apiHash: apiHash,
//       settings: new Api.CodeSettings({
//         allowFlashcall: true,
//         currentNumber: true,
//         allowAppHash: true,
//         allowMissedCall: true,
//         logoutTokens: [Buffer.from("arbitrary data here")],
//       }),
//     })
//   );
//   console.log(result); // prints the result
// })();
let client=null;
app.post('/getOtp',async (req,res)=>{
    const {phoneNumber} = req.body;
    try{
         client = new TelegramClient(stringsession, apiId, apiHash, {});
        //client1={...client};
        await client.connect();
        const result = await client.invoke(
                new Api.auth.SendCode({
                 // phoneNumber: "+917004232453",
                 phoneNumber:phoneNumber,
                  apiId: apiId,
                  apiHash: apiHash,
                  settings: new Api.CodeSettings({
                    allowFlashcall: true,
                    currentNumber: true,
                    allowAppHash: true,
                    allowMissedCall: true,
                    logoutTokens: [Buffer.from("arbitrary data here")],
                  }),
                })
              );
        res.status(200).json({message:`Sent otp successfully`,result:result});
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
})

app.post('/login',async (req,res)=>{
    const {otp,phoneHash,phoneNumber}= req.body;
    try{
        //const client={...client1};
        console.log(client);
        await client.connect();
        const result = await client.invoke(
            new Api.auth.SignIn({
              phoneNumber: phoneNumber,
              phoneCodeHash: phoneHash,
              phoneCode: otp,
            })
          );
        const sessionString=client.session.save();
        console.log(sessionString);
        res.status(200).json({message:`Connected successfully`,session:sessionString});

    } catch(error){
        res.status(500).json({error:`Internal servor error`});
    }
})

app.get('/welcome-message',async (req,res)=>{
    try{
        await client.connect();
        await client.sendMessage('me',{message:`Hello bete`});
        res.status(200).json({message:`Welcome message sent successfully`});
    } catch(error){
        res.status(500).json({error:`Internal servor error in sending message`});
    }

})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
  
