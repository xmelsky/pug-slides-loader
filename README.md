## Custom webpack loader to use with [these](https://github.com/xmelsky/reveal.js-boilerplates) boilerplates

# Here is a [NPM Package](https://www.npmjs.com/package/pug-slides-loader)

### It's used for auto import reveal.js slides (.pug files) during webpack compilation process. It help keep your project structure clean and simple.

There are some examples of use:

#### Project structure:

```
/src
--/ts
----index.ts
--/slides
----/subslides
------sub-slide-for-s1.pug (need to be included into slide-1.pug to get it work)
----slide-0.pug
----slide-1.pug
```

#### note: slide fileNames must follow this pattern 'slide-{number}.pug'


#### webpack.config.js

```javascript
//ts-loader...
{
  test: require.resolve('./src/ts/index.ts'), // root file were slides will be injected
  use: [
    {
      loader: 'pug-slides-loader',
      options: {
        from: './src/slides', // folder with slides
      },
    },
  ],
},
```

#### index.ts

> note: all slides are sorted by default from lower number to highest
> but you can specify custom order.


```
import Reveal from 'reveal.js';
import 'sass/main.scss';

document.body.innerHTML = `<div class="reveal">
<div class="slides">
    <!--inject:slides--> // HERE SLIDES WILL BE INJECTED
    <!--inject:order=15,18,11,0,2,3,4,5,6,7,8,21,12,--> // CUSTOM RENDER ORDER
    <section>
      <img data-src="images/logo.webp">
    </section>
    <section>Slide 2</section>
</div>
</div>`;```

