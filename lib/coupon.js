'use strict'
var validation = require('../conf/validation');
var types = require('./types');
var request = require("node-weixin-request");
var util = require("node-weixin-util");
var v = require('node-form-validator');
var setttings = require('node-weixin-settings');

var baseUrl = 'https://api.weixin.qq.com/card/'
var uploadUrl = 'https://api.weixin.qq.com/cgi-bin/media/'
//FIXME: 暂时不依赖settings模块
module.exports = {
    coupon: {
        get: function(app, card_id, cb){
            var url = baseUrl + 'get' + '?' + util.toParam({
                    access_token: app.auth.accessToken
                })
            request.json(url, {card_id: card_id}, cb)
        },
        remove: function(app, card_id, cb){
            var url = baseUrl + 'delete' + '?' + util.toParam({
                    access_token: app.auth.accessToken
                })
            request.json(url, {card_id: card_id}, cb)
        },
        create: function(app, data, cb){
            var url = baseUrl + 'create' + '?' + util.toParam({
                    access_token: app.auth.accessToken
                })
            request.json(url, {card: data}, cb)
        },
        update: function(app, data, cb){
            var url = baseUrl + 'update' + '?' + util.toParam({
                    access_token: app.auth.accessToken
                })
            request.json(url, data, cb)
        },
        upload_logo: function(app, path, cb){
            var url = uploadUrl + 'uploadimg' + '?' +util.toParam({
                    access_token: app.auth.accessToken
                })
            request.file(url, path, cb);
        },
        landing_page: function(app, data, cb){
            var url = baseUrl + 'landingpage/create' + '?' + util.toParam({
                    access_token: app.auth.accessToken
                })
            var error = {}
            if(!v.validate(data, validation.coupon.landing.create, error)){
                throw new Error(JSON.stringify(error))
                return;
            }
            request.json(url, data, cb)
        },
        qrcode: function(app, data, cb){
            var url = baseUrl + 'qrcode/create' + '?' + util.toParam({
                    access_token: app.auth.accessToken
                })
            request.json(url, data, cb)
        },
        query: function(app, card_id, code, cb){
            var url = baseUrl + 'code/get' + '?' + util.toParam({
                    access_token: app.auth.accessToken
                })
            request.json(url, {
                card_id: card_id,
                code: code,
                check_consume: true
            }, cb)
        },
        consume: function(app, card_id, code, cb){
            var url = baseUrl + 'code/consume' + '?' + util.toParam({
                    access_token: app.auth.accessToken
                })
            var data = {
                code: code
            }
            if(card_id) data.card_id = card_id
            request.json(url, data, cb);
        },
        decrypt: function(app, encrypt_code, cb){
            var url = baseUrl + 'code/decrypt' + '?' + util.toParam({
                    access_token: app.auth.accessToken
                })
            request.json(url, {encrypt_code: encrypt_code}, cb)
        },
        user_getcard_list: function(app, openid, card_id, cb){
            var url = baseUrl + 'user/getcardlist' + '?' + util.toParam({
                    access_token: app.auth.accessToken
                })
            var data = { openid: openid }
            if(card_id) data.card_id = card_id
            request.json(url, data, cb);
        },
        batch_get: function(app, offset, count, status_list, cb){
            var url = baseUrl + 'batchget?' + util.toParam({
                    access_token: app.auth.accessToken
                })
            var data = {
                offset: offset,
                count: count,
                status_list: status_list
            }
            request.json(url, data, cb);
        },
        paycell: function(){

        },
        modify_stock: function(app, card_id, value, cb){
            var url = baseUrl + 'modifystock' + '?' + util.toParam({
                    access_token: app.auth.accessToken
                })
            var data = { card_id: card_id }
            value >=0 ? data.increase_stock_value = value
                : data.reduce_stock_value = Math.abs(value)
            request.json(url, data, cb)
        },
        code_update: function(){

        },
        unavailable: function(app, card_id, code, cb){
            var url = baseUrl + 'code/unavailable' + '?' + util.toParam({
                    access_token: app.auth.accessToken
                })
            var data = {
                code: code
            }
            if(card_id) data.card_id = card_id
            request.json(url, data, cb)
        },
        get_card_bizuin_info: function(){

        },
        get_card_cardinfo: function(){

        },
        get_cardmember_cardinfo: function(){

        }
    },
    membercard: {
      create: function(settings, app, data, cb){
          settings.get(app.id, 'auth', function (authData) {
              var url = baseUrl + 'create' + '?' + util.toParam({
                      access_token: authData.accessToken
                  })
              request.json(url, {
                  card: {
                      card_type: types.card_type.MEMBER_CARD,
                      member_card: data
                  }
              }, cb)
          })
      },
      update: function(settings, app, data, cb){
          settings.get(app.id, 'auth', function (authData) {
            var url = 'https://api.weixin.qq.com/card/membercard/updateuser?' + util.toParam({
                    access_token: authData.accessToken
                })
              request.json(url, data, cb);
          })
      },
      activate: function(settings, app, data, cb){
        settings.get(app.id, 'auth', function (authData){
            var url = 'https://api.weixin.qq.com/card/membercard/activate?' + util.toParam({
                    access_token: authData.accessToken
                })
            request.json(url, data, cb);
        })
      },
      updateuser: function(settings, app, data, cb){
          settings.get(app.id, 'auth', function (authData){
              var url = 'https://api.weixin.qq.com/card/membercard/updateuser?' + util.toParam({
                      access_token: authData.accessToken
                  })
              request.json(url, data, cb);
          })
      }
    },
    validate:  function(coupon_info, coupon_type){
        var error = {}
        if(v.validate(coupon_info, validation.coupon.create[coupon_type], error)
            && v.validate(coupon_info.base_info, validation.coupon.create.base_info, error)){
            if(coupon_info.base_info.date_info.type === types.date_type.DATE_TYPE_FIX_TERM){
                if(coupon_info.base_info.date_info.fixed_term >= 0
                    && coupon_info.base_info.date_info.fixed_begin_term >= 0)
                    return true;
                throw new Error("date_info.type为DATE_TYPE_FIX_TERM时,必须指定fixed_term和fixed_begin_term");
                return false;
            }
            return true
        }
        throw new Error(JSON.stringify(error))
        return false
    },
    build_coupon: function(type, base_info, specific_info){
        var _self = this;
        var coupon = null;
        var coupon_ns = type.toLowerCase()
        coupon = {
            card_type: type
        }
        coupon[coupon_ns] = {
            base_info: base_info
        }
        if(type === 'GROUPON'){
            coupon.groupon.deal_detail = specific_info.deal_detail;
        }
        if(type === 'CASH') {
            coupon.cash.least_cost = specific_info.least_cost
            coupon.cash.reduce_cost = specific_info.reduce_cost
        }
        if(type === 'DISCOUNT'){
            coupon.discount.discount = specific_info.discount
        }
        if(type === 'GIFT'){
            coupon.gift.gift = specific_info.gift
        }
        if(type === 'GENERAL_COUPON'){
            coupon.general_coupon.default_detail = specific_info.default_detail
        }
        if(type === 'MEETING_TICKET'){
            coupon.meeting_ticket.meeting_detail = specific_info.meeting_detail
            coupon.meeting_ticket.map_url = specific_info.map_url
        }
        if(type === 'SCENIC_TICKET'){
            coupon.scenic_ticket.ticket_class = specific_info.ticket_class
            coupon.scenic_ticket.guide_url = specific_info.guide_url
        }
        if(type === 'MOVIE_TICKET'){
            coupon.movie_ticket.detail = specific_info.detail
        }
        if(type === 'BOARDING_PASS'){
            coupon.boarding_pass.from = specific_info.from
            coupon.boarding_pass.to = specific_info.to
            coupon.boarding_pass.flight = specific_info.flight
            coupon.boarding_pass.departure_time = specific_info.departure_time
            coupon.boarding_pass.landing_time = specific_info.landing_time
            coupon.boarding_pass.air_model = specific_info.air_model
        }
        // 校验
        if(_self.validate(coupon[coupon_ns], coupon_ns)){
            return coupon
        }
    },
    build_qrcode: function(qrcode_info){
        var qrcode = {
            action_name: 'QR_CARD'
        }
        if(qrcode_info.expire_seconds)
            qrcode.expire_seconds = qrcode_info.expire_seconds
        if(qrcode_info instanceof Array){
            qrcode.action_name = 'QR_MULTIPLE_CARD'
            qrcode.action_info = {
                multiple_card: {
                    card_list: qrcode_info
                }
            }
        }else{
            qrcode.action_info = {
                card: {
                    code: qrcode_info.code,
                    is_unique_code: qrcode_info.is_unique_code || false
                }
            }
            if(qrcode_info.card_id)
                qrcode.action_info.card.card_id = qrcode_info.card_id
            if(qrcode_info.openid)
                qrcode.action_info.card.openid = qrcode_info.openid
            if(qrcode_info.outer_id)
                qrcode.action_info.card.outer_id = qrcode_info.outer_id
            var error = {}
            if(!v.validate(qrcode.action_info.card, validation.coupon.qrcode.create, error)){
                throw new Error(JSON.stringify(error));
                return;
            }
        }
        return qrcode;
    }
}