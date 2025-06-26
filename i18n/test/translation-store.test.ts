import { describe, it } from '@std/testing/bdd';
import { stub } from '@std/testing/mock';
import { expect } from '@std/expect';
import { readAvailableTranslationLocales, readRawTranslationContent, writeRawTranslationContent } from '../src/translation-store.ts';

describe('translation-store', () => {
  describe('readAvailableTranslationLocales', () => {
    type DirEntryStub = ({ isDirectory: true } | { isFile: true } | { isSymlink: true }) & Pick<Deno.DirEntry, 'name'>;

    const stubReadDir = (entries: DirEntryStub[]) => {
      const result: Deno.DirEntry[] = entries.map(entry =>
        ({ isDirectory: false, isFile: false, isSymlink: false, ...entry } satisfies Deno.DirEntry));

      const asAsyncIterator = async function* <T>(array: T[]): AsyncGenerator<T> {
        for (const item of array) {
          yield item;
        }
      };

      return stub(Deno, 'readDir', () => asAsyncIterator(result));
    };

    it('should read available locales from file system', async () => {
      using readDirStub = stubReadDir([
        { name: 'en_US.json', isFile: true },
        { name: 'sk_SK.json', isFile: true },
      ]);

      const result = await readAvailableTranslationLocales('/base/path');

      expect(result).toEqual(['en_US', 'sk_SK']);
      expect(readDirStub.calls).toHaveLength(1);
      expect(readDirStub.calls[0].args).toEqual(['/base/path']);
    });

    it('should throw error if directory is present in base path', async () => {
      using _readDirStub = stubReadDir([{ name: 'en_US.json', isDirectory: true }]);
      const resultPromise = readAvailableTranslationLocales('/base/path');
      await expect(resultPromise).rejects.toEqual(expect.any(Error));
    });

    it('should throw error if symbolic link is present in base path', async () => {
      using _readDirStub = stubReadDir([{ name: 'en_US.json', isSymlink: true }]);
      const resultPromise = readAvailableTranslationLocales('/base/path');
      await expect(resultPromise).rejects.toEqual(expect.any(Error));
    });

    it('should throw if file name does not match intended format', async () => {
      for (const invalidFileName of ['en-US.json', 'en_US.js', 'US_en.json', 'en_USS.json']) {
        using _readDirStub = stubReadDir([{ name: invalidFileName, isFile: true }]);
        const resultPromise = readAvailableTranslationLocales('/base/path');
        await expect(resultPromise).rejects.toEqual(expect.any(Error));
      }
    });
  });

  describe('readRawTranslationContent', () => {
    it('should read raw translation content for a given locale', async () => {
      using readTextFileStub = stub(Deno, 'readTextFile', () => Promise.resolve('{"KEY":"translation"}'));

      const [basePath, expectedReadPath] = Deno.build.os === 'windows'
        ? ['C:\\base\\path', 'C:\\base\\path\\en_US.json']
        : ['/base/path', '/base/path/en_US.json'];

      const result = await readRawTranslationContent(basePath, 'en_US');

      expect(result).toEqual('{"KEY":"translation"}');
      expect(readTextFileStub.calls).toHaveLength(1);
      expect(readTextFileStub.calls[0].args).toEqual([expectedReadPath]);
    });

    it('should throw error when provided locale is not valid', async () => {
      using readTextFileStub = stub(Deno, 'readTextFile', () => Promise.resolve('{}'));

      for (const invalidLocale of ['en-US', 'en_USS', 'US_en', 'invalid']) {
        const resultPromise = readRawTranslationContent('/base/path', invalidLocale);
        await expect(resultPromise).rejects.toEqual(expect.any(Error));
      }
      expect(readTextFileStub.calls).toHaveLength(0);
    });

    it('should throw error if raw translation content does not exist for a given locale', async () => {
      using _readTextFileStub = stub(Deno, 'readTextFile', () => Promise.reject(new Deno.errors.NotFound()));
      const resultPromise = readRawTranslationContent('/base/path', 'en_US');
      await expect(resultPromise).rejects.toEqual(expect.any(Deno.errors.NotFound));
    });
  });

  describe('writeRawTranslationContent', () => {
    it('should write raw translation content for a given locale', async () => {
      using writeTextFileStub = stub(Deno, 'writeTextFile', () => Promise.resolve());

      const [basePath, expectedWritePath] = Deno.build.os === 'windows'
        ? ['C:\\base\\path', 'C:\\base\\path\\en_US.json']
        : ['/base/path', '/base/path/en_US.json'];

      const rawTranslations = '{"KEY":"translation"}';
      await writeRawTranslationContent(basePath, 'en_US', rawTranslations);

      expect(writeTextFileStub.calls).toHaveLength(1);
      expect(writeTextFileStub.calls[0].args).toEqual([expectedWritePath, rawTranslations]);
    });

    it('should throw error when provided locale is not valid', async () => {
      using writeTextFileStub = stub(Deno, 'writeTextFile', () => Promise.resolve());

      for (const invalidLocale of ['en-US', 'en_USS', 'US_en', 'invalid']) {
        const resultPromise = writeRawTranslationContent('/base/path', invalidLocale, '{}');
        await expect(resultPromise).rejects.toEqual(expect.any(Error));
      }
      expect(writeTextFileStub.calls).toHaveLength(0);
    });

    it('should throw error if writing translation content fails', async () => {
      using _writeTextFileStub = stub(Deno, 'writeTextFile', () => Promise.reject(new Deno.errors.PermissionDenied()));
      const resultPromise = writeRawTranslationContent('/base/path', 'en_US', '{"KEY":"translation"}');
      await expect(resultPromise).rejects.toEqual(expect.any(Deno.errors.PermissionDenied));
    });
  });
});
