const terser = require("terser");
const htmlmin = require("html-minifier");
const lazyImagesPlugin = require("eleventy-plugin-lazyimages");
const pluginSEO = require("eleventy-plugin-seo-tag");
const isProd = process.env.NODE_ENV == "production";
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const cleanCSS = require("clean-css");
const moment = require("moment");

module.exports = function (config) {
	if (isProd) {
		config.addTransform("htmlmin", function (content, outputPath) {
			if (outputPath.endsWith(".html")) {
				let minified = htmlmin.minify(content, {
					useShortDoctype: true,
					removeComments: true,
					collapseWhitespace: true,
				});
				return minified;
			}

			return content;
		});
	}

	config.addPlugin(lazyImagesPlugin, {
		transformImgPath: (imgPath) => {
			if (imgPath.startsWith("/") && !imgPath.startsWith("//")) {
				return `./src${imgPath}`;
			}

			return imgPath;
		},
	});

	// minify js
	config.addFilter("jsmin", function (code) {
		let minified = terser.minify(code);
		if (minified.error) {
			console.log("Terser error: ", minified.error);
			return code;
		}

		return minified.code;
	});

	config.addFilter("cssmin", function (code) {
		return new cleanCSS({}).minify(code).styles;
	});

	// date format
	config.addFilter("date", (dateObj) => {
		return moment(dateObj).format("ddd-MM-yyyy");
	});

	// SEO
	config.addPlugin(pluginSEO, {
		title: "Rooster World Blog",
		url: "https://blog.rooster-world.com",
		author: "Cam Phan",
		description: "Rooster World Blog",
		options: {
			titleDivider: "|",
		},
		image: "/assets/img/3d-printing.jpg",
	});

	config.addPlugin(syntaxHighlight);

	config.addPassthroughCopy("src/assets");
	config.addPassthroughCopy("src/admin");
	return {
		dir: {
			input: "src",
		},
		passthroughFileCopy: true,
		templateFormats: ["html", "md", "liquid"],
		passthroughFileCopy: true,
	};
};
