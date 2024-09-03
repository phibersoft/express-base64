# Express Base64
Very simple express server that can be used for Screenshot Automation. Take screenshots of mobile app with packages like `react-native-view-shot` and send base64 to this server so you don't have to struggle with mobile file systems.

## POST / [Body is base64]
- Saves the base64 image to "/uploads" folder
- Content-Type must be "text/plain"