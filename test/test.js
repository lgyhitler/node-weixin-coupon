'use strict';
var assert = require('assert');
var nodeWeixinCoupon = require('../').coupon;
var types = require('../lib/types');
var test_data = require('./test_data.json');
var settings = require('node-weixin-settings');

var app = {
    id: 'wx538c7c07ffbfa175',//process.env.APP_ID,
    secret: process.env.APP_SECRET,
    token: process.env.APP_TOKEN
};
app.auth = {
    accessToken: 'g_zJOqGLMFPGccG61XCreOZRGIpAd2TVznu5RACOmhpb7t3IjICcwPW57oZw0wQE8--xdXfsfN35nJJ-6lHWbKG_lcPzPuDeaVKd-vAWVgKDtIgsx_oV1yeuUv5NZKqfGFSiADAONA'
}
var accessToken = '-UbdOYFTH2E0WC5CB_DfoLKDg7EI1PuIMOt86u5V_emE34VqLviaR-7Wiau8H5gPwrrATdYhw9Jtg6RD1x3Py_Kp6FklC89ws9VKPIiZtLqAidYrGeGUaqt-3YhXgm5vRKNfAIDJCF';
var test_create_card = '';

describe('node-weixin-coupon node module', function () {

    it('should create a member card ', function(done){
        settings.set(app.id, 'auth', {accessToken: accessToken});
        var data = require('./test_member_card.json')
        nodeWeixinCoupon.membercard.create(settings, app, data, function(err, resp){
            console.log(err, resp)
            assert.equal(true, resp.errcode == 0)
            done();
        })
    })
    it('should activate a member card', function(done){
        var code = '988709537267';
        settings.set(app.id, 'auth', {accessToken: accessToken});
        nodeWeixinCoupon.membercard.activate(settings, app, {
            init_bonus: 5500,
            init_balance: 200,
            membership_number: code,
            code: code,
            init_custom_field_value1: "金卡会员"
        }, function(err, resp){
            console.log(err, resp)
            assert.equal(true, resp.errcode == 0)
            done();
        })
    })

    it('should update an user member card info', function(done){
        done();
    })

    it('should build a GROUPON coupon obj', function(done){
        var coupon = nodeWeixinCoupon
            .build_coupon(types.card_type.GROUPON, test_data.base_info, {deal_detail: 'detail'});
        assert.equal(true, coupon.card_type === 'GROUPON')
        assert.equal(true, coupon.groupon.deal_detail === 'detail')
        done()
    })

    it('should build a CASH coupon obj', function(done){
        var coupon = nodeWeixinCoupon
            .build_coupon(types.card_type.CASH, test_data.base_info, {least_cost: 10000, reduce_cost: 10000});
        assert.equal(true, coupon.card_type === 'CASH')
        assert.equal(true, coupon.cash.least_cost === 10000)
        done()
    })
    it('should build a DISCOUNT coupon obj', function(done){
        var coupon = nodeWeixinCoupon
            .build_coupon(types.card_type.DISCOUNT, test_data.base_info, {discount: 30});
        assert.equal(true, coupon.card_type === 'DISCOUNT')
        assert.equal(true, coupon.discount.discount === 30)
        done();
    })
    it('should build a GIFT coupon obj', function(done){
        var coupon = nodeWeixinCoupon
            .build_coupon(types.card_type.GIFT, test_data.base_info, {gift: 'gift'});
        assert.equal(true, coupon.card_type === 'GIFT')
        assert.equal(true, coupon.gift.gift === 'gift')
        done();
    })
    it('should build a GENERAL_COUPON coupon obj', function(done){
        var coupon = nodeWeixinCoupon
            .build_coupon(types.card_type.GENERAL_COUPON, test_data.base_info, {default_detail: 'default_detail'});
        assert.equal(true, coupon.card_type === 'GENERAL_COUPON')
        assert.equal(true, coupon.general_coupon.default_detail === 'default_detail')
        done()
    })
    it('should be able to create a coupon', function(done){
     var coupon = nodeWeixinCoupon
         .build_coupon(types.card_type.CASH, test_data.base_info,  {least_cost: 10000, reduce_cost: 10000});
         nodeWeixinCoupon.coupon.create(app, coupon, function(err, resp){
             //console.log(resp)
             assert.equal(true, !err);
             assert.equal(true, resp.errcode === 0);
             assert.equal(true, resp.errmsg === 'ok');
             test_create_card = resp.card_id
             done();
         })
     })
    it('should build a single qrcode obj', function(done){
        var qrcode = nodeWeixinCoupon.build_qrcode(test_data.qrcode_single_info);
        assert.equal(true, qrcode.action_name === 'QR_CARD');
        assert.equal(true, qrcode.action_info.card.card_id === test_data.qrcode_single_info.card_id)
        done()
    })
    it('should build a multiply qrcode obj', function(done){
        var qrcode = nodeWeixinCoupon.build_qrcode(test_data.qrcode_multi_info);
        assert.equal(true, qrcode.action_name === 'QR_MULTIPLE_CARD')
        assert.equal(true, typeof qrcode.action_info.multiple_card !== 'undefined')
        assert.equal(true, qrcode.action_info.multiple_card.card_list instanceof Array)
        done()
    })
    it('should create a landing_page', function(done){
        var landing_info = {
            banner: test_data.banner,
            page_title: '快乐帮大放纵',
            can_share: true,
            scene: types.landing_scene.SCENE_ARTICLE,
            card_list: [
                {
                    card_id: 'pcg3Rsh5wWKe6kCLULAIyBJE0-qU',
                    thumb_url: test_data.banner
                }
            ]
        }
        nodeWeixinCoupon.coupon.landing_page(app, landing_info, function(err, resp){
            //console.log(resp)
            assert.equal(true, !err);
            assert.equal(true, resp.errcode === 0)
            assert.equal(true, resp.errmsg === 'ok')
            done()
        })
    })
    it('should create a single qrcode img', function(done){
        var qrcode = nodeWeixinCoupon.build_qrcode(test_data.qrcode_single_info);
        nodeWeixinCoupon.coupon.qrcode(app, qrcode, function(err, resp){
            assert.equal(true, !err);
            assert.equal(true, resp.errcode === 0)
            assert.equal(true, resp.errmsg === 'ok')
            assert.notEqual(true, resp.ticket === '')
            done()
        })
    })
    it('should get a coupon detail info', function(done){
        nodeWeixinCoupon.coupon.get(app, test_create_card, function(err, resp){
            assert.equal(true, !err);
            assert.equal(true, resp.errcode === 0)
            assert.equal(true, resp.errmsg === 'ok')
            done()
        })
    })
    it('should be able to update a coupon info', function(done){
        var update_coupon = {
            card_id: test_create_card,
            cash: {
                base_info: {
                    logo_url: test_data.banner,
                    color: types.color.Color020,
                    notice: '不找零不退换，逾期概不兑换。',
                    description: '价值10元代金券1张，满100元可使用~'
                }
            }
        }
        nodeWeixinCoupon.coupon.update(app, update_coupon, function(err, resp){
            assert.equal(true, !err);
            assert.equal(true, resp.errcode === 0)
            assert.equal(true, resp.errmsg === 'ok')
            assert.equal(true, resp.send_check)
            done();
        })
    })
    it('should be able to increase +10 stock', function(done){
        nodeWeixinCoupon.coupon.modify_stock(app, test_create_card, 10, function(err, resp){
            assert.equal(true, !err);
            assert.equal(true, resp.errcode === 0)
            assert.equal(true, resp.errmsg === 'ok')
            done()
        })
    })
    it('should be able delete a coupon', function(done){
        nodeWeixinCoupon.coupon.remove(app, test_create_card, function(err, resp){
            assert.equal(true, !err);
            assert.equal(true, resp.errcode === 0)
            assert.equal(true, resp.errmsg === 'ok')
            done()
        })
    })
    it('should be able to get User cardlist', function(done){
        nodeWeixinCoupon.coupon.user_getcard_list(app, 'ocg3RskQSl1PtDC3KcNGpLKjVPL4', null, function(err, resp){
            //console.log(resp)
            assert.equal(true, !err);
            assert.equal(true, resp.errcode === 0)
            assert.equal(true, resp.errmsg === 'ok')
            assert.equal(true, resp.card_list instanceof Array)
            done();
        })
    })
    it('should be able to batch get card list', function(done){
        nodeWeixinCoupon.coupon.batch_get(app, 0, 5, [types.card_status.CARD_STATUS_VERIFY_OK,
            types.card_status.CARD_STATUS_DISPATCH], function(err, resp){
            assert.equal(true, resp.errcode === 0)
            assert.equal(true, resp.errmsg === 'ok')
            assert.equal(true, resp.total_num >= 0)
            assert.equal(true, resp.card_id_list.length >= 0)
            done();
        })
    });
    /*it('should consume a coupon', function(done){
        nodeWeixinCoupon.coupon.consume(app, null, '159107890887', function(err, resp){
            assert.equal(true, !err);
            assert.equal(true, resp.errcode === 0)
        })
    })*/

    /*it('should be able to unavaliable a coupon ', function(done){
        nodeWeixinCoupon.coupon.unavailable(app, null, '209819861317', function(err, resp){
            assert.equal(true, !err);
            assert.equal(true, resp.errcode === 0)
            assert.equal(true, resp.errmsg === 'ok')
            done()
        })
    })*/
    /*it('should be able to upload an image file', function (done) {
        nodeWeixinCoupon.coupon.uplogo(app, 'test/logo_test.jpg', function (err, resp) {
            console.log(err)
            console.log(resp)
            assert.equal(true, !err);
            assert.equal(true, resp.url !== '');
            assert.equal(true, resp.errcode !== 40009);
            done();
        })
    })*/

})
