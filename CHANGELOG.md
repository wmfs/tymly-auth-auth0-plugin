## [1.7.1](https://github.com/wmfs/tymly-auth-auth0-plugin.git/compare/v1.7.0...v1.7.1) (2018-10-29)


### 🐛 Bug Fixes

* **userIdFromEmail failed if there were multiple identities. Fix by just picking first one:** But sh ([a864c05](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/a864c05))
* In emailToUserId find the most appropriate user info ([da3b132](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/da3b132))


### 🛠 Builds

* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/changelog requirement ([76e4256](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/76e4256))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement ([226cf2c](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/226cf2c))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.42.0 to 1.43.0 ([53deea4](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/53deea4))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.43.0 to 1.44.0 ([fbfec56](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/fbfec56))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.44.0 to 1.45.0 ([bbb48a9](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/bbb48a9))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.45.0 to 1.46.0 ([a088145](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/a088145))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.46.0 to 1.47.0 ([65c21e4](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/65c21e4))
* **deps-dev:** update nyc requirement from 13.0.1 to 13.1.0 ([940b6e9](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/940b6e9))
* **deps-dev:** update semantic-release requirement ([9ee5223](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/9ee5223))
* **deps-dev:** update semantic-release requirement ([fd83555](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/fd83555))
* **deps-dev:** update semantic-release requirement ([5dc439d](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/5dc439d))
* **deps-dev:** update semantic-release requirement ([1c8058a](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/1c8058a))
* **dev-deps:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.47.0 to 1.56.0 ([94518a1](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/94518a1))


### 📦 Code Refactoring

* Flipped cache names to they match the methods they're caching results of ([e3c2202](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/e3c2202))
* Move userIdFromEmail to use _get ([d961c37](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/d961c37))
* Pulled out _buildRequest method, constructing the request object to send to Auth0 ([91f698c](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/91f698c))
* Pulled out a load of common endpoint request stuff. ([d040ad8](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/d040ad8))
* wrap cache gets in little methods ([14d5f61](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/14d5f61))


### 🚨 Tests

