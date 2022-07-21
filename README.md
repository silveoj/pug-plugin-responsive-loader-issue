# CSS / JS duplicate file links

See `src\views\index.pug`

## CSS

Your test case contains two classes with 2 different images. In example I use full copy of `styles.scss`.

`Can't resolve the file Images/image.png?size=200&format=webp`

## JS

Output for 2nd main.js is

 ```html
   <script src="C:\myProj\src\js\main.js"></script>
 ```

`Not allowed to load local resource: file:///C:/myProj/src/js/main.js`
