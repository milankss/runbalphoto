# RunBalPhoto

Portfolio website for RunBalPhoto. It is a plain static site (HTML, CSS and JavaScript, no build step), so any static host can serve it.

## Pages

| Address | What it shows |
| --- | --- |
| `#/` | Home: the logo, a tagline and a strip of featured projects. On a computer, a thumbnail grows when you hover it; on phones and tablets the strip is a swipeable carousel. |
| `#/work` | Every project in a grid, with category filters. |
| `#/work/<project>` | Full-screen photo viewer. Use the arrow keys, click the left or right half of the photo, or swipe. Esc closes it. |
| `#/info` | Bio, portrait and contact links, on a dark background. |

## Editing content

All text and the project list are in **`content/site.js`**. Everything marked `PLACEHOLDER` is sample content to replace:

- `tagline`, `bio`, `motto`
- `contact`: check the Instagram handle and email address
- `projects`: title, category, year, description, and the list of photos

## Adding photos

1. Make a folder per project: `images/<project-slug>/`, for example `images/coastline/`.
2. Put the photos in it. Exported JPEGs about 2000–2500px on the long edge, at roughly 80% quality, load quickly and still look sharp.
3. List the file names in that project's `images` array in `content/site.js`, in display order. The first photo is the cover.
4. Replace `images/info/portrait.jpg` with a photo of the photographer.
5. Delete the placeholder folders you no longer use.

To describe a photo for screen readers, write it as `{ src: "01.jpg", alt: "Bride and groom on the beach at sunset" }` instead of just `"01.jpg"`.

## Logo

The script lettering was traced from the circular RunBalPhoto badge into a vector:

- `assets/logo/runbalphoto-logo-black.svg` and `-white.svg`: vector, scales to any size
- `assets/logo/runbalphoto-logo-black.png` and `-white.png`: transparent PNGs
- `assets/icons/`: favicon (the round badge), Apple touch icon, and a social-share preview image

The site embeds the logo directly in `index.html`, so it can change colour and animate.

## Viewing it locally

```sh
python3 -m http.server 8080
```

Then open http://localhost:8080. Opening `index.html` directly from the folder also works.

## Publishing

- **GitHub Pages:** in the repository go to Settings → Pages, choose "Deploy from a branch", then pick the branch and the `/ (root)` folder.
- **Netlify or Cloudflare Pages:** connect the repository. There is no build command, and the publish directory is the repository root.