* **dev-deps:** Add test-helper so we can pull in always-say-yes rbac dummy ([34e1273](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/34e1273))
* Explanatory comment ([bcfcbae](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/bcfcbae))
* extend tests to peek into cache ([c928134](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/c928134))
* Flung in some describes ([8d6e08d](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/8d6e08d))
* Poke around inside userInfoService to force a cache reset, so all the tests hit the Auth0 endp ([7265b13](https://github.com/wmfs/tymly-auth-auth0-plugin.git/commit/7265b13))

# [1.7.0](https://github.com/wmfs/tymly-auth-auth0-plugin/compare/v1.6.0...v1.7.0) (2018-10-08)


### 🛠 Builds

* **deps:** update debug requirement from 4.0.1 to 4.1.0 ([1cb7492](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/1cb7492))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.26.1 to 1.27.0 ([5eac6f6](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/5eac6f6))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.27.0 to 1.28.0 ([1bc76b0](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/1bc76b0))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.28.0 to 1.30.0 ([f2109cc](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/f2109cc))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.30.0 to 1.31.0 ([23e3370](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/23e3370))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.31.0 to 1.32.0 ([5c31670](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/5c31670))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.32.0 to 1.33.0 ([f74612c](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/f74612c))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.33.0 to 1.34.0 ([fcd3259](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/fcd3259))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.34.0 to 1.35.0 ([65dadd5](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/65dadd5))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.35.0 to 1.36.0 ([3b24b82](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/3b24b82))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.36.0 to 1.37.0 ([f39c798](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/f39c798))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.37.0 to 1.39.0 ([405865b](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/405865b))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.39.0 to 1.40.0 ([bbe8f0a](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/bbe8f0a))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.40.0 to 1.41.0 ([b2a4e6d](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/b2a4e6d))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.41.0 to 1.42.0 ([e5e048a](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/e5e048a))
* **deps-dev:** update chai requirement from 4.1.2 to 4.2.0 ([1ec2709](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/1ec2709))
* **deps-dev:** update semantic-release requirement ([b6e7a4d](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/b6e7a4d))
* **deps-dev:** update semantic-release requirement ([c1c352a](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/c1c352a))
* **deps-dev:** update semantic-release requirement ([acb151b](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/acb151b))

# [1.6.0](https://github.com/wmfs/tymly-auth-auth0-plugin/compare/v1.5.0...v1.6.0) (2018-09-11)


### 🛠 Builds

* **deps:** update debug requirement from 4.0.0 to 4.0.1 ([ec98b92](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/ec98b92))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement ([8ce5303](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/8ce5303))

# [1.5.0](https://github.com/wmfs/tymly-auth-auth0-plugin/compare/v1.4.0...v1.5.0) (2018-09-11)


### 🛠 Builds

* **deps:** update debug requirement from 3.2.3 to 4.0.0 ([fb1c083](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/fb1c083))

# [1.4.0](https://github.com/wmfs/tymly-auth-auth0-plugin/compare/v1.3.0...v1.4.0) (2018-09-11)


### 🛠 Builds

* **deps:** update debug requirement from 3.2.2 to 3.2.3 ([678099f](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/678099f))

# [1.3.0](https://github.com/wmfs/tymly-auth-auth0-plugin/compare/v1.2.0...v1.3.0) (2018-09-11)


### 🛠 Builds

* **deps:** update debug requirement from 3.2.1 to 3.2.2 ([18d2db1](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/18d2db1))

# [1.2.0](https://github.com/wmfs/tymly-auth-auth0-plugin/compare/v1.1.0...v1.2.0) (2018-09-11)


### 🛠 Builds

* **deps:** update debug requirement from 3.1.0 to 3.2.1 ([7b4c7d7](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/7b4c7d7))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement from 7.0.1 to 7.0.2 ([7e1fdbc](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/7e1fdbc))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement from 7.0.2 to 7.0.3 ([2da50ab](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/2da50ab))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.15.2 to 1.16.0 ([cdc53b4](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/cdc53b4))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.16.0 to 1.16.1 ([d237615](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/d237615))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.16.1 to 1.17.0 ([f231320](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/f231320))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.17.0 to 1.17.1 ([c96b042](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/c96b042))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.17.1 to 1.19.0 ([4142a61](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/4142a61))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.19.0 to 1.20.0 ([c5f7e7d](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/c5f7e7d))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.20.0 to 1.21.0 ([f8d8dfb](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/f8d8dfb))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.21.0 to 1.22.0 ([250ad4a](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/250ad4a))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.22.0 to 1.23.0 ([8bf52e5](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/8bf52e5))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.23.0 to 1.25.0 ([0dc499e](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/0dc499e))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.25.0 to 1.26.0 ([e6b3084](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/e6b3084))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.26.0 to 1.26.1 ([cdc4eb8](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/cdc4eb8))
* **deps-dev:** update codecov requirement from 3.0.4 to 3.1.0 ([52cf523](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/52cf523))
* **deps-dev:** update nyc requirement from 12.0.2 to 13.0.1 ([0d3705c](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/0d3705c))
* **deps-dev:** update semantic-release requirement ([0ba41d0](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/0ba41d0))
* **deps-dev:** update semantic-release requirement from 15.9.11 to 15.9.12 ([7b786d3](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/7b786d3))
* **deps-dev:** update semantic-release requirement from 15.9.6 to 15.9.7 ([a895023](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/a895023))
* **deps-dev:** update semantic-release requirement from 15.9.7 to 15.9.8 ([6914dfc](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/6914dfc))
* **deps-dev:** update semantic-release requirement from 15.9.8 to 15.9.9 ([6b5facb](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/6b5facb))
* **deps-dev:** update semantic-release requirement from 15.9.9 to 15.9.11 ([f4b84e6](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/f4b84e6))
* **dev-deps:** move to standard 12.0.1 ([9125890](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/9125890))

# [1.1.0](https://github.com/wmfs/tymly-auth-auth0-plugin/compare/v1.0.5...v1.1.0) (2018-08-10)


### 🛠 Builds

* **deps:** update request requirement from 2.87.0 to 2.88.0 ([2e4bbea](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/2e4bbea))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/changelog requirement to 2.1.2 ([de5bba2](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/de5bba2))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/changelog requirement to 3.0.0 ([d1f83d2](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/d1f83d2))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement to 6.0.2 ([01b2532](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/01b2532))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement to 7.0.0 ([ea73cc8](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/ea73cc8))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement to 7.0.1 ([c29fc8e](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/c29fc8e))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.14.0 to 1.15.0 ([53e049a](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/53e049a))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.15.0 to 1.15.2 ([3871e71](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/3871e71))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement to 1.10.0 ([4f888e1](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/4f888e1))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement to 1.11.0 ([e0d7e11](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/e0d7e11))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement to 1.12.0 ([9f4e89f](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/9f4e89f))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement to 1.12.1 ([d4f0e17](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/d4f0e17))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement to 1.13.0 ([f6ed84e](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/f6ed84e))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement to 1.13.1 ([b44b931](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/b44b931))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement to 1.14.0 ([8291f0c](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/8291f0c))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement to 1.8.0 ([818b8c6](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/818b8c6))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement to 1.9.0 ([2d5db5b](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/2d5db5b))
* **deps-dev:** update devDeps ([d2f0470](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/d2f0470))
* **deps-dev:** update semantic-release requirement from 15.9.3 to 15.9.5 ([6104245](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/6104245))
* **deps-dev:** update semantic-release requirement from 15.9.5 to 15.9.6 ([0ad9fa8](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/0ad9fa8))
* **deps-dev:** update semantic-release requirement to 15.7.2 ([5c33528](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/5c33528))
* **deps-dev:** update semantic-release requirement to 15.8.0 ([3e898dd](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/3e898dd))
* **deps-dev:** update semantic-release requirement to 15.8.1 ([d818ee3](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/d818ee3))
* **deps-dev:** update semantic-release requirement to 15.9.1 ([f9cadb2](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/f9cadb2))
* **deps-dev:** update semantic-release requirement to 15.9.2 ([2e2a624](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/2e2a624))
* **deps-dev:** update semantic-release requirement to 15.9.3 ([a821353](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/a821353))


### ⚙️ Continuous Integrations

* remove deps-dev scoping release ([5a8bb7a](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/5a8bb7a))
* **semantic-release:** config update ([96ff9ff](https://github.com/wmfs/tymly-auth-auth0-plugin/commit/96ff9ff))
