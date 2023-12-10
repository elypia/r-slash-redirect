install-prerequisites:
	npm install -g web-ext

build:
	rm -f web-ext-artifacts/*.zip
	web-ext build -s src
