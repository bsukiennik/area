# Frontend POC — node workflow builder

## What is this?

A **POC** (proof of concept) is a tiny app built to answer one question:

> Can this frontend technology build a simple node-based workflow editor?

We build the **same tiny editor** with React, Vue, Angular and Svelte, then compare them in [`docs/frontend/comparative.md`](../../docs/frontend/comparative.md).

## What to build

One screen. No backend, no login, no real services, no fake data files.

```text
[Trigger] → <Condition> → [Reaction]
```

Only **two features**:

1. **Add** — three buttons (Trigger, Condition, Reaction) that place a node on the canvas.
2. **Connect** — drag from a node's dot to another node to draw a line. Nodes can be moved around.

That's it. No save/load, no config panel, no validation, no execution preview, no zoom, no undo.

## What we compare

Write a few lines in `NOTES.md` for each technology:

| Question | Answer to record |
|---|---|
| Was adding and connecting nodes easy? | Yes/no + what was painful |
| Did the node library work out of the box? | Any workarounds? |
| Did it build? | Build log |
| How long did it take? | Rough hours |

## Where to put things

```text
poc/frontend/
├── README.md    # this file
├── react/       # React + a node library (e.g. React Flow)
├── vue/         # Vue + Vue Flow
├── angular/     # Angular
└── svelte/      # Svelte + Svelte Flow
```

Each folder gets a `README.md` with run/build commands, the code, and a `NOTES.md` with what you found. A screenshot is welcome but not required.

## Done when

- [ ] All four folders build and run.
- [ ] You can add nodes and connect them.
- [ ] `NOTES.md` exists in each folder.

A POC that fails is still a useful result — write down what failed.

## Final decision

Pick the one that was **fastest to build and easiest to use**. Write one short paragraph explaining why the others were rejected **for this project** in `docs/frontend/comparative.md`.
