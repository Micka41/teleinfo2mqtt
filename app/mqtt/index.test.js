/* eslint no-underscore-dangle: ["error", { "allow": ["__get__", "__set__"] }] */

const rewire = require('rewire');
const mqttAsync = require('async-mqtt');

mqttAsync.connectAsync = jest.fn(() => {
});
const mqtt = require('./index');

const sample = {
    ADCO: { raw: '012345678912', value: 12345678912 },
    OPTARIF: { raw: 'BASE', value: 'BASE' },
    ISOUSC: { raw: '45', value: 45 },
    BASE: { raw: '022304568', value: 22304568 },
    PTEC: { raw: 'TH..', value: 'TH' },
    IINST: { raw: '003', value: 3 },
    IMAX: { raw: '090', value: 90 },
    PAPP: { raw: '00720', value: 720 },
    HHPHC: { raw: 'A', value: 'A' },
};

test('connect should be called as expected', async () => {
    const moduleToTest = rewire('./index');
    moduleToTest.__set__('client', {
        publish: jest.fn(() => {
        }),
    });
    await mqtt.connect();
    expect(mqttAsync.connectAsync).toHaveBeenCalledWith('mqtt://localhost:1883', {});
});

test('disconnect should be called as expected', async () => {
    const moduleToTest = rewire('./index');
    moduleToTest.__set__('client', {
        end: jest.fn(() => {
        }),
    });
    await moduleToTest.disconnect();
    expect(moduleToTest.__get__('client').end).toHaveBeenCalledTimes(1);
});

test('publishFrame should be called as expected', () => {
    const moduleToTest = rewire('./index');
    moduleToTest.__set__('client', {
        publish: jest.fn(() => {
        }),
    });
    moduleToTest.__set__('discoveryConfigurationPublished', true);
    moduleToTest.publishFrame(sample);
    expect(moduleToTest.__get__('client').publish).toHaveBeenCalledWith('teleinfo/012345678912', JSON.stringify(sample));
});
