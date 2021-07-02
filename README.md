# Tailwind Class Formatter

A Visual Studio Code extension providing opinionated Tailwind class formatting support for JSX files. Supports JIT classes.

## Features

The extension will scan your document for JSX components containing the `className` property and format them according to the extension features:

* **Class ordering** Tailwind classes will be ordered according to a configurable sort order. Non-Tailwind classes can be configured to be placed before or after Tailwind classes (default is before). See the Extension Settings section below.

* **Indentation matching**: For a cleaner JSX file, each class is placed on a new line and indented using spaces to match the quote position of the `className`

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `tailwind-class-formatter.enable`: Enable/disable Tailwind Class Formatter.
* `tailwind-class-formatter.nonTailwindClassBefore`: Whether to place non-Tailwind classes before Tailwind classes.
* `tailwind-class-formatter.sortOrder`: The sorting order of Tailwind classes. Some of the classes listed in this array are class prefixes. The classes are specified from least specific to most specific. For example, any class starting with `m-`, such as `m-[3px]` will be ordered before classes starting with `mt-`. More prefixes and even whole class names can be added to specify sort order more granularly.
  * For example, `bg-[#` can be added to the `sortOrder` configuration to sort the JIT class `bg-[#1da1f1]` for background color before or after other `bg-` prefixed classes.


## Known Issues

The extension is currently in early development and not ready for release. Please expect that not all main features listed above are working as described.

## Release Notes

### 0.0.1

Initial commit with extension template.