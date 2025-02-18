# YAML File Link

VS Code extension that provides clickable file links in YAML files.

## Features

- Supports file links with line numbers in YAML files
- Handles relative and absolute paths
- Works with spaces in filenames
- Supports both Windows and Unix-style paths

## Installation

1. Clone the repository
```bash
git clone https://github.com/mkjung/yaml-file-link.git
cd yaml-file-link
```

2. Install dependencies
```bash
npm install
```

3. Build the extension
```bash
npm run compile
```

4. Package the extension
```bash
npm run package
```

## Development

- `npm run compile` - Compile the extension
- `npm run watch` - Watch for changes
- `npm run package` - Create VSIX package
- `npm run lint` - Lint the code

## Usage

In your YAML files, you can create clickable links using the format:
```yaml
filepath: path/to/file.txt:10
```

The extension supports:
- Simple paths: `file.txt:1`
- Paths with spaces: `my folder/file.txt:5`
- Quoted paths: `"path with spaces/file.txt":10`
- Relative paths: `../other/file.txt:15`
- Absolute paths: `/home/user/file.txt:20`

## Requirements

- VS Code 1.80.0 or higher

## Extension Settings

This extension has no configurable settings.

## License

MIT License - see the [LICENSE](LICENSE) file for details.
