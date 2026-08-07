# Testify self-hosting

When a published Testify version runs Testify's own source tests, use Node mode
and keep package dependencies external. This prevents the test build from
bundling tools such as Playwright, Vite, and their private transitive modules.

For a v1 bootstrap runner, copy `testify.selfhost.json` to `testify.json` or
merge its `viteConfig.build.rolldownOptions.external` list into the existing
configuration.

Testify 2 additionally externalizes dependencies/devDependencies/
peerDependencies/optionalDependencies automatically for Node builds.
