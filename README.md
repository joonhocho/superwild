# superwild
Extremely fast, optimized, compilable wildcard pattern matching without using RegExp (slow) with zero dependencies.

[![npm version](https://badge.fury.io/js/superwild.svg)](https://badge.fury.io/js/superwild)
[![npm](https://img.shields.io/npm/dw/superwild.svg)](https://www.npmjs.com/package/superwild)
![npm type definitions](https://img.shields.io/npm/types/superwild.svg)
[![Build Status](https://travis-ci.org/joonhocho/superwild.svg?branch=master)](https://travis-ci.org/joonhocho/superwild)
[![Dependency Status](https://david-dm.org/joonhocho/superwild.svg)](https://david-dm.org/joonhocho/superwild)
[![GitHub](https://img.shields.io/github/license/joonhocho/superwild.svg)](https://github.com/joonhocho/superwild/blob/master/LICENSE)

## Get Started
```
npm install -D superwild
```
or
```
yarn add -D superwild
```

## How to Use

```typescript
import {
  BuildPath,
  ICompilePathOptions,
  IPathParams,
  compilePathWithParams,
  startsWith,
  WildcardPathMatcher,
  getWildcardStringPathMatcher,
  getWildcardStringMatcher
} from 'superwild';
```

## License
[MIT License](https://github.com/joonhocho/superwild/blob/master/LICENSE)
