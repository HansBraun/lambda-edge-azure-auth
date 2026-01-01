# Node 24 Migration Guide

This document outlines the changes made to make this project compatible with Node.js 24.

## Summary of Changes

### 1. Package.json Updates

#### Main package.json
- Added `engines` field requiring Node >= 24.0.0
- Updated dependencies to Node 24-compatible versions:
  - `axios`: ^0.21.2 → ^1.7.9
  - `cookie`: ^0.4.1 → ^0.7.2
  - `jsonwebtoken`: ^8.5.1 → ^9.0.2
  - `jwk-to-pem`: ^2.0.4 → ^2.0.6
- Removed deprecated packages:
  - `crypto` (now built-in)
  - `querystring` (replaced with URLSearchParams)
  - `url` (replaced with URL class)
- Updated devDependencies:
  - `@commitlint/*`: ^11.0.0 → ^19.0.0
  - `@semantic-release/*`: Updated to latest versions
  - `husky`: ^4.3.0 → ^9.0.0
  - `semantic-release`: ^17.1.2 → ^24.0.0
  - `webpack`: ^4.44.2 → ^5.96.0
  - `webpack-cli`: ^3.3.12 → ^5.1.4

#### build/package.json
- Added `engines` field requiring Node >= 24.0.0
- Updated dependencies:
  - `axios`: ^0.21.2 → ^1.7.9
  - `node-rsa`: ^0.4.2 → ^1.1.1
  - `prompt`: ^1.0.0 → ^1.3.0
  - `ramda`: ^0.25.0 → ^0.30.1
  - `shelljs`: ^0.8.0 → ^0.8.5
- Removed deprecated `url` package

#### tests/package.json
- Added `engines` field requiring Node >= 24.0.0
- Replaced `aws-sdk` with AWS SDK v3:
  - `aws-sdk`: ^2.207.0 → `@aws-sdk/client-s3`: ^3.709.0 and `@aws-sdk/client-lambda`: ^3.709.0
- Updated dependencies:
  - `dateformat`: ^3.0.3 → ^5.0.3
  - `generate-password`: ^1.4.1 → ^1.7.1
  - `json-beautify`: ^1.0.1 → ^1.1.1
  - `ngrok`: ^2.3.0 → ^5.0.0-beta.2
  - `opn`: ^5.2.0 → `open`: ^10.1.0
  - `prompt`: ^1.0.0 → ^1.3.0
  - `shelljs`: ^0.8.1 → ^0.8.5
- Removed deprecated packages:
  - `http` (now built-in)
  - `querystring` (replaced with URLSearchParams)

### 2. Code Changes

#### authn/openid.index.js
- Replaced `querystring` module with native `URLSearchParams`:
  - `qs.parse()` → `Object.fromEntries(new URLSearchParams())`
  - `qs.stringify()` → `new URLSearchParams().toString()`
- Removed `require('querystring')` import

#### build/build.js
- Replaced `url.parse()` with native `URL` class:
  - `url.parse(result.REDIRECT_URI).pathname` → `new URL(result.REDIRECT_URI).pathname`
- Removed `require('url')` import

#### tests/tests.js
- Replaced `opn` with `open` package
- Migrated from AWS SDK v2 to v3:
  - Replaced `AWS.Lambda()` with `LambdaClient` and `InvokeCommand`
  - Updated lambda invocation to use async/await pattern
  - Updated payload handling to use `TextDecoder` for Uint8Array responses
- Replaced deprecated APIs:
  - `url.parse()` with `URL` class
  - `qs.parse()` with `URLSearchParams`
  - `new Buffer()` with `Buffer.from()`
- Removed deprecated imports:
  - `require('url')`
  - `require('querystring')`
  - `require('aws-sdk')`

#### nonce.js
- No changes needed - uses built-in `crypto` module which is available in all Node versions

#### authn/openid.index.js
- **CRITICAL**: Converted Lambda handler from callback-based to async/await pattern (required for Node.js 24):
  - `exports.handler = (event, context, callback) => { ... }` → `exports.handler = async (event, context) => { ... }`
  - Converted all callback invocations to return statements
  - Converted `mainProcess()` function to async
  - Wrapped `jwt.verify()` callback-based calls in Promises for use with async/await
  - Updated helper functions (`redirect()`, `unauthorized()`, `internalServerError()`) to return responses directly instead of using callbacks
  - Converted all axios callbacks (`.then()/.catch()`) to async/await

#### authz/microsoft.js
- Updated `isAuthorized()` function to return response directly instead of using callback
- Removed `callback` parameter from function signature

#### simpleurl.js
- Updated `redirect()` function to return response directly instead of using callback
- Updated `handleRedirect()` function to return response directly instead of using callback
- Removed all `callback` parameters from function signatures

### 3. Webpack Configuration
- No changes needed - webpack.config.js is already compatible with webpack 5

## Deprecated Node.js APIs Removed

The following deprecated Node.js APIs have been replaced:

1. **querystring module**: Replaced with `URLSearchParams` (native web API)
2. **url.parse()**: Replaced with `URL` class (native web API)
3. **Buffer constructor**: Replaced with `Buffer.from()` and `Buffer.alloc()`

## Breaking Changes

### For Users

1. **Node.js Version**: The project now requires Node.js 24.0.0 or higher
2. **AWS SDK**: Tests now use AWS SDK v3, which has different configuration and API

### For Developers

1. Query string parsing now uses `URLSearchParams` instead of the deprecated `querystring` module
2. URL parsing now uses the `URL` class instead of `url.parse()`
3. AWS Lambda invocations in tests use the new SDK v3 command pattern

## Testing

After migration, test the project by:

1. Installing dependencies: `npm install`
2. Running tests: `npm test` (if you have test distributions configured)
3. Building the project: `npm run build`
4. Creating a package: `npm run package`

## Compatibility Notes

- The project is now compatible with Node.js 24.x
- All dependencies have been updated to their latest stable versions
- Deprecated Node.js APIs have been replaced with modern equivalents
- The code maintains backward compatibility with the same Lambda@Edge runtime behavior

## Migration Checklist

- [x] Update package.json files with Node 24 engine requirement
- [x] Update all dependencies to Node 24-compatible versions
- [x] Replace deprecated `querystring` module with `URLSearchParams`
- [x] Replace deprecated `url.parse()` with `URL` class
- [x] Update AWS SDK v2 to v3 in tests
- [x] Remove deprecated Buffer constructor usage
- [x] Convert Lambda handlers from callback-based to async/await pattern
- [x] Test installation with `npm install`
- [x] Verify webpack compatibility

## Additional Notes

- The `crypto` module is built into Node.js and requires no changes
- Husky hooks may need to be reinstalled: `npx husky install`
- Some dependencies show security vulnerabilities; run `npm audit` for details
