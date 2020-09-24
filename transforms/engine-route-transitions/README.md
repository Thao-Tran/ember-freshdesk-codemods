# engine-route-transitions


## Usage

```
jscodeshift -t <path-to-repo>/transforms/engine-route-transitions/index.js <path-to-directory-or-file-to-transform>
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/engine-route-transitions/__testfixtures__/basic.input.js)</small>):
```js
this.transitionTo('helpdesk.dashboards.default');
this.transitionTo('helpdesk.admin.index');
this.transitionTo(url);
this.transitionTo('helpdesk.agents.show', id);

```

**Output** (<small>[basic.output.js](transforms/engine-route-transitions/__testfixtures__/basic.output.js)</small>):
```js
this.transitionTo('default');
this.transitionTo('index');
this.transitionTo(url);
this.transitionTo('show', id);

```
<!--FIXTURES_CONTENT_END-->