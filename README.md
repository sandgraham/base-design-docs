## Development

First, clone and install dependencies:

```bash
$ git clone https://github.com/uber/base-design-docs.git
$ cd base-design-docs
$ yarn
```

Then, create a `.env.local` file like so:

```bash
# The base figma file for the org
FIGMA_FILE_KEY=XYZ

# The figma project to build pages from
FIGMA_PROJECT_ID=XYZ

# A figma API auth token with access to the above file
FIGMA_AUTH_TOKEN=XYZ
```

Then, run the development server:

```bash
$ yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Pages auto-update as you edit files.

## How this works

This project is built with Next.js and Vercel.

We use `getStaticPaths` to render a webpage for each top-level Frame in each file in our Figma Project. So, what is a top-level Frame?

First, recall that every Figma File has the following structure:

```
Project > File[] > Canvas[] > Frame[]
```

Every Project can have multuple Files, which can have multiple Canvases, which in turn can have multiple Frames. We render a webpage for every top-level Frame within each Canvas.

Take the following Figma file structure:

```
- Docs (File)
  - Setup (Canvas)
    - Getting started (Frame)
    - Living styleguides (Frame)
  - Color (Canvas)
    - Light tokens (Frame)
    - Dark tokens (Frame)
  - Typography (Canvas)
    - Uber Move (Frame)
    - Uber Move Mono (Frame)
  - Grid (Canvas)
    - Columns (Frame)
    - Rows (Frame)
```

This results in the following webpages being rendered:

```
- Getting started
- Living styleguides
- Light tokens
- Dark tokens
- Uber Move
- Uber Move Mono
- Columns
- Rows
```

In our navigation, these pages will be grouped by their parent Canvases. Something like this:

```
Setup
  - Getting started
  - Living styleguides
...
```

We apply this to each file in the Figma project. Note, the file structure itself only impacts the rendered website by influencing the order of pages. We have a step that essentially "joins" each page into one list before processing top-level frames.

There are a couple more conventions to keep in mind:

- We only use Canvases and Frames that start with a capital letter.
- We only use Frames that are visible.

So, given any arbitrary Project, provided at build-time as `FIGMA_PROJECT_ID`, so long as the files in the project follow the above conventions, we can build a website.

### Rendering a Frame

You might wonder how we render a Frame as a webpage. For now, we just ask the Figma API for a PNG of the Frame at build-time. We receive a link from the API, which we simply embed on the page.

We've also done some prototyping where we render the Frame as HTML & CSS (through React). The main benefit is that the pages are indexable— which is useful for SEO and cross-page search. It would also be interesting if the webpages could be made responsive.

There have been a lot of issues with the HTML & CSS approach though. To start, it isn't clear if you can do responsive pages without an excessive amount of convention in your Figma File. We want our designers to focus on presenting useful documentation, not fussing over the rules for adding it. Furthermore, for a large File, the API can take quite a long time to query all of the JSON necessary to render the Frame accurately.

At a certain point a CMS is probably better suited for delivering structured data that can be rendered nicely across multiple mediums.

So, with all of this considered, for now we use images.
