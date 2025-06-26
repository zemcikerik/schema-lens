import { compileRawTranslations } from './compiler.ts';
import { asAbsolutePath, LOCALE_REGEX } from './translation-store.ts';
import { importJwtVerificationSecret } from './crypto.ts';
import { Context, Hono } from 'hono'
import { etag } from 'hono/etag';
import { jwt } from 'hono/jwt';
import { validator } from 'hono/validator';
import DefaultConfig from '../default-config.json' with { type: 'json' };
import { zipRawTranslations } from './zip.ts';
import { createTranslationManager } from './translation-manager.ts';
import { isJsonValid } from './helpers.ts';

const config = {
  jwtVerificationKey: Deno.env.get('JWT_VERIFY_KEY') ?? DefaultConfig.JWT_VERIFICATION_KEY,
  metadataPath: asAbsolutePath(Deno.env.get('METADATA_JSON_PATH') ?? DefaultConfig.METADATA_JSON_PATH),
  translationsPath: asAbsolutePath(Deno.env.get('TRANSLATIONS_PATH') ?? DefaultConfig.TRANSLATIONS_PATH),
};

const translationManager = await createTranslationManager({
  metadataPath: config.metadataPath,
  translationBasePath: config.translationsPath,
});

const publicApi = new Hono({ strict: false });
publicApi.get('/health', ctx => ctx.json({ health: 'ok' }));

publicApi.get('/translation', etag({ weak: true }), ctx => {
  const { metadata, digest } = translationManager.getActiveTranslations();
  return ctx.json(metadata, 200, { 'ETag': `W/"${digest}"` });
});

publicApi.get('/translation/:locale', etag({ weak: true }), ctx => {
  const localeWithOptionalDigest = ctx.req.param('locale');

  // group 1 matches locale (en_US, sk_SK), optional group 2 matches digest (f5a24e9a)
  // locale and digest are joined using hyphen; optional .js suffix is ignored
  const localeParamRegex = /^([a-z]{2}_[A-Z]{2})(?:-([\da-fA-F]{8}))?(?:\.js)?$/;
  const matches = localeParamRegex.exec(localeWithOptionalDigest);

  if (matches === null) {
    return ctx.body(null, 400);
  }

  const locale = matches[1];
  const digest = matches[2]?.toLowerCase();
  const entry = translationManager.getTranslationJsByLocale(locale);

  if (!entry || (digest && entry.digest !== digest)) {
    return ctx.body(null, 404);
  }

  return ctx.body(entry.translationJs, 200, {
    'Content-Type': 'application/javascript',
    'ETag': `W/"${entry.digest}"`,
    ...(digest ? { 'Cache-Control': 'max-age=31536000, immutable' } : {}),
  });
});


const privateApp = new Hono({ strict: false });
privateApp.use('*', jwt({ alg: 'HS512', secret: await importJwtVerificationSecret(config.jwtVerificationKey) }));
privateApp.use('*', async (ctx, next) => {
  const payload: { roles: string[] } = ctx.get('jwtPayload');
  return payload.roles.includes('ADMIN') ? await next() : ctx.body(null, 403);
});

const localeValidator = validator('param', (value: { locale: string }, ctx: Context) => {
  return LOCALE_REGEX.test(value.locale) ? value : ctx.body(null, 400);
});

privateApp.post('/translation/:locale/preview', localeValidator, async ctx => {
  if (!ctx.req.header('Content-Type')?.startsWith('application/json')) {
    return ctx.body(null, 400);
  }

  let rawTranslationsJson: string;
  try {
    rawTranslationsJson = JSON.stringify(await ctx.req.json(), null, 2);
  } catch (_: unknown) {
    return ctx.body(null, 400);
  }

  const result = await compileRawTranslations(ctx.req.valid('param').locale, rawTranslationsJson);
  return ctx.body(result, 200, {
    'Content-Type': 'application/javascript',
  });
});

privateApp.get('/translation/:locale/source', localeValidator, etag({ weak: true }), ctx => {
  const locale = ctx.req.valid('param').locale;
  const entry = translationManager.getTranslationSourceJsonByLocale(locale);

  if (!entry) {
    return ctx.body(null, 404);
  }

  return ctx.body(entry.rawTranslationJson, 200, {
    'Content-Type': 'application/json',
    'ETag': `W/"${entry.digest}"`,
  });
});

const translationDataValidator = validator('form', ({ metadata, source }, ctx) => {
  if (typeof metadata !== 'string' || typeof source !== 'string' || !isJsonValid(source)) {
    return ctx.body(null, 400);
  }

  let parsedMetadata: object;
  try {
    parsedMetadata = JSON.parse(metadata);
  } catch (_: unknown) {
    return ctx.body(null, 400);
  }

  if ('title' in parsedMetadata && typeof parsedMetadata.title === 'string' && parsedMetadata.title.length > 0) {
    const finalMetadata = { title: parsedMetadata.title };
    return { metadata: finalMetadata, source };
  }

  return ctx.body(null, 400);
});

privateApp.put('/translation/:locale', localeValidator, translationDataValidator, async ctx => {
  const { metadata, source } = ctx.req.valid('form');
  const locale = ctx.req.valid('param').locale;
  return ctx.json(await translationManager.upsertTranslations(locale, source, metadata));
});

privateApp.post('/translation/export', async ctx => {
  const entries = translationManager.getAllTranslationSourceJsonByLocale();
  return ctx.body(await zipRawTranslations(entries), 200, {
    'Content-Type': 'application/zip',
    'Content-Disposition': 'attachment; filename="translations.zip"',
  });
});

const app = new Hono({ strict: false });
app.route('/', publicApi);
app.route('/', privateApp);

export default { fetch: app.fetch } satisfies Deno.ServeDefaultExport;
