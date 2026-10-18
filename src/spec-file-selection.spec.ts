import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { findSpecFileMatches, resolveSpecFiles } from './spec-file-selection';
import { ViteJasmineRunner } from './vite-jasmine-runner';
import { HmrManager } from './hmr-manager';
import { NodeArtifactHost } from './node-artifact-host';
import { EXIT_CODES } from './exit-codes';
import { logger } from './logger';

describe('Spec file selection', () => {
  const files = ['src/admin/login.spec.ts', 'src/forms/login.spec.ts'].map(file => path.resolve(file));

  it('matches explicit relative, absolute, and Windows-separated paths without a basename fallback', () => {
    expect(findSpecFileMatches(files, 'src/admin/login.spec.ts')).toEqual([files[0]]);
    expect(findSpecFileMatches(files, './src/admin/login.spec.ts')).toEqual([files[0]]);
    expect(findSpecFileMatches(files, 'src\\admin\\login.spec.ts')).toEqual([files[0]]);
    expect(findSpecFileMatches(files, files[1])).toEqual([files[1]]);
    expect(findSpecFileMatches(files, 'src/missing/login.spec.ts')).toEqual([]);
  });

  it('supports source/built extensions while preferring an exact extension', () => {
    expect(findSpecFileMatches(files, 'src/admin/login.spec.mjs')).toEqual([files[0]]);
    const js = path.resolve('src/admin/login.spec.js');
    expect(findSpecFileMatches([...files, js], 'src/admin/login.spec.ts')).toEqual([files[0]]);
  });

  it('runs every file with the requested basename in a stable order', () => {
    expect(resolveSpecFiles([files[1], files[0], files[1]], 'login.spec.ts')).toEqual(files);
    expect(resolveSpecFiles([files[0]], 'login.spec.ts')).toEqual([files[0]]);
  });

  it('reports unmatched filenames and paths as usage errors', () => {
    for (const selector of ['missing.spec.ts', 'src/missing/login.spec.ts']) {
      expect(() => resolveSpecFiles(files, selector)).toThrowError(/No spec file matches/);
      try {
        resolveSpecFiles(files, selector);
      } catch (error) {
        expect((error as any).exitCode).toBe(EXIT_CODES.INVALID_USAGE);
      }
    }
  });

  it('passes all basename matches and only the exact path match to the build', async () => {
    spyOn(logger, 'error');
    spyOn(logger, 'printlnRaw');
    for (const selector of ['login.spec.ts', 'src/forms/login.spec.ts']) {
      const runner = new ViteJasmineRunner({ browser: 'node', fileFilter: selector } as any);
      const internal = runner as any;
      spyOn(internal.fileDiscovery, 'discoverSources').and.resolveTo({ srcFiles: [], specFiles: files });
      spyOn(internal.fileDiscovery, 'discoverAllSources').and.resolveTo({ srcFiles: [], specFiles: files });
      const stop = new Error('stop before build');
      const build = spyOn(internal.viteConfigBuilder, 'createViteConfig').and.throwError(stop);
      await expectAsync(runner.preprocess()).toBeRejectedWith(stop);
      expect(build).toHaveBeenCalledOnceWith(selector.includes('/') ? [files[1]] : files);
    }
  });

  it('resolves once before preparation and lists all matches without prompting', async () => {
    spyOn(logger, 'error');
    const listed = spyOn(logger, 'printlnRaw');
    const preparation = spyOn(logger, 'preparationStart');
    const runner = new ViteJasmineRunner({ browser: 'node', fileFilter: 'login.spec.ts' } as any);
    const internal = runner as any;
    const scan = spyOn(internal.fileDiscovery, 'discoverAllSources').and.resolveTo({ srcFiles: [], specFiles: files });
    spyOn(internal.fileDiscovery, 'discoverSources').and.resolveTo({ srcFiles: [], specFiles: files });
    spyOn(internal.viteConfigBuilder, 'createViteConfig').and.throwError('stop before build');
    await Promise.all([runner.selectSpecFiles(), runner.selectSpecFiles()]);
    expect(preparation).not.toHaveBeenCalled();
    expect(listed).toHaveBeenCalledOnceWith(jasmine.stringMatching(/Running 2 matching spec files:/));
    expect(listed.calls.first().args[0]).toContain('src/admin/login.spec.ts');
    expect(listed.calls.first().args[0]).toContain('src/forms/login.spec.ts');
    await expectAsync(runner.preprocess()).toBeRejected();
    expect(scan).toHaveBeenCalledTimes(1);
  });

  for (const watch of [false, true]) {
    it(`${watch ? 'rejects watch mode for' : 'switches to Node for'} matching Node-only specs`, async () => {
      spyOn(logger, 'error');
      spyOn(logger, 'printlnRaw');
      const runner = new ViteJasmineRunner({ browser: 'chrome', watch, fileFilter: 'login.spec.ts' } as any);
      const internal = runner as any;
      spyOn(internal.fileDiscovery, 'discoverSources').and.callFake(async () => ({
        srcFiles: [], specFiles: internal.config.browser === 'node' ? files : [files[0]],
      }));
      spyOn(internal.fileDiscovery, 'discoverAllSources').and.resolveTo({ srcFiles: [], specFiles: files });
      const stop = new Error('stop before build');
      const build = spyOn(internal.viteConfigBuilder, 'createViteConfig').and.throwError(stop);
      if (watch) {
        await expectAsync(runner.preprocess()).toBeRejectedWith(jasmine.objectContaining({ exitCode: EXIT_CODES.INVALID_USAGE }));
        expect(build).not.toHaveBeenCalled();
      } else {
        await expectAsync(runner.preprocess()).toBeRejectedWith(stop);
        expect(internal.config.browser).toBe('node');
        expect(build).toHaveBeenCalledOnceWith(files);
      }
    });
  }

  it('keeps watch rebuilds scoped to resolved specs while tracking source edits', () => {
    const hmr = new HmrManager({} as any, {} as any, { createPathAliases: () => ({}) } as any, null, { selectedSpecFiles: [files[1]] });
    expect((hmr as any).matchesFilter(files[0])).toBeFalse();
    expect((hmr as any).matchesFilter(files[1])).toBeTrue();
    expect((hmr as any).matchesFilter(path.resolve('src/forms/login.ts'))).toBeTrue();
  });

  it('excludes stale preserved spec artifacts from the generated Node runner', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'testify-selection-'));
    try {
      fs.writeFileSync(path.join(root, 'selected.spec.mjs'), '');
      fs.writeFileSync(path.join(root, 'stale.spec.mjs'), '');
      const host = new NodeArtifactHost({ outDir: root } as any);
      host.generate(['selected.spec.mjs']);
      const source = fs.readFileSync(path.join(root, 'test-runner.mjs'), 'utf8');
      expect(source).toContain("await import('./selected.spec.mjs')");
      expect(source).not.toContain("await import('./stale.spec.mjs')");
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
