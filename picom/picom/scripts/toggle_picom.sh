#!/usr/bin/sh
value=$(pgrep picom | wc -l)
if [ $value -ge 3 ];
then
	pgrep picom
	echo "${value}"
	pkill -9 picom
else
	echo "${value}"
	picom --experimental-backends --config ~/.config/picom/picom.conf
fi
