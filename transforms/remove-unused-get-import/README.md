# remove-unused-get-import


## Usage

```
jscodeshift -t <path-to-repo>/transforms/remove-unused-get-import/index.js <path-to-directory-or-file-to-transform>
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [advanced](#advanced)
* [basic](#basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="advanced">**advanced**</a>

**Input** (<small>[advanced.input.js](transforms/remove-unused-get-import/__testfixtures__/advanced.input.js)</small>):
```js
import Component from '@ember/component';
import { get, computed } from '@ember/object';

export default Component.extend({
  init() {
    // no get expressions
  }
});

```

**Output** (<small>[advanced.output.js](transforms/remove-unused-get-import/__testfixtures__/advanced.output.js)</small>):
```js
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  init() {
    // no get expressions
  }
});

```
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/remove-unused-get-import/__testfixtures__/basic.input.js)</small>):
```js
import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({
  init() {
    // no get expressions
  }
});

```

**Output** (<small>[basic.output.js](transforms/remove-unused-get-import/__testfixtures__/basic.output.js)</small>):
```js
import Component from '@ember/component';

export default Component.extend({
  init() {
    // no get expressions
  }
});

```
<!--FIXTURES_CONTENT_END-->