# Leslie AI

## EAS Builds
eas build -p android --profile preview  
eas build -p android --profile preview --clear-cache  
npx expo start --dev-client  

## Clean & Rebuild
npx expo prebuild --clean  
npx expo run:android / npx expo run:ios  

## Run Android VM
Home: emulator -avd Medium_Phone_API_36  
ABC: emulator -avd Pixel_API_36  

## Set Env
eas env:create --name "key" --value "value" --scope project  
