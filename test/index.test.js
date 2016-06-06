
import nock from 'nock';
import test from 'ava';

const url = process.env.PROTOCOL + process.env.HOST + ':' + process.env.PORT;

test.afterEach(t => {
   nock.cleanAll();
});

test('true should be true', t => {
    t.plan(1);

    t.true(true);
});
