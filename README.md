# Posa

Lightweight, offline-first cat tracker built with React Native and Expo. Create cats, log encounters with photos, and browse details in a clean, responsive UI.

This app stores everything locally on your device (AsyncStorage). No backend, no accounts, just your data.

## Features

- Add, edit, and delete cats with photos
- Log encounters with date, notes, and image(s)
- Press an encounter photo to view it fullscreen
- Fully responsive layout via a tiny custom scaling utility (`scaling.js`)
- Fast image handling with Expo Image Picker and Image Manipulator
- Persistent storage on device using `@react-native-async-storage/async-storage`
- Smooth navigation with `@react-navigation/native-stack`

## Tech Stack

- React Native 0.81.5 + React 19.1.0
- Expo SDK 54.0.21
- Navigation: `@react-navigation/native` and `@react-navigation/native-stack`
- Storage: `@react-native-async-storage/async-storage`
- Images: `expo-image-picker`, `expo-image-manipulator`
- Build/Distribution: EAS Build (Expo Application Services)

## Project Structure

```
App.js
app.json
CatContext.js
index.js
package.json
styles.js
theme.js
scaling.js                 # custom responsive scaling utility
assets/
	adaptive-icon.png
	favicon.png
	icon.png
	splash-icon.png
	applogo.png             # app icon used for adaptive icon & icon
components/
	CatCard.js
	EncounterCard.js
screens/
	AddCatScreen.js
	AddEncounterScreen.js
	CatDetailScreen.js
	HomeScreen.js
```

## Configuration (from `app.json`)

- Name/Slug: `Posa`
- Package (Android): `com.Aeron29.Posa`
- Icons:
	- `icon`: `./assets/applogo.png`
	- `android.adaptiveIcon.foregroundImage`: `./assets/applogo.png`
	- `android.adaptiveIcon.backgroundColor`: `#F3E5D8`
- Splash: `./assets/splash-icon.png` (contain, white background)
- EAS Project ID: `212526b6-f827-4d77-a50a-4d20b329a64c`

## Getting Started (Windows + PowerShell)

Prerequisites:

- Node.js 18+ and npm
- Git
- Expo CLI (installed automatically via npx) and EAS CLI (`npm i -g eas-cli`) for builds

Install dependencies:

```powershell
cd "c:\Users\Aeron Jay\Posa"
npm install
```

Run the app in development:

```powershell
npm run start           # starts the Expo dev server
npm run android         # shortcut: start + open Android target
```

Tip: You can use Expo Go on your Android device to scan the QR and run instantly during development.

## Building an Android APK with EAS

EAS handles signing, building, and hosting artifacts. The project already has a working `preview` profile.

1) Log in and configure (first time only):

```powershell
eas login
eas build:configure
```

2) Start a preview build for Android (APK):

```powershell
eas build --platform android --profile preview
```

3) Watch progress and fetch the download link:

```powershell
eas build:list --limit 1
```

Notes:

- Free plans allow only one concurrent build. If you see: “Build concurrency limit reached…”, wait for the running build to finish or cancel it:

	```powershell
	eas build:cancel
	```

- When a build finishes, `Application Archive URL` will show the APK link.
- If a build appears stuck, cancel it and trigger a fresh build.

Recent working artifact for reference: https://expo.dev/artifacts/eas/K1bRFDUw17qE5sMv6JDg7.apk

## Responsive Scaling (no external library)

All sizes use a small helper to keep UI proportional across devices. See `scaling.js`:

- `scale(size)`: horizontal scaling from a 350px base width
- `verticalScale(size)`: vertical scaling from a 680px base height
- `moderateScale(size, factor=0.5)`: gentle scaling for fonts/margins

Usage example:

```js
import { scale, verticalScale, moderateScale } from "./scaling";

const styles = StyleSheet.create({
	card: { padding: scale(12), borderRadius: scale(12) },
	avatar: { width: scale(56), height: scale(56), borderRadius: scale(28) },
	title: { fontSize: moderateScale(16) },
	spacer: { height: verticalScale(8) },
});
```

## Data Persistence and Reset

- Data is stored locally on the device via AsyncStorage.
- Uninstalling the app may not always clear all app data on some Android devices.

To guarantee a fresh start on Android:

1. Open Settings → Apps → Posa
2. Storage & cache → Clear storage (or Clear data)
3. Reinstall or open the app again

Optional (ADB):

```powershell
adb shell pm clear com.Aeron29.Posa
```

If you see “adb not recognized”, install Android Platform Tools and add them to your PATH.

## Troubleshooting

### App icon not showing / wrong icon

- Confirm `app.json` uses `android.adaptiveIcon.foregroundImage: ./assets/applogo.png` and a matching background color.
- Uninstall the app, clear app data, and reinstall the latest APK.
- Android launchers can cache icons—if needed, clear launcher cache or reboot the device.

### Build concurrency limit reached

- Only one build runs at a time on free plans. Either wait, or cancel the in‑progress/queued build:

```powershell
eas build:list
eas build:cancel
```

### ADB not recognized

- Install Android SDK Platform Tools (Google), then add the `platform-tools` folder to your PATH. Re‑open PowerShell.

### “Fresh install” still shows old data

- Clear app storage from device settings (see Data Persistence and Reset). Uninstalling alone may not be enough on some devices.

## Scripts

```json
{
	"scripts": {
		"start": "expo start",
		"android": "expo start --android",
		"ios": "expo start --ios",
		"web": "expo start --web"
	}
}
```

## Privacy

All data is stored locally on the device. No external servers are used by default.

## License

Licensed under the Zero-Clause BSD (0BSD). See the `license` field in `package.json` for details.

## Credits

- Built with Expo and React Native
- Icons and splash configured via `app.json` and `assets/`

---

If you run into anything not covered here, open an issue or reach out with your exact error message and device details.
