import {
  LOCALE_REGEX,
  readRawTranslationContent,
  readRawTranslationMetadata,
  writeRawTranslationContent, writeRawTranslationMetadata,
} from './translation-store.ts';
import { computeDigestForJson } from './crypto.ts';
import { compileRawTranslations } from "./compiler.ts";

export interface TranslationManagerInit {
  metadataPath: string;
  translationBasePath: string;
}

export const createTranslationManager = async (init: TranslationManagerInit): Promise<TranslationManager> => {
  const metadata = JSON.parse(await readRawTranslationMetadata(init.metadataPath));

  if (!validateMetadataSchema(metadata)) {
    throw new Error('Metadata failed schema validation');
  }

  console.log(`[init] Loaded translation metadata: ${metadata.map(entry => entry.locale).join(', ')}.`);

  const entries = await Promise.all(metadata.map(async entry => {
    console.log(`[init] [${entry.locale}] Initializing "${entry.title}".`);
    let processedEntry: TranslationEntry;

    try {
      const rawTranslationJson = await readRawTranslationContent(init.translationBasePath, entry.locale);
      processedEntry = await processTranslations(entry, rawTranslationJson);
    } catch (e: unknown) {
      console.error(`[init] [${entry.locale}] Failed to initialize.`, e);
      throw e;
    }

    console.log(`[init] [${entry.locale}] Initialized. (${processedEntry.digest})`);
    return processedEntry;
  }));

  const metadataInfo: TranslationMetadataInfo = {
    metadata: entries.map(({ locale, title, digest }) => ({ locale, title, cachedResourceId: getResourceId(locale, digest) })),
    digest: await computeDigestForPersistentMetadata(metadata)
  };
  return new TranslationManager(init, metadataInfo, Object.fromEntries(entries.map(e => [e.locale, e])));
};

const validateMetadataSchema = (metadata: unknown): metadata is PersistentTranslationMetadata[] => {
  const isValidLocale = (locale: unknown): locale is string => typeof locale === 'string' && LOCALE_REGEX.test(locale);
  const isValidTitle = (title: unknown): title is string => typeof title === 'string';

  return Array.isArray(metadata) && metadata.every(entry => isValidLocale(entry.locale) && isValidTitle(entry.title));
};

const processTranslations = async (
  { title, locale }: PersistentTranslationMetadata,
  rawTranslationJson: string
): Promise<TranslationEntry> => {
  const digest = await computeDigestForJson(rawTranslationJson);
  const translationJs = await compileRawTranslations(locale, rawTranslationJson);
  return { locale, title, rawTranslationJson, translationJs, digest };
};

const getResourceId = (locale: string, digest: string): string => `${locale}-${digest}.js`;

const computeDigestForPersistentMetadata = (metadata: PersistentTranslationMetadata[]): Promise<string> => {
  return computeDigestForJson(JSON.stringify(metadata));
};

export class TranslationManager {
  readonly metadataPath: string;
  readonly translationBasePath: string;
  metadataInfo: TranslationMetadataInfo;
  entries: Record<string, TranslationEntry>;

  constructor(init: TranslationManagerInit, metadataInfo: TranslationMetadataInfo, entries: Record<string, TranslationEntry>) {
    this.metadataPath = init.metadataPath;
    this.translationBasePath = init.translationBasePath;
    this.metadataInfo = metadataInfo;
    this.entries = entries;
  }

  getActiveTranslations(): TranslationMetadataInfo {
    return this.metadataInfo;
  }

  getTranslationJsByLocale(locale: string): WithDigest<{ translationJs: string }> | null {
    return this.entries[locale] ?? null;
  }

  getTranslationSourceJsonByLocale(locale: string): WithDigest<{ rawTranslationJson: string }> | null {
    return this.entries[locale] ?? null;
  }

  getAllTranslationSourceJsonByLocale(): Record<string, string> {
    return Object.fromEntries(
      Object.values(this.entries).map(e => ([e.locale, e.rawTranslationJson]))
    );
  }

  async upsertTranslations(
    locale: string,
    rawTranslationJson: string,
    metadata: Omit<PersistentTranslationMetadata, 'locale'>,
  ): Promise<FullTranslationMetadata> {
    console.log(`[${locale}] Upserting translations for "${metadata.title}".`);

    try {
      const compiledEntry = await processTranslations({ ...metadata, locale }, rawTranslationJson);
      const updatedMetadataInfo = await this.getUpdatedMetadataInfo(compiledEntry);

      await writeRawTranslationContent(this.translationBasePath, locale, rawTranslationJson);
      await writeRawTranslationMetadata(this.metadataPath, this.toPersistentMetadataJson(updatedMetadataInfo));

      this.metadataInfo = updatedMetadataInfo;
      this.entries[locale] = compiledEntry;

      console.log(`[${locale}] Upserted. (${compiledEntry.digest})`);
      return { locale, title: compiledEntry.title, cachedResourceId: getResourceId(locale, compiledEntry.digest) };
    } catch (e: unknown) {
      console.error(`[${locale}] Failed to upsert translations for "${metadata.title}".`, e);
      throw e;
    }
  }

  private async getUpdatedMetadataInfo({ locale, title, digest }: TranslationEntry): Promise<TranslationMetadataInfo> {
    const metadata = [...this.metadataInfo.metadata];
    const entryIndex = metadata.findIndex(entry => entry.locale === locale);

    if (entryIndex === -1) {
      metadata.push({ locale, title, cachedResourceId: getResourceId(locale, digest)});
    } else {
      metadata[entryIndex] = { locale, title, cachedResourceId: getResourceId(locale, digest) };
    }

    return { metadata, digest: await computeDigestForPersistentMetadata(metadata) };
  }

  private toPersistentMetadataJson({ metadata }: TranslationMetadataInfo): string {
    return JSON.stringify(metadata.map(({ locale, title }) => ({ locale, title })), null, 2);
  }
}

type WithDigest<T> = T & { digest: string };

interface TranslationEntry {
  locale: string;
  title: string;
  rawTranslationJson: string;
  translationJs: string;
  digest: string;
}

interface PersistentTranslationMetadata {
  locale: string;
  title: string;
}

interface FullTranslationMetadata extends PersistentTranslationMetadata {
  cachedResourceId: string;
}

type TranslationMetadataInfo = WithDigest<{ metadata: FullTranslationMetadata[] }>;
