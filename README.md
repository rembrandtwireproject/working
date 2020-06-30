# Rembrandt WIRE Project

The Watermark Identification in Rembrandt’s Etchings (WIRE) project aims to simplify the process of identifying watermarks, which are often very difficult to
tell apart. This program uses a decision tree model to guide researchers to a match with their sought watermark, enabling rapid access to information on
paper dating and the range of other plates printed on a given paper batch. Eventually, all Rembrandt watermarks from Erik Hinterding’s 2006 catalogue
will be included in this tool.

The current production URL is https://rembrandtwireproject.github.io

## Technology

WIRE uses Github Pages (https://pages.github.com/) and its underlying technology Jekyll.  The main database of questions is stored as a series of Jekyll
pages in the `_pages` folder.  Each sub-folder represents a branch, or watermark archetype.  You can think of it as a game of 20 Questions where the
`_pages` folders represent the answer to the first question (sort of like "Animal, Vegetable or Mineral?")  Once the user chooses that, they land on
the first question.

The branches are mirrored in `_data/branches.yml`.  An example section looks like this:

```
arms_of_burgundy_and_austria:
  name: Arms of</br>Burgundy and Austria
  image: archetype
  start: sheep_chainline
```

This means the arms_of_burgundy_and_austria branch, they will start at the page `sheep_chain_line`.  Looking
at `_pages/arms_of_burgundy_and_austria/sheep_chain_line.html`:

```
---
layout: question
question: Does part of the sheep, below the shield, touch the nearest chain line?
parent: index
if-yes: aaa
if-no: aab
---
```

This represents a yes/no question.  If the user choose Yes, they go to `_pages/arms_of_burgundy_and_austria/aaa.html`:

```
---
layout: watermark
name: Arms of Burgundy and Austria, A.a.a.
parent: sheep_chainline
clarification: "Watermark A.a.a. can be distinguished by a crowned shield containing a tower, eagle, lions, and the sheep (Golden Fleece) below the shield which touches the nearest chain line."
datable: 1631-32
prints:
  - title: "Self-portrait with bushy hair: bust"
    details: 1631 (B.25 iii / NHD 93) Hermitage Museum, St Petersburg (HMP 234925). Octavo sheet
```

This happens to be a watermark node, or leaf node.  More often, users will go through 5-10 questions before reaching a leaf node.

Storing question and answer data here rather than a database makes it easy to version data and roll back if need be.  It's also easier to refactor branches
constructed in this way - if new variants of the watermarks turn up later, it's easy to insert questions into this structure.

A data file is merged with a layout stored in `_layouts` to produce an HTML page.  The particular layout is always listed as the `layout` field in the data file.

## Instructions for Contributing Branches and Data

A series of helpful videos will guide your contributions:

- Getting Started With WIRE on Mac: https://vod.video.cornell.edu/media/0_r5u2f5i2
- Getting Started With WIRE on Windows: https://vod.video.cornell.edu/media/0_bdn7i70h
- Creating a WIRE Branch:  https://vod.video.cornell.edu/media/0_eetd31fp
- Creating a WIRE Question: https://vod.video.cornell.edu/media/1_ljev1tnt
- Creating a WIRE Watermark: https://vod.video.cornell.edu/media/1_q40jykvd

## Turning off Print Examples

Each Watermark page contains references to the watermark in particular prints.
This data is copyrighted.  You may control its display in `_layouts/watermark.html`.  To turn
it on, set line 124 to:

```
    <!-- Change this to page.prints to enable end notes, false to disable-->
    {% elsif page.prints %}
```

And to turn it off:

```
    <!-- Change this to page.prints to enable end notes, false to disable-->
    {% elsif false %}
```


## Contributing to WIRE

You may fork this repository and issue Pull Requests for features you'd like to add.  You can run the site on your own computer by installing Ruby 2.6.3 and
issuing:

```
$ bundle install
$ ./run.sh
```

(Windows users will need to provide their own batch file).

