# Showtime

A slideshow application that takes a markdown like file and creates a slideshow site. 
This is more of a weekend hack to play around with `main-loop` and `virtual-dom` 

## Install

```
npm i showtime -g
```

## Usage

Create a markdownish file using `---` three dashes to separate your slides.

``` 
# Title

---

### Table of Contents

* One
* Two
* Three

---

# One

---

# Two

```

Save this file as `demo.md` then serve using `showtime`

```
showtime demo.md -p 3000
```

And now you have a simple slideshow app ready to rock.

## Use Cases

If you want to put a quick and simple presentation together in a very short period of time 
and have it serve as documentation in your github repo as a markdown file

It is not a full markdown parser it just takes some simple markdown formats to build 
a slide.

## Roadmap

No particular roadmap at the moment, please feel free to take it and hack away, 
I may had syntax highlighting in the future if necessary, please pose issues and 
provide pull requests if your interested in contributing.

## Thank You

* RevealJS
* Cleaver
* xslides

