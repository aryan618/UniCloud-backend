const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

require('dotenv').config();

const express = require('express');

const app = express();
const port = 3000;

const stringsession = new StringSession(""); // You should put your string session here

let apiId= 928403;
let apiHash = "4a546388b91f6f815c4a6adbbc30d574";

let clients = {};

app.use(express.json());

app.get('/',(req,res)=>{
    res.status(200).send(`Server Running`);
})

app.post('/send_otp',async (req,res)=>{
    const {phone_number} = req.body;
    try{
        let client = new TelegramClient(stringsession, apiId, apiHash, {});
        
        await client.connect();
        const result = await client.invoke(
                new Api.auth.SendCode({
                 phoneNumber:phone_number,
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
        clients[phone_number]=client;
        await client.disconnect();
        res.status(200).json({message:`Sent otp successfully`,phone_code_hash:result.phoneCodeHash, phone_number:result.phoneNumber});
        
    } catch (error) {
      if (error.phone_code_expired){
        res.status(429).json({error:`OTP expired`});
      }
      else if (error.phone_number_invalid){
        res.status(401).json({error:`Internal servor error`});
      }
        res.status(500).json({ error: 'Internal Server Error' });
      }
})

app.post('/sign_in',async (req,res)=>{
    const {phone_code_hash,phone_number, code}= req.body;
    try{
        let client = clients[phone_number];
        await client.connect();
        const result = await client.invoke(
            new Api.auth.SignIn({
              phoneNumber: phone_number,
              phoneCodeHash: phone_code_hash,
              phoneCode: code,
            })
          );
        const sessionString=client.session.save();
        console.log(sessionString);
        res.status(200).json({message:`Connected successfully`,session:sessionString});
        await client.disconnect();
        delete clients[phoneNumber];

    } catch(error){
      
      console.log(error);
        res.status(500).json({error:`Internal servor error`});
    }
})

app.get('/send',async (req,res)=>{
    try{
      let session = req.headers['auth'];
      let client = new TelegramClient(new StringSession(session), apiId, apiHash, {});
      await client.connect();
        await client.sendMessage('me',{message:`Hello bete`});
        res.status(200).json({message:`Welcome message sent successfully`});
    } catch(error){
      console.log(error);
        res.status(500).json({error:`Internal servor error in sending message`});
    }

})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
  
