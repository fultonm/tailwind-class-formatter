# Tailwind Class Formatter

A Visual Studio Code extension providing opinionated Tailwind class formatting support for JSX files. Supports JIT classes.

## Features

The extension will scan your document for JSX components containing the `className` property. Classes which match any Tailwind pattern will be ordered and each placed on a new line in the document. Classes which are not detected as a Tailwind class are placed at the top in the original order.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `tailwind-class-formatter.enable`: Enable/disable Tailwind Class Formatter.
* `tailwind-class-formatter.defaultSortOrder`: The sort order of Tailwind classes. Many of the classes listed here are prefixes that will match if any classes found within a `className` element begin with a value in this list. Additionally, the classes are specified from least specific to most specific. For example, any class starting with `m-`, such as `m-[3px]` will be ordered before classes starting with `mt-`.

## Known Issues

The extension is currently in early development and not ready for release. Please expect that not all main features listed above are working as described.

## Release Notes

### 0.0.1

Initial commit with extension template.