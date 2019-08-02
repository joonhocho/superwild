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
});

test.skip('compilePathWithParams benchmark', () => {
  const compiled = compilePathWithParams(
    '/foo/$fooId/bar/$barId/p/$pId/c/$cId/vote'
  );
  const t = Date.now();
  const n = 1000000;
  for (let i = 0; i < n; i += 1) {
    compiled({
      barId: 'LID',
      pId: 'PID',
      cId: 'CMID',
    });
  }
  console.log(Date.now() - t, (Date.now() - t) / n);
});
