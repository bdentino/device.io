all:
	@component install
	@component build

clean:
	rm -rf build components node_modules
