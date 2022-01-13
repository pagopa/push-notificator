# Push Notificator
A utility that sends push notifications to your emulator. Supporting IOS only for now.

## Using it

The UI presents itself with three main inputs:
* the bundle ID that identifies your app
* the payload to be sent
* a simulator to send the notification to

<img width="608" alt="Screenshot 2022-01-11 at 15 53 03" src="https://user-images.githubusercontent.com/2094604/148965644-2234a5d1-74b5-493b-b338-934b9931d327.png">

Please check also [our internal HOWTO](https://pagopa.atlassian.net/wiki/spaces/IOAPP/pages/449839749/Test+Push+Notifications+nell+emulatore) and [the article that gave me the idea](https://betterprogramming.pub/how-to-send-push-notifications-to-the-ios-simulator-2988092ba931).

## Contributing

### Setup

1. install [Neutralinojs CLI](https://neutralino.js.org/docs/getting-started/your-first-neutralinojs-app#step-0-installing-neu-cli)
   1. `npm install -g @neutralinojs/neu`
2. in the project folder, execute 
   1. `neu update` only the first time
   2. `neu run` to execute the app

### Development

* files live under `/resources`
* please use just vanilla Javascript, CSS, HTML for the time being


# Credits

- project bootstrapped via [neutralinojs/neutralinojs-minimal)[https://github.com/neutralinojs/neutralinojs-minimal)
- `trayIcon.png` - Made by [Freepik](https://www.freepik.com) and downloaded from [Flaticon](https://www.flaticon.com)
