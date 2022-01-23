#! /bin/bash

# ./colorscheme /path/to/image

# This script does 4 things.
# => Generate colorscheme with pywal
# => Copy colors to polybar
# => Copy colors to rofi 
# => Change the background image path in i3 config
polybarcfg="$HOME/.config/polybar/config"
roficfg="$HOME/.config/.rofi/themes/oxide.rasi"
# powercfg="$HOME/.config/rofi/powermenu/powermenu.rasi"
# powerconfirmcfg="$HOME/.config/rofi/powermenu/powermenu-confirm.rasi"
rofilist=( "$roficfg" )
if [ -f "$1" ]; then

				# Generate coloerscheme
				picture=$(echo $1 | sed 's+~+/home/piyush+')
				wal -i $picture

				# Takes the colors from pywal json files in .cache and stores in 2 separate files polycolors and roficolors
				jsonfile="$HOME/.cache/wal/schemes/"$(echo $picture | sed -e "s+/+_+g" -e "s+\.+_+g")"_dark_None_None_1.1.0.json"
				cat $jsonfile | grep -E 'color[0-9]' | sed -e "s/ //g" -e 's/"//g' -e "s/:/ = /" -e "s/,//g" > polycolors
				cat polycolors | sed -e 's/ =/:/' | sed -e 's/^/  /' | sed -e 's/$/;/' > roficolors  

				# Copyi/Replace colors from  polycolors to ~/.config/polybar/...
				if grep -Eq 'color[0-9]' $polybarcfg; then
								awk -i inplace 'BEGIN{FS=OFS="="}
										 NR==FNR {color[$1]=$2 ; next }
										 FNR!=NR && $1 in color {$2=color[$1]}
										 1' polycolors $polybarcfg
				else
							  cp $polybarcfg $polybarcfg.backup
								sed -i '/\[colors]/r polycolors' $polybarcfg
				fi
				rm polycolors

				# Copy/Replace colors from roficolors to ~/.config/rofi/...
				# polycolors and roficolrs are created repeatedly as each copy/replace moves the values from file to the config files
				for i in "${rofilist[@]}"
				do
							if grep -Eq '  color[0-9]' $i; then
											awk -i inplace 'BEGIN{FS=OFS=": "}
													 NR==FNR {color[$1]=$2 ; next }
													 FNR!=NR && $1 in color {$2=color[$1]}
													 1' roficolors $i 
							else
											echo "2 here"
											cp $i $i.backup
											sed -i '/\* {/r roficolors' $i
							fi
							cat $jsonfile | grep -E 'color[0-9]' | sed -e "s/ //g" -e 's/"//g' -e "s/:/ = /" -e "s/,//g" > polycolors
							rm roficolors
						  cat polycolors | sed -e 's/ =/:/' | sed -e 's/^/  /' | sed -e 's/$/;/' > roficolors
							rm polycolors
				done
				rm roficolors

 			# Replace backgroup image path in i3config
				cd ~/.config/i3
				awk -v t=$1 '$3 ~ /feh$/ {$5=t}1' config > config.rm
			  mv config.rm config
else
				echo "Image doesnt exist"
fi
