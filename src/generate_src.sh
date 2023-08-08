#!/bin/bash
>src01.txt
>src02.txt
>src03.txt
echo Archivo /App.tsx: >> src01.txt
cat App.tsx >> src01.txt
echo Archivo /PrivateZone.js: >> src01.txt
cat PrivateZone.js >> src01.txt
echo Archivo /components/CustomImage.js: >> src01.txt
cat ./components/CustomImage.js >> src01.txt
echo Archivo /components/InsetShadow.js: >> src01.txt
cat ./components/InsetShadow.js >> src01.txt
echo Archivo /components/Navigation.js: >> src01.txt
cat ./components/Navigation.js >> src01.txt
echo Archivo /components/PrivateZoneDrawer.js: >> src01.txt
cat ./components/PrivateZoneDrawer.js >> src01.txt
echo Archivo /components/SearchBox.js: >> src01.txt
cat ./components/SearchBox.js >> src01.txt

echo Archivo /screens/PrivateZone/MyAppointments.js: >> src02.txt
cat ./screens/PrivateZone/MyAppointments.js >> src02.txt
echo Archivo /screens/PrivateZone/MyProfile.js: >> src02.txt
cat ./screens/PrivateZone/MyProfile.js >> src02.txt
echo Archivo /screens/PrivateZone/MyServices.js: >> src02.txt
cat ./screens/PrivateZone/MyServices.js >> src02.txt
echo Archivo /screens/PrivateZone/MySettings.js: >> src02.txt
cat ./screens/PrivateZone/MySettings.js >> src02.txt
echo Archivo /screens/PrivateZone/MyWallet.js: >> src02.txt
cat ./screens/PrivateZone/MyWallet.js >> src02.txt
echo Archivo /screens/PrivateZone/ServiMarket.js: >> src02.txt
cat ./screens/PrivateZone/ServiMarket.js >> src02.txt
echo Archivo /screens/PrivateZone/ViewHistory.js: >> src02.txt
cat ./screens/PrivateZone/ViewHistory.js >> src02.txt

echo Archivo /screens/PublicZone/Login.js: >> src03.txt
cat ./screens/PublicZone/Login.js >> src03.txt
echo Archivo /screens/PublicZone/SignUp.js: >> src03.txt
cat ./screens/PublicZone/SignUp.js >> src03.txt