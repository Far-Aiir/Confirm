# Confirm
A simple Discord bot that sets a password on a server.
## Setting it up
### DB:
I used MongoDB (mongod) and Robo 3T you can google how to set these up, but here are links.

[MongoDB](https://treehouse.github.io/installation-guides/windows/mongo-windows.html),

[Robo3T](https://robomongo.org/)

I am going to assume you have these setup, now after running Mongod you can open Robo 3T and make a connection under localhost:27017
and save it.

If you're using a VPS, you're going to want to click authentication and type the Database you setup, after type the password that
you set used while setting up MongoDB on the server along with the user name. Save it and connect.

After connecting you're going to want to create a Database by right clicking the connections name and clicking, "Create Database"
Name the database __carefully__ as that's what you're going to put in the settings.json file later on.

Now, lets create two collections, click on "Collections" and right click. Next press, "Create Collection" and name this __carefully__ 
because we're putting the name of these two collections inside the settings.json file.
Ex: 

Collection One: user

Collection Two: confirm

I will use this as future reference, whenever you see these used, put whatever you named them instead or the same thing if you didn't change
it.

### settings.json
What you should see when you open settings.json

```json
{
  "token": "YourBotsTokenGoesHere",
  "logging": "TheChannelYouWantToLogStuffIn",
  "suggestions": "Your channel for suggestions.",
  "prefix": "YourPrefix (I used c/)",
  "ownerID": "YourID",
  "db": { 
    "user": "DBUsername",
    "password": "DBPassword",
    "DatabaseIP": "localhost",
    "DatabasePort": "27017",
    "Database": "YourDBName",
    "userCollection": "Your collection to save user info. Ex: 'user'.",
    "PasswordCollection": "Your collection to save server info. Ex: 'confirm'" 
  }
}
```

Here is how it should look after setting it up.

```json
{
    "token": "hDjnWgs@-2w098IbkEs7hnsGFhjnlsjiFFsW_",
    "logging": "432667648719978508",
    "suggestions": "470603697915691018",
    "prefix": "c/",
    "ownerID": "217215496267890689",
    "db": { 
      "user": "Aiir",
      "password": "DBPassword",
      "DatabaseIP": "localhost",
      "DatabasePort": "27017",
      "Database": "Acme",
      "userCollection": "user",
      "PasswordCollection": "confirm" 
    }
}
```

Obviously the token isn't real.

After setting this up, make sure you have [NodeJS](https://nodejs.org/en/) installed. open command prompt or terminal and cd
into the directory where you have the bot. and type: ```npm install``` which should install all of the dependencies that you need to run the
bot as long as you didn't delete package.json

## Starting the bot.
It's really easy, all you have to do is type: ```node Run.js```
# Some quick notes.

1: __Don't attempt to sell this__

2: __Don't claim this as your own__

3: __Yes, I know my code is pretty sloppy, I made this about a year ago for fun when I was still learning JavaScript.__

4: __Yes, I know there are bugs and some commands might not work 100%. But, I lost all interest in this and won't be fixing or continuing this.__
# Made by Far Aiir#9434 (217215496267890689)








