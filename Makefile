theme:
	node_modules/.bin/bower-installer;
	node_modules/.bin/gulp deploy;

site:
	git submodule update --init;
	wget -O stakx https://github.com/stakx-io/stakx/releases/download/v0.1.1/stakx-0.1.1.phar;
	chmod +x stakx;
	./stakx build;

build: theme site
