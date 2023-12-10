install-prerequisites:
	npm install -g web-ext

build:
	rm src/web-ext-artifacts/*.zip
	(cd src && web-ext build --overwrite-dest)
