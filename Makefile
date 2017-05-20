theme:
	node_modules/.bin/bower-installer;
	node_modules/.bin/gulp deploy;

site:
	git submodule update --init;
	wget -O stakx http://tacobeam.me/stakx-nightly.phar;
	chmod +x stakx;
	./stakx build;

build: theme site
