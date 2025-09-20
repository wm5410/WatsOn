to add
git add App.tsx index.js src package.json yarn.lock ios android .gitignore package-lock.json

to commit 
git commit -m "Initial commit with map view skeleton"





to start simulator
    open -a Simulator

run the app
    npx react-native run-ios




If you want to run on your iPhone:

Open the project in Xcode:
bash:
open ios/WatsOn.xcworkspace


Select the WatsOn target → Signing & Capabilities.

Under Team, pick your Apple ID.
(Add it in Xcode → Settings → Accounts if missing.)

Set a unique Bundle Identifier (e.g. com.yourname.watson).

Connect your iPhone with a cable, trust computer, enable Developer Mode on the device.

Select your iPhone as the build target in Xcode and press ▶ Run