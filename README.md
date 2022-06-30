Mash of styles

I get error on Win and Linux:
`Can't resolve the file ../src/assets/img/image.png in ..\src\html\pages\view-2.pug`

here: 
```pug
header
  img(src=require('~Images/image.png'))
```

- Also it works SOMETIMES if I remove `.browserlistrc`
- I can replace `padding-bottom` to `padding-top` and it will work.
