/*! resol-vbus | Copyright (c) 2013, Daniel Wippermann | MIT license */
'use strict';



var _ = require('lodash');


var HeaderSet = require('./resol-vbus').HeaderSet;
var Packet = require('./resol-vbus').Packet;

var TextConverter = require('./resol-vbus').TextConverter;



describe('TextConverter', function() {

    describe('constructor', function() {

        it('should be a constructor function', function() {
            expect(TextConverter).to.be.a('function');
        });
        
    });

    describe('#reset', function() {

        it('should be a method', function() {
            expect(TextConverter.prototype.reset).to.be.a('function');
        });

    });

    describe('readable stream', function() {

        var rawPacket1 = 'aa100053001000010b0020051000004a723d1000013f40571000015706100000016800000000007f00000000007f00000000007f00000000007f00007f00000025003600051f11000000006e';
        var rawPacket2 = 'aa1000217e100001013e00000b000074';
        var rawPacket3 = 'aa1000317e100001042b05774a00003900000000007f00000000007f130d0000005f';

        it('should work correctly', function() {
            var buffer1 = new Buffer(rawPacket1, 'hex');
            var packet1 = Packet.fromLiveBuffer(buffer1, 0, buffer1.length);
            packet1.timestamp = new Date(1387893006778);
            packet1.channel = 0;

            var buffer2 = new Buffer(rawPacket2, 'hex');
            var packet2 = Packet.fromLiveBuffer(buffer2, 0, buffer2.length);
            packet2.timestamp = new Date(1387893003303);
            packet2.channel = 1;

            var buffer3 = new Buffer(rawPacket3, 'hex');
            var packet3 = Packet.fromLiveBuffer(buffer3, 0, buffer3.length);
            packet3.timestamp = new Date(1387893003454);
            packet3.channel = 1;

            var headerSet = new HeaderSet({
                timestamp: new Date(1387893006829),
                headers: []
            });

            var converter = new TextConverter();

            var onData = sinon.spy();
            converter.on('data', onData);

            converter.convertHeaderSet(headerSet);

            headerSet = new HeaderSet({
                timestamp: new Date(1387893006829),
                headers: [ packet2, packet3 ]
            });

            converter.convertHeaderSet(headerSet);

            headerSet = new HeaderSet({
                timestamp: new Date(1387893006829),
                headers: [ packet1, packet2, packet3 ]
            });

            converter.convertHeaderSet(headerSet);

            converter.convertHeaderSet(headerSet);

            converter.reset();

            converter.convertHeaderSet(headerSet);

            expect(onData.callCount).to.equal(5);

            var chunk = onData.firstCall.args [0];

            expect(chunk).to.be.an('object');
            expect(chunk.toString()).to.equal('\r\nDate / Time\r\n12/24/2013 14:50:06\r\n');

            chunk = onData.secondCall.args [0];

            expect(chunk).to.be.an('object');
            expect(chunk.toString()).to.equal('\tVBus #1: DeltaSol MX [Heizkreis #1]\t\tVBus #1: DeltaSol MX [WMZ #1]\t\t\r\nDate / Time\tFlow set temperature [ °C]\tOperating status\tHeat quantity [ Wh]\tHeat quantity today [ Wh]\tHeat quantity week [ Wh]\r\n12/24/2013 14:50:06\t0.0\t11\t4880133\t0\t3347\r\n');

            chunk = onData.thirdCall.args [0];

            expect(chunk).to.be.an('object');
            expect(chunk.toString()).to.equal('\tDL3\t\t\t\t\t\t\t\t\t\t\tVBus #1: DeltaSol MX [Heizkreis #1]\t\tVBus #1: DeltaSol MX [WMZ #1]\t\t\r\nDate / Time\tResistor sensor 1 [ Ohm]\tResistor sensor 2 [ Ohm]\tResistor sensor 3 [ Ohm]\tCurrent sensor 4 [ mA]\tTemperature Sensor 1 [ °C]\tTemperature Sensor 2 [ °C]\tTemperature Sensor 3 [ °C]\tImpulse Counter Sensor 1\tImpulse Counter Sensor 2\tImpulse Counter Sensor 3\tIrradiation Sensor 4 [ W/m²]\tFlow set temperature [ °C]\tOperating status\tHeat quantity [ Wh]\tHeat quantity today [ Wh]\tHeat quantity week [ Wh]\r\n12/24/2013 14:50:06\t1049.888\t1064.434\t1071.040\t4.230\t12.7\t16.5\t18.2\t0\t0\t0\t17\t0.0\t11\t4880133\t0\t3347\r\n');

            chunk = onData.getCall(3).args [0];

            expect(chunk).to.be.an('object');
            expect(chunk.toString()).to.equal('12/24/2013 14:50:06\t1049.888\t1064.434\t1071.040\t4.230\t12.7\t16.5\t18.2\t0\t0\t0\t17\t0.0\t11\t4880133\t0\t3347\r\n');

            chunk = onData.getCall(4).args [0];

            expect(chunk).to.be.an('object');
            expect(chunk.toString()).to.equal('\tDL3\t\t\t\t\t\t\t\t\t\t\tVBus #1: DeltaSol MX [Heizkreis #1]\t\tVBus #1: DeltaSol MX [WMZ #1]\t\t\r\nDate / Time\tResistor sensor 1 [ Ohm]\tResistor sensor 2 [ Ohm]\tResistor sensor 3 [ Ohm]\tCurrent sensor 4 [ mA]\tTemperature Sensor 1 [ °C]\tTemperature Sensor 2 [ °C]\tTemperature Sensor 3 [ °C]\tImpulse Counter Sensor 1\tImpulse Counter Sensor 2\tImpulse Counter Sensor 3\tIrradiation Sensor 4 [ W/m²]\tFlow set temperature [ °C]\tOperating status\tHeat quantity [ Wh]\tHeat quantity today [ Wh]\tHeat quantity week [ Wh]\r\n12/24/2013 14:50:06\t1049.888\t1064.434\t1071.040\t4.230\t12.7\t16.5\t18.2\t0\t0\t0\t17\t0.0\t11\t4880133\t0\t3347\r\n');
        });

    });

});
