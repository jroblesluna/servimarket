#!/bin/bash

>src01.txt
>src02.txt
>src03.txt

echo Archivo /package.json: >> src01.txt
cat package.json >> src01.txt
echo Archivo /index.js: >> src01.txt
cat index.js >> src01.txt
echo Archivo /src/App.tsx: >> src01.txt
cat src/App.tsx >> src01.txt
echo Archivo /src/i18n.js: >> src01.txt
cat src/i18n.js >> src01.txt
echo Archivo /src/components/CustomImage.js: >> src01.txt
cat src/components/CustomImage.js >> src01.txt
echo Archivo /src/components/InsetShadow.js: >> src01.txt
cat src/components/InsetShadow.js >> src01.txt
echo Archivo /src/components/Navigation.js: >> src01.txt
cat src/components/Navigation.js >> src01.txt
echo Archivo /src/components/PrivateZoneDrawer.js: >> src01.txt
cat src/components/PrivateZoneDrawer.js >> src01.txt
echo Archivo /src/components/SearchBox.js: >> src01.txt
cat src/components/SearchBox.js >> src01.txt

echo Archivo /src/screens/PrivateZone/PrivateZone.js: >> src02.txt
cat src/screens/PrivateZone/PrivateZone.js >> src02.txt
echo Archivo /src/screens/PrivateZone/MyAppointments.js: >> src02.txt
cat src/screens/PrivateZone/MyAppointments.js >> src02.txt
echo Archivo /src/screens/PrivateZone/MyProfile.js: >> src02.txt
cat src/screens/PrivateZone/MyProfile.js >> src02.txt
echo Archivo /src/screens/PrivateZone/MyServices.js: >> src02.txt
cat src/screens/PrivateZone/MyServices.js >> src02.txt
echo Archivo /src/screens/PrivateZone/MySettings.js: >> src02.txt
cat src/screens/PrivateZone/MySettings.js >> src02.txt
echo Archivo /src/screens/PrivateZone/MyWallet.js: >> src02.txt
cat src/screens/PrivateZone/MyWallet.js >> src02.txt
echo Archivo /src/screens/PrivateZone/ServiMarket.js: >> src02.txt
cat src/screens/PrivateZone/ServiMarket.js >> src02.txt
echo Archivo /src/screens/PrivateZone/ViewHistory.js: >> src02.txt
cat src/screens/PrivateZone/ViewHistory.js >> src02.txt

echo Archivo /src/screens/PublicZone/Login.js: >> src03.txt
cat src/screens/PublicZone/Login.js >> src03.txt
echo Archivo /src/screens/PublicZone/SignUp.js: >> src03.txt
cat src/screens/PublicZone/SignUp.js >> src03.txt