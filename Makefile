site:
	wget -O stakx http://tacobeam.me/stakx-nightly.phar;
	chmod +x stakx;
	./stakx build;

build: site
