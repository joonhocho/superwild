// tslint:disable no-console
import { compilePathWithParams } from './compilePathWithParams';

test('compilePathWithParams', () => {
  const compiled = compilePathWithParams<{
    fooId?: string;
    barId?: string;
    pId?: string;
    cId?: string;
  }>('/foo/$fooId/bar/$barId/p/$pId/c/$cId/vote');

  expect(
    compiled({
      barId: 'LID',
      pId: 'PID',
      cId: 'CMID',
    })
  ).toBe('/foo/*/bar/LID/p/PID/c/CMID/vote');

  expect(
    compiled({
      barId: 'LID',
      pId: 'PID',
      cId: 'CMID',
    })
  ).toBe('/foo/*/bar/LID/p/PID/c/CMID/vote');

  expect(
    compilePathWithParams(
      '__foo__:fooId__bar__:barId__post__:pId__c__:cId__vote',
      {
        paramPrefix: ':',
        separator: '__',
        nilParam: 'NUL',
      }
    )({
      barId: null as any,
      pId: '',
      cId: 0 as any,
    })
  ).toBe('__foo__NUL__bar__NUL__post____c__0__vote');

  expect(
    compilePathWithParams('/a/${b}/$c/${d/', {
      paramPrefix: '${',
      paramSuffix: '}',
    })({
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    })
  ).toBe('/a/2/$c/${d/');
});

test('compilePathWithParams benchmark vs replace vs regexp', () => {
  const compiled = compilePathWithParams(
    '/foo/$fooId/bar/$barId/p/$pId/c/$cId/vote'
  );
  const n = 1000;
  const barId = 'BID';
  const pId = 'PID';
  const cId = 'CID';
  const map = { barId, pId, cId };
  let r1 = '';
  let r2 = '';
  let r3 = '';

  const t1 = Date.now();
  for (let i = 0; i < n; i += 1) {
    r1 = compiled(map);
  }
  const t2 = Date.now();
  console.log(t2 - t1, (t2 - t1) / n, r1);

  const t3 = Date.now();
  for (let i = 0; i < n; i += 1) {
    r2 = '/foo/$fooId/bar/$barId/p/$pId/c/$cId/vote'
      .replace('$fooId', '*')
      .replace('$barId', barId)
      .replace('$pId', pId)
      .replace('$cId', cId);
  }
  const t4 = Date.now();
  console.log(t4 - t3, (t4 - t3) / n, r2);

  const repl = (a: string): string => {
    const b = a.substring(1);
    return map.hasOwnProperty(b) ? (map as any)[b] : '*';
  };

  const t5 = Date.now();
  for (let i = 0; i < n; i += 1) {
    r3 = '/foo/$fooId/bar/$barId/p/$pId/c/$cId/vote'.replace(
      /\$(?:[^\/]+)/gi,
      repl
    );
  }
  const t6 = Date.now();
  console.log(t6 - t5, (t6 - t5) / n, r3);
});
