# AdvancedSoftwareEngineering-Group3

## Run through the Expo  

Download Expo Go on the playstore or appstore then follow the instructions within `client/README.md` and `server/README.md` for more information on how to run the project.

## Package and deployment instructions
- To package the client, it must first be prebuilt using the command `npx expo prebuild`.
- Next, the client can be packaged using the command `eas build -p android --profile preview`.
- This will present a QR code and link, using which you can download and install the app to your device.
- The process is essentially the same for IOS but for it to work, an Apple Developer Account is required. We did not explore this route as it would have been an additional cost. We did however ensure that all functionality was cross platform.

## Notes
- Running the server locally will not be possible as you will not be able to connect to the Database without our input.
- After the demo our servers on Digital Ocean will be taken down as it is a payed service. All functionality will be displayed in the demo.
- An EAS account is required to package the app.