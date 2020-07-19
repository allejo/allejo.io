site:
	wget -O stakx https://github.com/stakx-io/stakx/releases/download/v0.2.1/stakx-0.2.1.phar;
	chmod +x stakx;
	./stakx build;

build: site
