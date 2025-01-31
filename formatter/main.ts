import { format } from 'sql-formatter';

const oraclePattern = new URLPattern({ pathname: '/oracle' });

const handleOracleSql = async (req: Request): Promise<Response> => {
  const sql = await req.text();
  const formattedSql = tryFormatOracleSql(sql);

  if (formattedSql === null) {
    return new Response(null, { status: 400 });
  }

  return new Response(formattedSql.trim(), {
    headers: { 'Content-Type': 'application/sql' },
    status: 200
  });
};

const tryFormatOracleSql = (sql: string): string | null => {
  try {
    return format(sql, {
      tabWidth: 2,
      useTabs: false,
      language: 'plsql',
      keywordCase: 'preserve',
      dataTypeCase: 'preserve',
      functionCase: 'preserve',
      identifierCase: 'preserve',
      indentStyle: 'standard',
      logicalOperatorNewline: 'before',
      expressionWidth: 80,
      linesBetweenQueries: 1,
      denseOperators: false,
      newlineBeforeSemicolon: false,
    });
  } catch (_: unknown) {
    return null;
  }
}

export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);

    if (!oraclePattern.test(url)) {
      return new Response(null, { status: 404 });
    }

    if (req.method !== 'POST') {
      return new Response(null, { status: 405 });
    }

    const contentType = req.headers.get('Content-Type');
    if (contentType !== 'application/sql' && !contentType?.startsWith('application/sql;')) {
      return new Response(null, { status: 400 });
    }

    try {
      return await handleOracleSql(req);
    } catch (ex: unknown) {
      console.error(ex);
      return new Response(null, { status: 500 });
    }
  },
} satisfies Deno.ServeDefaultExport;
