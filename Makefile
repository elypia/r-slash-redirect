install-prerequisites:
	npm install -g web-ext

build:
	rm web-ext-artifacts/*.zip
	web-ext build -s src
