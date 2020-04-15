site:
	wget -O stakx http://sujevo.com/stakx-nightly.phar;
	chmod +x stakx;
	./stakx build;

build: site
