all: build

build:
	tsc

run:
	node dist/index.js

test:
	npx jest tst/*.ts --coverage

eslint:
	npx eslint src tst html/src --fix

parcel:
	make
	npm start

pdf:
	pdflatex ./tex/rapport.tex
	evince rapport.pdf

clean:
	rm -f *~ dist/* rapport.[pla]* rapport.toc