# AREA frontend POC

This folder is dedicated to the POC of the AREA project frontend.

It tests multiple frontends, including:
- React
- Vue.js
- Svelte

## How to test

Go in the folder of the frontend you want to test, then run:

```bash
pnpm run dev
```

Connect to the port displayed on the screen.

To terminate the frontend run you can use Ctrl+C

## Criterias

- How easy it is to learn and write the language with the documentation
- How can the technology manage letting the user create his own workflow
- How the technology integrates other library

## The decision

### React:
React is one of the of the easiest framework to learn and to use, with one of the most complete documentation.

React has an extern library called react flow that is very powerful to build workflows. The library does most of the job that a workflow builder may need. After intergrating it, letting the user create his own workflow is a really easy task.

Intergrating the react flow library was really simple and easy and it worked out the box.

### Vue.js


### Svelte


---

**Based on these criterias, we decided to use the React framework for the AREA frontend.**