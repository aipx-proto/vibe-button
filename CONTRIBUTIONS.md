# Maintainers Manual

Make sure system components are decoupled and independently changeable:

- Button and Dialog UI: see `/lib/vibe-button.html`
- Credential storage: see `/lib/vibe-button.ts`
- Easy Agent API: see `/lib/agent.ts`

When there is change in the library, you need to run build, then publish

```sh
npm run build
npm version patch # or minor, major
npm publish
```

After a version bump, make sure to update `CHANGELOG.md` with the new version and a summary of changes.
